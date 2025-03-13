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
    translation = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0, z: 0 };
    scale = { x: 1, y: 1, z: 1 };

    static async create(phases, name, gl) {
        return await new Entity()._init(phases, name, gl);
    }

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

        if (this.parent != null) {
            let parentModelMatrix = this.parent.modelMatrix;
            modelMatrix = modelMatrix.multiply(parentModelMatrix);
        }
        
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

        if (this.parent != null) {
            direction = Matrix.makeRotationX(this.parent.rotation.x).multiplyVector3(direction);
            direction = Matrix.makeRotationY(this.parent.rotation.y).multiplyVector3(direction);
            direction = Matrix.makeRotationZ(this.parent.rotation.z).multiplyVector3(direction);
        }

        return direction;
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