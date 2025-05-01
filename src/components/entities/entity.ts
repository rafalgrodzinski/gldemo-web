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
    private static entitiesCount = 0;

    phases!: Array<Phase>;
    name!: string;
    kind!: EntityKind;
    id!: number;

    parent: Entity | null = null;
    children: Array<Entity> = [];

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, kind] = args as [Array<Phase> | null, string, EntityKind];
        this.phases = phases ?? [];
        this.name = name;
        this.kind = kind;
        this.id = ++Entity.entitiesCount;
        return this;
    }

    #translation = Data.xyz(0);
    get translation(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#translation;
    }
    set translation(newValue: Data3) {
        this.#translation = newValue;
        this.updateMatrices();
    }
    #translationGlobal = Data.xyz(0);
    get translationGlobal(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#translationGlobal;
    }

    #rotation = Data.xyz(0);
    get rotation(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#rotation;
    }
    set rotation(newValue: Data3) {
        this.#rotation = newValue;
        this.updateMatrices();
    }
    #rotationGlobal = Data.xyz(0);
    get rotationGlobal(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#rotationGlobal;
    }

    #scale = Data.xyz(1);
    get scale(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#scale;
    }
    set scale(newValue: Data3) {
        this.#scale = newValue;
        this.updateMatrices();
    }
    #scaleGlobal = Data.xyz(1);
    get scaleGlobal(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#scaleGlobal;
    }

    #modelMatrix: Matrix = Matrix.makeIdentity();
    get modelMatrix(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#modelMatrix;
    }
    #modelMatrixGlobal: Matrix = Matrix.makeIdentity();
    get modelMatrixGlobal(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#modelMatrixGlobal;
    }

    #unscaledModelMatrix: Matrix = Matrix.makeIdentity();
    get unscaledModelMatrix(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#unscaledModelMatrix;
    }
    #unscaledModelMatrixGlobal: Matrix = Matrix.makeIdentity();
    get unscaledModelMatrixGlobal(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#unscaledModelMatrixGlobal;
    }

    #direction = Data.xyz(0);
    get direction(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#direction;
    }
    #directionGlobal = Data.xyz(0);
    get directionGlobal(): Data3 {
        this.updateMatricesIfNeeded();
        return this.#directionGlobal;
    }

    protected updateMatricesIfNeeded() {
        if (this.#translation.isDirty || this.#rotation.isDirty || this.#scale.isDirty) {
            this.#translation.isDirty = false;
            this.#rotation.isDirty = false;
            this.#scale.isDirty = false;
            this.updateMatrices();
        }
    }

    updateMatrices() {
        // Model matrix
        let modelMatrix = Matrix.makeIdentity();
        modelMatrix = modelMatrix.scale(this.#scale.x, this.#scale.y, this.#scale.z);
        modelMatrix = modelMatrix.rotateXYZ(this.#rotation.x, this.#rotation.y, this.#rotation.z);
        modelMatrix = modelMatrix.translate(this.#translation.x, this.#translation.y, this.#translation.z);
        this.#modelMatrix = modelMatrix;

        if (this.parent != null)
            this.#modelMatrixGlobal = modelMatrix.multiply(this.parent.modelMatrixGlobal);
        else
            this.#modelMatrixGlobal = modelMatrix;

        // Unscaled model matrix
        let unscaledModelMatrix = Matrix.makeIdentity();
        unscaledModelMatrix = unscaledModelMatrix.rotateXYZ(this.#rotation.x, this.#rotation.y, this.#rotation.z);
        unscaledModelMatrix = unscaledModelMatrix.translate(this.#translation.x, this.#translation.y, this.#translation.z);
        this.#unscaledModelMatrix = unscaledModelMatrix;

        if (this.parent != null)
            this.#unscaledModelMatrixGlobal = unscaledModelMatrix.multiply(this.parent.unscaledModelMatrixGlobal);
        else
            this.#unscaledModelMatrixGlobal = unscaledModelMatrix;

        // Direction
        this.#direction = modelMatrix.direction.data;
        this.#directionGlobal = this.#modelMatrixGlobal.direction.data;

        // Translation global
        let globalX = this.#unscaledModelMatrixGlobal.r3c0;
        let globalY = this.#unscaledModelMatrixGlobal.r3c1;
        let globalZ = this.#unscaledModelMatrixGlobal.r3c2;
        this.#translationGlobal = Data.xyz(globalX, globalY, globalZ);

        // Rotation global
        if (this.parent != null)
            this.#rotationGlobal = this.#rotation.vector.add(this.parent.rotationGlobal.vector).data;
        else
            this.#rotationGlobal = this.#rotation;

        // Scale global
        if (this.parent != null)
            this.#scaleGlobal = this.#scale.vector.multiply(this.parent.scaleGlobal.vector).data;
        else
            this.#scaleGlobal = this.#scale;

        // Update children
        this.children.forEach(child => {
            child.updateMatrices();
        });
    }

    addChild(child: Entity) {
        child.parent = this;
        this.children.push(child);
        child.updateMatrices();
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

    entityForId(id: number): Entity | null {
        if (this.id == id)
            return this;

        for (let child of this.children) {
            let entity = child.entityForId(id);
            if (entity != null)
                return entity;
        }

        return null;
    }

    resize(width:number , height: number) { }
    update(elapsedSeconds: number, input: Input) { }
    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) { }
}