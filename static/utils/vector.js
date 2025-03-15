import { Util } from "/utils/util.js";

export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalized() {
        let length = this.length();
        if (length == 0)
            return this;
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    add(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    multiply(other) {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    dot(otherVector) {
        let value = this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
        return Util.clamp(value, -1, 1);
    }
}