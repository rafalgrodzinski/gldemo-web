import { Matrix } from "/utils/matrix.js";
import { Vector3 } from "/utils/vector.js";

export class Entity {
    static NODE="node";
    static LIGHT="light";
    static CAMERA="camera";
    static MODEL="model";

    phases = null;
    name = null;
    kind = null;
    translation = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0, z: 0 };
    scale = { x: 1, y: 1, z: 1 };

    async _init(phases, name, kind) {
        this.phases = phases;
        this.name = name;
        this.kind = kind;
        return this;
    }

    get modelMatrix() {
        let modelMatrix = Matrix.makeScale(this.scale.x, this.scale.y, this.scale.z);
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeTranslation(this.translation.x, this.translation.y, this.translation.z));
        
        return modelMatrix;
    }

    get position() {
        return this.translation;
    }

    get direction() {
        let direction = new Vector3(0, 0, -1);
        direction = Matrix.makeRotationX(this.rotation.x).multiplyVector3(direction);
        direction = Matrix.makeRotationY(this.rotation.y).multiplyVector3(direction);
        direction = Matrix.makeRotationZ(this.rotation.z).multiplyVector3(direction);
        return direction;
    }

    resize(width, height) { }
    update(elapsedMiliseconds, input) { }
    prepareForDraw(gl, shaderProgram) { }
    draw(gl, shaderProgram) { }
}