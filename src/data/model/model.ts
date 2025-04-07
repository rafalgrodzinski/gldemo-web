import { Material } from "data/material";
import { Vertex } from "data/vertex";

export abstract class Model {
    verticesCount!: number;
    material!: Material;
    verticesData!: Float32Array;

    protected async init(args: Array<any>): Promise<this> {
        let [vertices, material] = args as [Array<Vertex>, Material];

        this.verticesCount = vertices.length;
        this.material = material;

        this.verticesData = new Float32Array(this.verticesCount * Vertex.STRIDE_LENGTH);
        vertices.forEach((vertex, vertexIndex) => {
            this.verticesData.set(vertex.m, vertexIndex * Vertex.STRIDE_LENGTH);
        });

        return this;
    }
}