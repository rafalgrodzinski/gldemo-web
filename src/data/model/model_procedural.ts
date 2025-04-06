import { Model } from "data/model/model";
import { Material } from "data/material";
import { Vertex } from "data/vertex";
import { Vector } from "data/vector";
import { Data } from "data/data_types";

export enum ModelProceduralKind {
    Plane,
    Cube,
    Pyramid,
    Sphere
}

export class ModelProcedural extends Model {
    private static planeVertices = [
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(0, 1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(0, 1, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, 1, -1), Data.xyz(0, 1, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(0, 1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, 1), Data.xyz(0, 1, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(0, 1, 0), Data.st(1, 1)),
    ];

    private static cubeVertices = [
        // Front
        new Vertex(Data.xyz(-1, -1, 1), Data.xyz(0, 0, 1), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, 1), Data.xyz(0, 0, 1), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(0, 0, 1), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, -1, 1), Data.xyz(0, 0, 1), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -1, 1), Data.xyz(0, 0, 1), Data.st(1, 0)),
        new Vertex(Data.xyz(1, 1, 1), Data.xyz(0, 0, 1), Data.st(1, 1)),
        // Back
        new Vertex(Data.xyz(1, -1, -1), Data.xyz(0, 0, -1), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, 1, -1), Data.xyz(0, 0, -1), Data.st(1, 1)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(0, 0, -1), Data.st(0, 1)),
        new Vertex(Data.xyz(1, -1, -1), Data.xyz(0, 0, -1), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, -1, -1), Data.xyz(0, 0, -1), Data.st(1, 0)),
        new Vertex(Data.xyz(-1, 1, -1), Data.xyz(0, 0, -1), Data.st(1, 1)),
        // Left
        new Vertex(Data.xyz(-1, -1, -1), Data.xyz(-1, 0, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(-1, 0, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, 1, -1), Data.xyz(-1, 0, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, -1, -1), Data.xyz(-1, 0, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, -1, 1), Data.xyz(-1, 0, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(-1, 0, 0), Data.st(1, 1)),
        // Right
        new Vertex(Data.xyz(1, -1, 1), Data.xyz(1, 0, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(1, 0, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(1, 1, 1), Data.xyz(1, 0, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(1, -1, 1), Data.xyz(1, 0, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -1, -1), Data.xyz(1, 0, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(1, 0, 0), Data.st(1, 1)),
        // Top
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(0, 1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(0, 1, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, 1, -1), Data.xyz(0, 1, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, 1, 1), Data.xyz(0, 1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, 1, 1), Data.xyz(0, 1, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(1, 1, -1), Data.xyz(0, 1, 0), Data.st(1, 1)),
        // Bottom
        new Vertex(Data.xyz(-1, -1, -1), Data.xyz(0, -1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -1, 1), Data.xyz(0, -1, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, -1, 1), Data.xyz(0, -1, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, -1, -1), Data.xyz(0, -1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -1, -1), Data.xyz(0, -1, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(1, -1, 1), Data.xyz(0, -1, 0), Data.st(1, 1))
    ];

    private static pyramidVertices = [
        // Front
        new Vertex(Data.xyz(-1, -0.75, 1), Data.xyz(0, 0.4264, 0.6396), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -0.75, 1), Data.xyz(0, 0.4264, 0.6396), Data.st(1, 0)),
        new Vertex(Data.xyz(0, 0.75, 0), Data.xyz(0, 0.4264, 0.6396), Data.st(0.5, 1)),
        // Back
        new Vertex(Data.xyz(1, -0.75, -1), Data.xyz(0, 0.4264, -0.6396), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, -0.75, -1), Data.xyz(0, 0.4264, -0.6396), Data.st(1, 0)),
        new Vertex(Data.xyz(0, 0.75, 0), Data.xyz(0, 0.4264, -0.6396), Data.st(0.5, 1)),
        // Left
        new Vertex(Data.xyz(-1, -0.75, -1), Data.xyz(-0.6396, 0.4264, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(-1, -0.75, 1), Data.xyz(-0.6396, 0.4264, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(0, 0.75, 0), Data.xyz(-0.6396, 0.4264, 0), Data.st(0.5, 1)),
        // Right
        new Vertex(Data.xyz(1, -0.75, 1), Data.xyz(0.6396, 0.4264, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -0.75, -1), Data.xyz(0.6396, 0.4264, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(0, 0.75, 0), Data.xyz(0.6396, 0.4264, 0), Data.st(0.5, 1)),
        // Bottom
        new Vertex(Data.xyz(-1, -0.75, -1), Data.xyz(0, -1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -0.75, 1), Data.xyz(0, -1, 0), Data.st(1, 1)),
        new Vertex(Data.xyz(-1, -0.75, 1), Data.xyz(0, -1, 0), Data.st(0, 1)),
        new Vertex(Data.xyz(-1, -0.75, -1), Data.xyz(0, -1, 0), Data.st(0, 0)),
        new Vertex(Data.xyz(1, -0.75, -1), Data.xyz(0, -1, 0), Data.st(1, 0)),
        new Vertex(Data.xyz(1, -0.75, 1), Data.xyz(0, -1, 0), Data.st(1, 1)),
    ];

    static async create(kind: ModelProceduralKind, material: Material): Promise<ModelProcedural> {
        return await new ModelProcedural().init([kind, material]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [kind, material] = args as [ModelProceduralKind, Material];

        let vertices: Array<Vertex>;
        switch (kind) {
            case ModelProceduralKind.Plane:
                vertices = ModelProcedural.planeVertices;
                break;
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

        await super.init([[vertices], material, null]);
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

                vertices.push(new Vertex(Data.xyz(x1, y1, z1), Data.xyz(n1.x, n1.y, n1.z), Data.st(s1, t1)));
                vertices.push(new Vertex(Data.xyz(x2, y2, z2), Data.xyz(n2.x, n2.y, n2.z), Data.st(s2, t1)));
                vertices.push(new Vertex(Data.xyz(x3, y3, z3), Data.xyz(n3.x, n3.y, n3.z), Data.st(s2, t2)));

                vertices.push(new Vertex(Data.xyz(x1, y1, z1), Data.xyz(n1.x, n1.y, n1.z), Data.st(s1, t1)));
                vertices.push(new Vertex(Data.xyz(x3, y3, z3), Data.xyz(n3.x, n3.y, n3.z), Data.st(s2, t2)));
                vertices.push(new Vertex(Data.xyz(x4, y4, z4), Data.xyz(n4.x, n4.y, n4.z), Data.st(s1, t2)));
            }
        }
        return vertices;
    }
}