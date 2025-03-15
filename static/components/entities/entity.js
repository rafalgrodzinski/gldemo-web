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
    parent = null;
    children = [];
    translation = new Vector3(0, 0, 0);
    rotation = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);

    static async create(name) {
        return await new Entity()._init([], name, Entity.NODE);
    }

    async _init(phases, name, kind) {
        this.phases = phases;
        this.name = name;
        this.kind = kind;
        return this;
    }

    get modelMatrix() {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.multiply(Matrix.makeScale(this.scale.x, this.scale.y, this.scale.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
        modelMatrix = modelMatrix.multiply(Matrix.makeTranslation(this.translation.x, this.translation.y, this.translation.z));
        return modelMatrix;
    }

    get modelMatrixGlobal() {
        if (this.parent != null)
            return this.modelMatrix.multiply(this.parent.modelMatrixGlobal);
        else
            return this.modelMatrix;
    }

    get unscaledModelMatrix() {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
        modelMatrix = modelMatrix.multiply(Matrix.makeTranslation(this.translation.x, this.translation.y, this.translation.z));
        return modelMatrix;
    }

    get unscaledModelMatrixGlobal() {
        if (this.parent != null)
            return this.unscaledModelMatrix.multiply(this.parent.unscaledModelMatrixGlobal);
        else
            return this.unscaledModelMatrix;
    }

    get translationGlobal() {
        let modelMatrix = this.unscaledModelMatrixGlobal;
        let x = modelMatrix.m[4 * 3 + 0];
        let y = modelMatrix.m[4 * 3 + 1];
        let z = modelMatrix.m[4 * 3 + 2];
        return new Vector3(x, y, z);
    }

    get rotationGlobal() {
        if (this.parent != null)
            return this.rotation.add(this.parent.rotationGlobal);
        else 
            return this.rotation;
    }

    get scaleGlobal() {
        if (this.parent != null)
            return this.scale.multiply(this.parent.scaleGlobal);
        else 
            return this.scale;
    }

    get direction() {
        let direction = new Vector3(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationX(-this.rotation.x));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationY(-this.rotation.y));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));

        return rotationMatrix.multiplyVector3(direction);
    }

    get directionGlobal() {
        let direction = new Vector3(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationX(-this.rotationGlobal.x));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationY(-this.rotationGlobal.y));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationZ(this.rotationGlobal.z));

        return rotationMatrix.multiplyVector3(direction);
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    entitiesForPhase(phase) {
        let entities = [];

        if (this.phases.includes(phase))
            entities.push(this);

        this.children.forEach(child => {
            entities = entities.concat(child.entitiesForPhase(phase));
        });

        return entities;
    }

    resize(width, height) { }

    update(elapsedMiliseconds, input) { }

    prepareForDraw(gl, shaderProgram) { }

    draw(gl, shaderProgram) { }
}