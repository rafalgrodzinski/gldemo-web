export type Point3 = {x: number, y: number, z: number};
export type Vec3 = {x: number, y: number, z: number};
export type TexCoord = {s: number, t: number};

export class Vertex {
    static STRIDE: number = Float32Array.BYTES_PER_ELEMENT * (3 + 3 + 2);
    static POSITION_OFFSET: number = 0;
    static NORMAL_OFFSET: number = Float32Array.BYTES_PER_ELEMENT * 3;
    static TEX_COORDS_OFFSET: number = Float32Array.BYTES_PER_ELEMENT * (3 + 3);

    position: Point3;
    normal: Vec3;
    texCoord: TexCoord;

    get m(): Array<number> {
        return [
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.texCoord.s, this.texCoord.t
        ];
    }

    constructor(position: Point3, normal: Vec3, texCoord: TexCoord) {
        this.position = position;
        this.normal = normal;
        this.texCoord = texCoord;
    }
}