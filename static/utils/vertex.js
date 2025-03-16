export class Vertex {
    static STRIDE = Float32Array.BYTES_PER_ELEMENT * (3 + 3 + 2);
    static POSITION_OFFSET = 0;
    static NORMAL_OFFSET = Float32Array.BYTES_PER_ELEMENT * 3;
    static TEX_COORDS_OFFSET = Float32Array.BYTES_PER_ELEMENT * (3 + 3);

    position = {x: 0, y: 0, z: 0};
    normal = {x: 0, y: 0, z: 0};
    texCoords = {s: 0, t: 0};

    constructor(position, normal, texCoords) {
        this.position = position;
        this.normal = normal;
        this.texCoords = texCoords;
    }
}