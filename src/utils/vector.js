import { Util } from "utils/util.js";

export class Vector {
    m;

    constructor(x, y, z) {
        this.m = [x, y, z];
    }

    // XYZ
    get x() {
        return this.m[0];
    }

    set x(value) {
        this.m[0] = value;
    }

    get y() {
        return this.m[1];
    }

    set y(value) {
        this.m[1] = value;
    }

    get z() {
        return this.m[2];
    }

    set z(value) {
        this.m[2] = value;
    }

    // RGB
    get r() {
        return this.m[0];
    }

    set r(value) {
        this.m[0] = value;
    }

    get g() {
        return this.m[1];
    }

    set g(value) {
        this.m[1] = value;
    }

    get b() {
        return this.m[2];
    }

    set b(value) {
        this.m[2] = value;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalized() {
        let length = this.length();
        if (length == 0)
            return this;
        return new Vector(this.x / length, this.y / length, this.z / length);
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    multiply(other) {
        return new Vector(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    dot(otherVector) {
        let value = this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
        return Util.clamp(value, -1, 1);
    }
}