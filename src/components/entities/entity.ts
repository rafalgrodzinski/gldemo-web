import { Input } from "utils/input";
import { ShaderProgram } from "shader_program";
import { Phase } from "renderer/renderer";
import { Matrix } from "data/matrix";
import { Data, Data3 } from "../../data/data_types";

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

    translation = Data.xyz(0);
    rotation = Data.xyz(0);
    scale = Data.xyz(1);

    parent: Entity | null = null;
    children: Array<Entity> = [];

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, kind] = args as [Array<Phase> | null, string, EntityKind];
        this.phases = phases ?? [];
        this.name = name;
        this.kind = kind;
        return this;
    }

    get translationGlobal(): Data3 {
        let modelMatrix = this.unscaledModelMatrixGlobal;
        let x = modelMatrix.r3c0;
        let y = modelMatrix.r3c1;
        let z = modelMatrix.r3c2;
        return Data.xyz(x, y, z);
    }

    get rotationGlobal(): Data3 {
        if (this.parent != null)
            return this.rotation.vector.add(this.parent.rotationGlobal.vector).data;
        else 
            return this.rotation;
    }

    get scaleGlobal(): Data3 {
        if (this.parent != null)
            return this.scale.vector.multiply(this.parent.scaleGlobal.vector).data;
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

    get direction(): Data3 {
        return this.modelMatrix.direction.data;
    }

    get directionGlobal(): Data3 {
        return this.modelMatrixGlobal.direction.data;
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
    update(elapsedSeconds: number, input: Input) { }
    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
}