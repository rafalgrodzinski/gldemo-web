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
        let x = modelMatrix.r3c0;
        let y = modelMatrix.r3c1;
        let z = modelMatrix.r3c2;
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
        modelMatrix = modelMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
        modelMatrix = modelMatrix.rotateXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
        modelMatrix = modelMatrix.translate(this.translation.x, this.translation.y, this.translation.z);
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
        modelMatrix = modelMatrix.rotateXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
        modelMatrix = modelMatrix.translate(this.translation.x, this.translation.y, this.translation.z);
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
        rotationMatrix = rotationMatrix.rotateXYZ(-this.rotation.x, -this.rotation.y, this.rotation.z);

        return direction.multiply(rotationMatrix);
    }

    get directionGlobal(): Vector {
        let direction = new Vector(0, 0, -1);

        let rotationMatrix = Matrix.makeIdentity();
        rotationMatrix = rotationMatrix.rotateXYZ(-this.rotationGlobal.x, -this.rotationGlobal.y, this.rotationGlobal.z);

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