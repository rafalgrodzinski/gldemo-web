import { EntityNode } from "./entity_node.js";
import { Matrix } from "utils/matrix.js";
import { Vector } from "utils/vector.js";
import { Util } from "utils/util";

export class EntityCamera extends EntityNode {
    static movementMultiplier = 0.1;

    #projectionMatrix = null;

    static async create(phases, name) {
        return await new EntityCamera()._init(phases, name);
    }

    async _init(phases, name) {
        await super._init(phases, name, EntityNode.CAMERA);

        this.#projectionMatrix = Matrix.makeIdentity();
        return this;
    }

    get viewMatrix() {
        let viewMatrix = Matrix.makeTranslation(-this.translationGlobal.x, -this.translationGlobal.y, -this.translationGlobal.z);
        viewMatrix = viewMatrix.multiply(Matrix.makeRotationY(-this.rotationGlobal.y));
        viewMatrix = viewMatrix.multiply(Matrix.makeRotationX(-this.rotationGlobal.x));
        return viewMatrix;
    }

    resize(width, height) {
        this.#projectionMatrix = Matrix.makePerspective(Math.PI / 2, width/height, 0.1, 100);
    }

    prepareForDraw(gl, shaderProgram) {
        let projectionMatrixId = gl.getUniformLocation(shaderProgram.program, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixId, false, this.#projectionMatrix.m);

        let viewMatrixId = gl.getUniformLocation(shaderProgram.program, "u_viewMatrix");
        gl.uniformMatrix4fv(viewMatrixId, false, this.viewMatrix.m)

        let cameraPositionId = gl.getUniformLocation(shaderProgram.program, "u_cameraPosition");
        gl.uniform3fv(cameraPositionId, this.translationGlobal.m);
    }

    update(elapsedMiliseconds, input) {
        if (input.actions.primary) {
            this.#arcballUpdate(input);
        } else if (!input.actions.primary && !input.actions.secondary) {
            this.#flybyUpdate(elapsedMiliseconds, input);
        }
    }

    #arcballUpdate(input) {
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

    #flybyUpdate(elapsedMiliseconds, input) {
        this.rotation.x += input.look.vertical;
        this.rotation.x = Util.clamp(this.rotation.x, -Math.PI/2 + 0.01, Math.PI/2 + 0.01)
        this.rotation.y += input.look.horizontal;

        this.translation.x += input.movement.right * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) -
            input.movement.forward * EntityCamera.movementMultiplier * Math.sin(this.rotation.y);
        this.translation.y += input.movement.up * EntityCamera.movementMultiplier
        this.translation.z += input.movement.forward * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) * Math.cos(this.rotation.x) +
            input.movement.right * EntityCamera.movementMultiplier * Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
    }
}