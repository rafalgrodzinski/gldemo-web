import { Util } from "utils/util";

export class Vector {
    m: Array<number>;

    constructor(x: number, y: number, z: number) {
        this.m = [x, y, z];
    }

    // XYZ
    get x(): number {
        return this.m[0];
    }

    set x(value: number) {
        this.m[0] = value;
    }

    get y(): number {
        return this.m[1];
    }

    set y(value: number) {
        this.m[1] = value;
    }

    get z(): number {
        return this.m[2];
    }

    set z(value: number) {
        this.m[2] = value;
    }

    // Operations
    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    multiply(other: Vector): Vector {
        return new Vector(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vector {
        let length = this.length();
        if (length == 0)
            return this;
        return new Vector(this.x / length, this.y / length, this.z / length);
    }

    dot(other: Vector): number {
        let value = this.x * other.x + this.y * other.y + this.z * other.z;
        return Util.clamp(value, -1, 1);
    }
}