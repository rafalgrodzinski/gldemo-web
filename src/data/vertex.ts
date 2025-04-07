import { Data2, Data3 } from "data/data_types";

export class Vertex {
    static STRIDE_LENGTH = 3 + 3 + 2;
    static STRIDE: number = Vertex.STRIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT;

    static POSITION_OFFSET: number = 0;
    static NORMAL_OFFSET: number = Vertex.POSITION_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;
    static TEX_COORDS_OFFSET: number = Vertex.NORMAL_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;

    position: Data3;
    normal: Data3;
    texCoord: Data2;

    get m(): Array<number> {
        return [
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.texCoord.s, this.texCoord.t
        ];
    }

    constructor(position: Data3, normal: Data3, texCoord: Data2) {
        this.position = position;
        this.normal = normal;
        this.texCoord = texCoord;
    }
}