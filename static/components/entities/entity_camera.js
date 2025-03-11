import { Entity } from "/components/entities/entity.js";
import { Matrix } from "/utils/matrix.js";
import { Vector3 } from "/utils/vector.js";
import { Util } from "/utils/util.js";

export class EntityCamera extends Entity {
    static movementMultiplier = 0.1;

    #projectionMatrix = null;

    static async create(name) {
        return await new EntityCamera()._init(name);
    }

    async _init(name) {
        await super._init(name);

        this.#projectionMatrix = Matrix.makeIdentity();
        return this;
    }

    get viewMatrix() {
        let viewMatrix = Matrix.makeTranslation(-this.translation.x, -this.translation.y, -this.translation.z);
        
        viewMatrix = viewMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        viewMatrix = viewMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
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
        let xAngle = Math.acos(
            new Vector3(this.translation.x, 0, this.translation.z)
                .normalized()
                .dot(
                    new Vector3(this.translation.x, this.translation.y, this.translation.z)
                        .normalized()
                )
        );

        if (this.translation.y > 0)
            xAngle = -xAngle;

        xAngle += input.look.vertical;
        xAngle = Util.clamp(xAngle, -Math.PI/2, Math.PI/2);

        // Y Angle
        let yAngle = Math.acos(
            new Vector3(0, 0, 1)
                .dot(
                    new Vector3(this.translation.x, 0, this.translation.z)
                        .normalized()
                )
        );
        if (this.translation.x < 0)
            yAngle = Math.PI * 2 - yAngle;
        yAngle -= input.look.horizontal;

        // Rotation
        this.rotation.x = xAngle;
        this.rotation.y = yAngle;

        // Translation
        let positionMatrix = Matrix.makeRotationY(yAngle);
        positionMatrix = positionMatrix.multiply(Matrix.makeRotationX(xAngle));
        let originVector = new Vector3(0, 0, new Vector3(this.translation.x, this.translation.y, this.translation.z).length());
        originVector.z += input.look.zoom;
        this.translation = positionMatrix.multiplyVector3(originVector);
    }

    #flybyUpdate(elapsedMiliseconds, input) {
        this.rotation.x -= input.look.vertical;
        this.rotation.x = Util.clamp(this.rotation.x, -Math.PI/2 + 0.01, Math.PI/2 + 0.01)
        this.rotation.y -= input.look.horizontal;

        this.translation.x += input.movement.right * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) +
            input.movement.forward * EntityCamera.movementMultiplier * Math.sin(this.rotation.y);
        this.translation.y += input.movement.up * EntityCamera.movementMultiplier
        this.translation.z += input.movement.forward * EntityCamera.movementMultiplier * Math.cos(this.rotation.y) * Math.cos(this.rotation.x) -
            input.movement.right * EntityCamera.movementMultiplier * Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
    }
}