import { Material } from "data/material";
import { Vertex } from "data/vertex";
import { Anim } from "./anim";

export abstract class Model {
    verticesCount!: number;
    framesData!: Float32Array;
    material!: Material;
    anims!: Array<Anim>;

    protected async init(args: Array<any>): Promise<this> {
        let [frames, material, anims] = args as [Array<Array<Vertex>>, Material, Array<Anim> | null];

        this.verticesCount = frames[0].length;
        this.framesData = new Float32Array(this.verticesCount * frames.length * Vertex.STRIDE_LENGTH);
        frames.forEach((frameVertices, frameIndex) => {
            frameVertices.forEach((vertex, vertexIndex) => {
                this.framesData.set(vertex.m, (frameIndex * this.verticesCount + vertexIndex) * Vertex.STRIDE_LENGTH);
            });
        });
        this.material = material;
        this.anims = anims ?? [];

        return this;
    }
}