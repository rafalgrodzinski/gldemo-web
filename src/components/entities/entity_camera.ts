import { Entity, EntityKind } from "components/entities/entity";
import { Matrix } from "data/matrix";
import { Vector } from "data/vector";
import { Util } from "utils/util";
import { CoordsOrientation, Phase } from "renderer/renderer";
import { ShaderProgram } from "components/shader_program";
import { Input } from "utils/input";
import { Camera, CameraProjectionKind } from "../../data/camera";

export class EntityCamera extends Entity {
    camera!: Camera;
    private static movementMultiplier = 20;
    private coordsOrientation!: CoordsOrientation
    private projectionMatrix!: Matrix;

    static async create(phases: Array<Phase>, name: string, camera: Camera, coordsOrientation: CoordsOrientation): Promise<EntityCamera> {
        return await new EntityCamera().init([phases, name, camera, coordsOrientation]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, camera, coordsOrientation] = args as [Array<Phase>, string, Camera, CoordsOrientation];
        await super.init([phases, name, EntityKind.Camera]);
        this.camera = camera;
        this.coordsOrientation = coordsOrientation;
        this.projectionMatrix = Matrix.makeIdentity();
        return this;
    }

    #viewMatrix: Matrix = Matrix.makeIdentity();
    get viewMatrix(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#viewMatrix;
    }

    updateMatrices() {
        super.updateMatrices();

        let viewMatrix = Matrix.makeIdentity();
        viewMatrix = viewMatrix.translate(-this.translationGlobal.x, -this.translationGlobal.y, -this.translationGlobal.z);

        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                viewMatrix = viewMatrix.rotateZYX(0, this.rotationGlobal.y, this.rotationGlobal.x);
                break;
            case CoordsOrientation.RightHanded:
                viewMatrix = viewMatrix.rotateZYX(0, -this.rotationGlobal.y, -this.rotationGlobal.x);
                break;
        }

        this.#viewMatrix = viewMatrix;
    }

    resize(width: number, height: number) {
        switch (this.camera.projectionKind) {
            case CameraProjectionKind.Ortographic:
                this.projectionMatrix = Matrix.makeOrthographic(width/height, this.camera.width, this.camera.depth);
                break;
            case CameraProjectionKind.Perspective:
                this.projectionMatrix = Matrix.makePerspective(this.camera.angle, width/height, this.camera.depth);
                break;
        }
    }

    update(elapsedSeconds: number, input: Input ) {
        if (input.actions.primary) {
            this.arcballUpdate(input);
        } else if (!input.actions.primary && !input.actions.secondary) {
            this.flybyUpdate(elapsedSeconds, input);
        }
    }

    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        shaderProgram.setMatrix(gl, "u_projectionMatrix", this.projectionMatrix);
        shaderProgram.setMatrix(gl,"u_viewMatrix", this.viewMatrix);
        shaderProgram.setData3(gl, "u_cameraPosition", this.translationGlobal);
    }

    private arcballUpdate(input: Input) {
        let orientationMultiplier = this.coordsOrientation == CoordsOrientation.RightHanded ? 1 : -1;

        // X Angle
        let xAngle = this.rotation.x;
        if (this.translation.x != 0 || this.translation.y != 0 || this.translation.z != 0) {
            xAngle = Math.acos(
                Vector.xyz(this.translation.x, 0, this.translation.z)
                    .normalize()
                    .dot(
                        Vector.xyz(this.translation.x, this.translation.y, this.translation.z)
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
                Vector.xyz(0, 0, orientationMultiplier)
                    .dot(
                        Vector.xyz(this.translation.x, 0, this.translation.z)
                            .normalize()
                    )
            );
        }

        if (this.translation.x < 0)
            yAngle = Math.PI * 2 - yAngle;

        yAngle += input.look.horizontal;

        // Rotation
        this.rotation.x = -xAngle * orientationMultiplier;
        this.rotation.y = -yAngle * orientationMultiplier;

        // Translation
        let positionMatrix = Matrix.makeRotationZYX(0, yAngle, xAngle);
        let originVector = Vector.xyz(0, 0, Vector.xyz(this.translation.x, this.translation.y, this.translation.z).length() * orientationMultiplier);
        originVector.z += input.look.zoom * orientationMultiplier;
        this.translation = originVector.multiply(positionMatrix).data;
    }

    private flybyUpdate(elapsedSeconds: number, input: Input) {
        let orientationMultiplier = this.coordsOrientation == CoordsOrientation.RightHanded ? 1 : -1;

        this.rotation.x += input.look.vertical * orientationMultiplier;
        this.rotation.x = Util.clamp(this.rotation.x, -Math.PI / 2 + 0.01, Math.PI / 2 + 0.01)
        this.rotation.y += input.look.horizontal * orientationMultiplier;

        this.translation.x += (input.movement.right * Math.cos(this.rotation.y) - input.movement.forward * Math.sin(this.rotation.y)) * EntityCamera.movementMultiplier * elapsedSeconds;
        this.translation.y += input.movement.up * EntityCamera.movementMultiplier * elapsedSeconds;
        this.translation.z += (input.movement.forward * Math.cos(this.rotation.y) * Math.cos(this.rotation.x) + input.movement.right * Math.sin(this.rotation.y) * Math.cos(this.rotation.x)) * EntityCamera.movementMultiplier * elapsedSeconds;
    }
}