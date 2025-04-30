import { Util } from "utils/util";
import { Matrix } from "./matrix";
import { Data, Data3 } from "./data_types";

export class Vector {
    x: number;
    y: number;
    z: number;

    get data(): Data3 {
        return Data.xyz(this.x, this.y, this.z);
    }

    static xyz(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z);
    }

    private constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Operations
    negate(): Vector {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    multiply(value: number | Vector | Matrix): Vector {
        if (value instanceof Vector) {
            return new Vector(this.x * value.x, this.y * value.y, this.z * value.z);
        } else if (value instanceof Matrix) {
            return new Vector(
                value.r0c0 * this.x + value.r0c1 * this.y + value.r0c2 * this.z,
                value.r1c0 * this.x + value.r1c1 * this.y + value.r1c2 * this.z,
                value.r2c0 * this.x + value.r2c1 * this.y + value.r2c2 * this.z
            );
        } else {
            return new Vector(this.x * value, this.y * value, this.z * value)
        }
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

    cross(other: Vector): Vector {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        )
    }
}