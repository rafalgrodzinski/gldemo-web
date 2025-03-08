import { Matrix } from "/utils/matrix.js";

export class Entity {
    static async create(name) {
        return await new Entity().init(name);
    }

    async _init(name) {
        this.name = name;
        this.translation = { x: 1.3, y: -2.3, z: -4 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
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

    draw() { }
}