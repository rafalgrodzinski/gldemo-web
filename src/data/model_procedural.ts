import { Model } from "data/model";
import { Material } from "utils/material";
import { Vertex } from "utils/vertex";
import { Vector } from "utils/vector";

export enum ModelProceduralKind {
    Cube,
    Pyramid,
    Sphere
}

export class ModelProcedural extends Model {
    private static cubeVertices = [
        // Front
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 0, t: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 1, t: 0 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 1, t: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, { s: 1, t: 1 }),
        // Back
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 0, t: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 0, t: 1 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 1, t: 1 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 0, t: 0 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 1, t: 1 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, { s: 1, t: 0 }),
        // Left
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }, { s: 0, t: 0 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: -1, y: 0, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }, { s: 1, t: 1 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }, { s: 1, t: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: -1, y: 0, z: 0 }, { s: 1, t: 1 }),
        // Right
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }, { s: 0, t: 0 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }, { s: 1, t: 1 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }, { s: 1, t: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 1, y: 0, z: 0 }, { s: 1, t: 1 }),
        // Top
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, { s: 0, t: 0 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, { s: 1, t: 1 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, { s: 1, t: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, { s: 1, t: 1 }),
        // Bottom
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, { s: 0, t: 0 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, { s: 1, t: 1 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, { s: 0, t: 1 }),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, { s: 0, t: 0 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, { s: 1, t: 0 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, { s: 1, t: 1 })
    ];

    private static pyramidVertices = [
        // Front
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 0.5, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 1, t: 0}),
        // Back
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 0.5, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 1, t: 0}),
        // Left
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 0.5, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 1, t: 0}),
        // Right
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 0.5, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 1, t: 0}),
        // Bottom
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 1}),
    ];

    static async create(kind: ModelProceduralKind, material: Material): Promise<ModelProcedural> {
        return await new ModelProcedural().init([kind, material]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [kind, material] = args as [ModelProceduralKind, Material];

        let vertices: Array<Vertex>;
        switch (kind) {
            case ModelProceduralKind.Cube:
                vertices = ModelProcedural.cubeVertices;
                break;
            case ModelProceduralKind.Pyramid:
                vertices = ModelProcedural.pyramidVertices;
                break;
            case ModelProceduralKind.Sphere:
                vertices = this.sphereVertices(32);
                break;
        }

        await super.init([vertices, material]);
        return this;
    }

    private sphereVertices(segments: number): Array<Vertex> {
        let vertices: Array<Vertex> = [];
        for (let iy = 0; iy < segments; iy++) {
            for (let ix = 0; ix < segments; ix++) {
                let x1 = Math.sin(ix / segments * Math.PI * 2) * Math.sin((iy + 1) / segments * Math.PI);
                let x2 = Math.sin((ix + 1) / segments * Math.PI * 2) * Math.sin((iy + 1) / segments * Math.PI);
                let x3 = Math.sin((ix + 1) / segments * Math.PI * 2) * Math.sin(iy / segments * Math.PI);
                let x4 = Math.sin(ix / segments * Math.PI * 2) * Math.sin(iy / segments * Math.PI);

                let y1 = Math.cos((iy + 1) / segments * Math.PI);
                let y2 = Math.cos((iy + 1) / segments * Math.PI);
                let y3 = Math.cos((iy + 0) / segments * Math.PI);
                let y4 = Math.cos((iy + 0) / segments * Math.PI);

                let z1 = Math.sin((iy + 1) / segments * Math.PI) * Math.cos(ix / segments * Math.PI * 2);
                let z2 = Math.sin((iy + 1) / segments * Math.PI) * Math.cos((ix + 1) / segments * Math.PI * 2);
                let z3 = Math.sin(iy / segments * Math.PI) * Math.cos((ix + 1) / segments * Math.PI * 2);
                let z4 = Math.sin(iy / segments * Math.PI) * Math.cos(ix / segments * Math.PI * 2);

                let n1 = new Vector(x1, y1, z1).normalize();
                let n2 = new Vector(x2, y2, z2).normalize();
                let n3 = new Vector(x3, y3, z3).normalize();
                let n4 = new Vector(x4, y4, z4).normalize();

                let s1 = ix / segments;
                let s2 = (ix + 1) / segments;
                let t1 = (iy + 1) / segments;
                let t2 = iy / segments;

                vertices.push(new Vertex({ x: x1, y: y1, z: z1 }, n1, { s: s1, t: t1 }));
                vertices.push(new Vertex({ x: x2, y: y2, z: z2 }, n2, { s: s2, t: t1 }));
                vertices.push(new Vertex({ x: x3, y: y3, z: z3 }, n3, { s: s2, t: t2 }));

                vertices.push(new Vertex({ x: x1, y: y1, z: z1 }, n1, { s: s1, t: t1 }));
                vertices.push(new Vertex({ x: x3, y: y3, z: z3 }, n3, { s: s2, t: t2 }));
                vertices.push(new Vertex({ x: x4, y: y4, z: z4 }, n4, { s: s1, t: t2 }));
            }
        }
        return vertices;
    }
}