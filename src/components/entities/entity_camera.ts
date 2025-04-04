import { Entity, EntityKind } from "components/entities/entity";
import { Matrix } from "data/matrix";
import { Vector } from "data/vector";
import { Util } from "utils/util";
import { CoordsOrientation, Phase } from "renderer/renderer";
import { ShaderProgram } from "components/shader_program";
import { Input } from "utils/input";

export class EntityCamera extends Entity {
    private static movementMultiplier = 0.1;
    private coordsOrientation!: CoordsOrientation

    private projectionMatrix!: Matrix;

    static async create(phases: Array<Phase>, name: string, coordsOrientation: CoordsOrientation): Promise<EntityCamera> {
        return await new EntityCamera().init([phases, name, coordsOrientation]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, coordsOrientation] = args as [Array<Phase>, string, CoordsOrientation];
        await super.init([phases, name, EntityKind.Camera]);
        this.coordsOrientation = coordsOrientation;
        this.projectionMatrix = Matrix.makeIdentity();
        return this;
    }

    get viewMatrix(): Matrix {
        let viewMatrix = Matrix.makeTranslation(-this.translationGlobal.x, -this.translationGlobal.y, -this.translationGlobal.z);

        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                viewMatrix = viewMatrix.multiply(Matrix.makeRotationY(this.rotationGlobal.y));
                viewMatrix = viewMatrix.multiply(Matrix.makeRotationX(this.rotationGlobal.x));
                break;
            case CoordsOrientation.RightHanded:
                viewMatrix = viewMatrix.multiply(Matrix.makeRotationY(-this.rotationGlobal.y));
                viewMatrix = viewMatrix.multiply(Matrix.makeRotationX(-this.rotationGlobal.x));
                break;
        }
        return viewMatrix;
    }

    resize(width: number, height: number) {
        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                this.projectionMatrix = Matrix.makePerspectiveLeft(Math.PI * 0.5, width/height, 100);
                break;
            case CoordsOrientation.RightHanded:
                this.projectionMatrix = Matrix.makePerspectiveRight(Math.PI * 0.5, width/height, 100);
                break;
        }
    }

    update(elapsedMiliseconds: number, input: Input ) {
        if (input.actions.primary) {
            this.arcballUpdate(input);
        } else if (!input.actions.primary && !input.actions.secondary) {
            this.flybyUpdate(elapsedMiliseconds, input);
        }
    }

    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let projectionMatrixId = gl.getUniformLocation(shaderProgram.program, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixId, false, this.projectionMatrix.m);

        let viewMatrixId = gl.getUniformLocation(shaderProgram.program, "u_viewMatrix");
        gl.uniformMatrix4fv(viewMatrixId, false, this.viewMatrix.m)

        let cameraPositionId = gl.getUniformLocation(shaderProgram.program, "u_cameraPosition");
        gl.uniform3fv(cameraPositionId, this.translationGlobal.m);
    }

    private arcballUpdate(input: Input) {
        // X Angle
        let xAngle = this.rotation.x;
        if (this.translation.x != 0 || this.translation.y != 0 || this.translation.z != 0) {
            xAngle = Math.acos(
                new Vector(this.translation.x, 0, this.translation.z)
                    .normalize()
                    .dot(
                        new Vector(this.translation.x, this.translation.y, this.translation.z)
                            .normalize()
                    )
            );
        }

        if (this.translation.y > 0)
            xAngle = -xAngle;

        xAngle += input.look.vertical;
        xAngle = Util.clamp(xAngle, -Math.PI/2, Math.PI/2);

        // Y Angle
        let yAngle = this.rotation.y;
        if (this.translation.x != 0 || this.translation.y != 0 || this.translation.z != 0) {
            yAngle = Math.acos(
                new Vector(0, 0, 1)
                    .dot(
                        new Vector(this.translation.x, 0, this.translation.z)
                            .normalize()
                    )
            );
        }

        if (this.translation.x < 0)
            yAngle = Math.PI * 2 - yAngle;

        yAngle += input.look.horizontal;

        // Rotation
        this.rotation.x = -xAngle;
        this.rotation.y = -yAngle;

        // Translation
        let positionMatrix = Matrix.makeRotationY(yAngle);
        positionMatrix = positionMatrix.multiply(Matrix.makeRotationX(xAngle));
        let originVector = new Vector(0, 0, new Vector(this.translation.x, this.translation.y, this.translation.z).length());
        originVector.z += input.look.zoom;
        this.translation = positionMatrix.multiplyVector(originVector);
    }

    private flybyUpdate(elapsedMiliseconds: number, input: Input) {
        this.rotation.x += input.look.vertical;
        this.rotation.x = Util.clamp(this.rotation.x, -Math.PI / 2 + 0.01, Math.PI / 2 + 0.01)
        this.rotation.y += input.look.horizontal;

        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                this.translation.x += input.movement.right * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) +
                    input.movement.forward * EntityCamera.movementMultiplier * Math.sin(this.rotation.y);
                this.translation.y += input.movement.up * EntityCamera.movementMultiplier
                this.translation.z += input.movement.forward * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) * Math.cos(this.rotation.x) -
                    input.movement.right * EntityCamera.movementMultiplier * Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
                break;
            case CoordsOrientation.RightHanded:
                this.translation.x += input.movement.right * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) -
                    input.movement.forward * EntityCamera.movementMultiplier * Math.sin(this.rotation.y);
                this.translation.y += input.movement.up * EntityCamera.movementMultiplier
                this.translation.z += input.movement.forward * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) * Math.cos(this.rotation.x) +
                    input.movement.right * EntityCamera.movementMultiplier * Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
                break;
        }
    }
}