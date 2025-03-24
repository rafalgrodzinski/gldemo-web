import { Material } from "utils/material";
import { Vertex } from "utils/vertex";

export abstract class Model {
    verticesData!: Float32Array;
    verticesCount!: number;
    material!: Material;

    protected async init(args: Array<any>): Promise<this> {
        let [vertices, material] = args as [Array<Vertex>, Material];

        this.verticesData = new Float32Array(vertices.length * Vertex.STRIDE_LENGTH);
        vertices.forEach((vertex, i) => {
            this.verticesData.set(vertex.m, i * Vertex.STRIDE_LENGTH);
        });
        this.verticesCount = vertices.length;
        this.material = material;

        return this;
    }
}