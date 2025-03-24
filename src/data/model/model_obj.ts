import { Model } from "data/model/model";
import { Material } from "data/material";
import { Util } from "utils/util";
import { Vertex } from "data/vertex";
import { Data, Data2, Data3 } from "data/data_types";

export class ModelObj extends Model {
    static async create(fileName: string, material: Material): Promise<ModelObj> {
        return await new ModelObj().init([fileName, material]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [fileName, material] = args as [string, Material];

        let vertices: Array<Vertex> = [];

        let positions: Array<Data3> = [];
        let normals: Array<Data3> = [];
        let texCoords: Array<Data2> = [];

        let text = await Util.text(fileName);
        let lines = text.split(/\r\n|\n/);
        lines.forEach((line) => {
            line = line.replace("g/\/\/", "\/0\/");
            let components = line.split(" ");
            switch (components[0]) {
                case "v": {
                    let x = +components[1];
                    let y = +components[2];
                    let z = +components[3];
                    positions.push(Data.xyz(x, y, z));
                    break;
                }
                case "vn": {
                    let x = +components[1];
                    let y = +components[2];
                    let z = +components[3];
                    normals.push(Data.xyz(x, y, z));
                    break;
                }
                case "vt": {
                    let s = +components[1];
                    let t = +components[2];
                    texCoords.push(Data.st(s, 1 - t));
                    break;
                }
                case "f":
                    for (let i=1; i<=3; i++) {
                        let vertexComponents = components[i].split("\/")
                        let positionIndex = +vertexComponents[0] - 1;
                        let texCoordIndex = +vertexComponents[1] - 1;
                        let normalIndex = +vertexComponents[2] - 1;

                        let vertex = new Vertex(positions[positionIndex], normals[normalIndex], texCoords[texCoordIndex]);
                        vertices.push(vertex);
                    }

                    break;
            }
        });

        await super.init([vertices, material]);
        return this;
    }
}