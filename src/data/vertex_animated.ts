import { Data2, Data3 } from "./data_types";

export class VertexAnimated {
    static STRIDE_LENGTH: number = 3 + 3 + 3 + 3 + 2;
    static STRIDE: number = VertexAnimated.STRIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT;

    static POSITION_OFFSET: number = 0;
    static POSITION_NEXT_OFFSET: number = VertexAnimated.POSITION_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;
    static NORMAL_OFFSET: number = VertexAnimated.POSITION_NEXT_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;
    static NORMAL_NEXT_OFFSET: number = VertexAnimated.NORMAL_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;
    static TEX_COORDS_OFFSET: number = VertexAnimated.NORMAL_NEXT_OFFSET + 3 * Float32Array.BYTES_PER_ELEMENT;

    position: Data3;
    positionNext: Data3;
    normal: Data3;
    normalNext: Data3;
    texCoord: Data2;

    get m(): Array<number> {
        return [
            this.position.x, this.position.y, this.position.z,
            this.positionNext.x, this.positionNext.y, this.positionNext.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.normalNext.x, this.normalNext.y, this.normalNext.z,
            this.texCoord.s, this.texCoord.t
        ];
    }

    constructor(position: Data3, positionNext: Data3, normal: Data3, normalNext: Data3, texCoord: Data2) {
        this.position = position;
        this.positionNext = positionNext;
        this.normal = normal;
        this.normalNext = normalNext;
        this.texCoord = texCoord;
    }
}