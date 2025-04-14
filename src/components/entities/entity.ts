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
        let x = modelMatrix.r0c3;
        let y = modelMatrix.r1c3;
        let z = modelMatrix.r2c3;
        return new Vector(x, y, z);
    }

    get rotationGlobal(): Vector {
        if (this.parent != null)
            return this.parent.rotationGlobal.add(this.rotation);
        else 
            return this.rotation;
    }

    get scaleGlobal(): Vector {
        if (this.parent != null)
            return this.parent.scaleGlobal.multiply(this.scale);
        else 
            return this.scale;
    }

    get modelMatrix(): Matrix {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.translate(this.translation.x, this.translation.y, this.translation.z);
        modelMatrix = modelMatrix.rotateX(this.rotation.x);
        modelMatrix = modelMatrix.rotateY(this.rotation.y);
        modelMatrix = modelMatrix.rotateZ(this.rotation.z);
        modelMatrix = modelMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
        return modelMatrix;
    }

    get modelMatrixGlobal(): Matrix {
        if (this.parent != null)
            return this.parent.modelMatrixGlobal.multiply(this.modelMatrix);
        else
            return this.modelMatrix;
    }

    get unscaledModelMatrix(): Matrix {
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.translate(this.translation.x, this.translation.y, this.translation.z);
        modelMatrix = modelMatrix.rotateX(this.rotation.x);
        modelMatrix = modelMatrix.rotateY(this.rotation.y);
        modelMatrix = modelMatrix.rotateZ(this.rotation.z);
        return modelMatrix;
    }

    get unscaledModelMatrixGlobal(): Matrix {
        if (this.parent != null)
            return this.parent.unscaledModelMatrixGlobal.multiply(this.unscaledModelMatrix);
        else
            return this.unscaledModelMatrix;
    }

    get direction(): Vector {
        let direction = new Vector(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.rotateX(this.rotation.x);
        rotationMatrix = rotationMatrix.rotateY(this.rotation.y);
        rotationMatrix = rotationMatrix.rotateZ(this.rotation.z);

        return direction.multiply(rotationMatrix);
    }

    get directionGlobal(): Vector {
        let direction = new Vector(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.rotateX(this.rotationGlobal.x);
        rotationMatrix = rotationMatrix.rotateY(this.rotationGlobal.y);
        rotationMatrix = rotationMatrix.rotateZ(this.rotationGlobal.z);

        return direction.multiply(rotationMatrix);
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