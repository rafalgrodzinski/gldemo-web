import { Input } from "utils/input";
import { ShaderProgram } from "shader_program";
import { Phase } from "renderer/renderer";
import { Vector } from "data/vector";
import { Matrix } from "data/matrix";

export enum EntityKind {
    Node,
    Light,
    Camera,
    Model
}

export abstract class Entity {
    phases!: Array<Phase>;
    name!: string;
    kind!: EntityKind;

    translation: Vector = new Vector(0, 0, 0);
    rotation: Vector = new Vector(0, 0, 0);
    scale: Vector = new Vector(1, 1, 1);

    parent: Entity | null = null;
    children: Array<Entity> = [];

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, kind] = args as [Array<Phase> | null, string, EntityKind];
        this.phases = phases ?? [];
        this.name = name;
        this.kind = kind;
        return this;
    }

    get translationGlobal(): Vector {
        let modelMatrix = this.unscaledModelMatrixGlobal;
        let x = modelMatrix.m[4 * 3 + 0];
        let y = modelMatrix.m[4 * 3 + 1];
        let z = modelMatrix.m[4 * 3 + 2];
        return new Vector(x, y, z);
    }

    get rotationGlobal(): Vector {
        if (this.parent != null)
            return this.rotation.add(this.parent.rotationGlobal);
        else 
            return this.rotation;
    }

    get scaleGlobal(): Vector {
        if (this.parent != null)
            return this.scale.multiply(this.parent.scaleGlobal);
        else 
            return this.scale;
    }

    get modelMatrix(): Matrix {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.multiply(Matrix.makeScale(this.scale.x, this.scale.y, this.scale.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
        modelMatrix = modelMatrix.multiply(Matrix.makeTranslation(this.translation.x, this.translation.y, this.translation.z));
        return modelMatrix;
    }

    get modelMatrixGlobal(): Matrix {
        if (this.parent != null)
            return this.modelMatrix.multiply(this.parent.modelMatrixGlobal);
        else
            return this.modelMatrix;
    }

    get unscaledModelMatrix(): Matrix {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        modelMatrix = modelMatrix.multiply(Matrix.makeRotationX(this.rotation.x));
        modelMatrix = modelMatrix.multiply(Matrix.makeTranslation(this.translation.x, this.translation.y, this.translation.z));
        return modelMatrix;
    }

    get unscaledModelMatrixGlobal(): Matrix {
        if (this.parent != null)
            return this.unscaledModelMatrix.multiply(this.parent.unscaledModelMatrixGlobal);
        else
            return this.unscaledModelMatrix;
    }

    get direction(): Vector {
        let direction = new Vector(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationX(-this.rotation.x));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationY(-this.rotation.y));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationZ(this.rotation.z));

        return rotationMatrix.multiplyVector(direction);
    }

    get directionGlobal(): Vector {
        let direction = new Vector(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationX(-this.rotationGlobal.x));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationY(-this.rotationGlobal.y));
        rotationMatrix = rotationMatrix.multiply(Matrix.makeRotationZ(this.rotationGlobal.z));

        return rotationMatrix.multiplyVector(direction);
    }

    addChild(child: Entity) {
        child.parent = this;
        this.children.push(child);
    }

    entitiesForPhase(phase: Phase) {
        let entities: Array<Entity> = [];

        if (this.phases.includes(phase))
            entities.push(this);

        this.children.forEach(child => {
            entities = entities.concat(child.entitiesForPhase(phase));
        });

        return entities;
    }

    resize(width:number , height: number) { }
    update(elapsedMiliseconds: number, input: Input) { }
    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
}