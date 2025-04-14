import { Vector } from "data/vector";
import { Data3 } from "./data_types";

// Row-major matrix
export class Matrix {
    m: Array<number>;

    get r0c0(): number {
        return this.m[4 * 0 + 0];
    }

    get r0c1(): number {
        return this.m[4 * 0 + 1];
    }

    get r0c2(): number {
        return this.m[4 * 0 + 2];
    }

    get r0c3(): number {
        return this.m[4 * 0 + 3];
    }

    get r1c0(): number {
        return this.m[4 * 1 + 0];
    }

    get r1c1(): number {
        return this.m[4 * 1 + 1];
    }

    get r1c2(): number {
        return this.m[4 * 1 + 2];
    }

    get r1c3(): number {
        return this.m[4 * 1 + 3];
    }

    get r2c0(): number {
        return this.m[4 * 2 + 0];
    }

    get r2c1(): number {
        return this.m[4 * 2 + 1];
    }

    get r2c2(): number {
        return this.m[4 * 2 + 2];
    }

    get r2c3(): number {
        return this.m[4 * 2 + 3];
    }

    get r3c0(): number {
        return this.m[4 * 3 + 0];
    }

    get r3c1(): number {
        return this.m[4 * 3 + 1];
    }

    get r3c2(): number {
        return this.m[4 * 3 + 2];
    }

    get r3c3(): number {
        return this.m[4 * 3 + 3];
    }

    constructor(m: Array<number>) {
        this.m = m;
    }

    static makeIdentity(): Matrix {
        let m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    static makeTranslation(x: number, y: number, z: number): Matrix {
        let m = [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    translate(x: number, y: number, z: number): Matrix {
        return this.multiply(Matrix.makeTranslation(x, y, z));
    }

    static makeRotationX(angle: number): Matrix {
        let m = [
            1, 0, 0, 0,
            0, Math.cos(angle), Math.sin(angle), 0,
            0, -Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    rotateX(angle: number): Matrix {
        return this.multiply(Matrix.makeRotationX(angle));
    }

    static makeRotationY(angle: number): Matrix {
        let m = [
            Math.cos(angle), 0, -Math.sin(angle), 0,
            0, 1, 0, 0,
            Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    rotateY(angle: number): Matrix {
        return this.multiply(Matrix.makeRotationY(angle));
    }

    static makeRotationZ(angle: number): Matrix {
        let m = [
            Math.cos(angle), Math.sin(angle), 0, 0,
            -Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    rotateZ(angle: number): Matrix {
        return this.multiply(Matrix.makeRotationZ(angle));
    }

    static makeScale(x: number, y: number, z: number): Matrix {
        let m = [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    scale(x: number, y: number | null = null, z: number | null = null): Matrix {
        if (y != null && z != null)
            return this.multiply(Matrix.makeScale(x, y, z));
        else
            return this.multiply(Matrix.makeScale(x, x, x));
    }

    static makeOrthographicLeft(aspect: number, width: number, depth: number) {
        let height = width / aspect;
        let m = [
            2 / width, 0, 0, 0,
            0, 2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    static makeOrthographicRight(aspect: number, width: number, depth: number) {
        let height = width / aspect;
        let m = [
            2 / width, 0, 0, 0,
            0, 2 / height, 0, 0,
            0, 0, -2 / depth, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    static makePerspectiveLeft(fieldOfView: number, aspect: number, depth: number): Matrix {
        let near = 0.1;
        let far = near + depth;

        let m = [
            1 / (aspect * Math.tan(fieldOfView * 0.5)), 0, 0, 0,
            0, 1 / Math.tan(fieldOfView * 0.5), 0, 0,
            0, 0, (-near - far) / (near - far), 1,
            0, 0, near * far * 2 / (near - far), 0,
        ];
        return new Matrix(m);
    }

    static makePerspectiveRight(fieldOfView: number, aspect: number, depth: number): Matrix {
        let near = 0.1;
        let far = near + depth;

        let m = [
            1 / (aspect * Math.tan(fieldOfView * 0.5)), 0, 0, 0,
            0, 1 / (Math.tan(fieldOfView * 0.5)), 0, 0,
            0, 0, (near + far) / (near - far), near * far * 2 / (near - far),
            0, 0, -1, 0,
        ];
        return new Matrix(m);
    }

    static makeLookAt(eye: Data3, direction: Data3): Matrix {
        let right = new Vector(-direction.x, -direction.y, -direction.z).cross(new Vector(0, 1, 0));
        let up = right.cross(new Vector(-direction.x, -direction.y, -direction.z));
        let m = [
            -right.x, -right.y, -right.z, -eye.x,
            -up.x, -up.y, -up.z, -eye.y,
            -direction.x, -direction.y, -direction.z, -eye.z,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    multiply(other: Matrix): Matrix {
        let r0c0 = this.r0c0 * other.r0c0 + this.r0c1 * other.r1c0 + this.r0c2 * other.r2c0 + this.r0c3 * other.r3c0;
        let r0c1 = this.r0c0 * other.r0c1 + this.r0c1 * other.r1c1 + this.r0c2 * other.r2c1 + this.r0c3 * other.r3c1;
        let r0c2 = this.r0c0 * other.r0c2 + this.r0c1 * other.r1c2 + this.r0c2 * other.r2c2 + this.r0c3 * other.r3c2;
        let r0c3 = this.r0c0 * other.r0c3 + this.r0c1 * other.r1c3 + this.r0c2 * other.r2c3 + this.r0c3 * other.r3c3;

        let r1c0 = this.r1c0 * other.r0c0 + this.r1c1 * other.r1c0 + this.r1c2 * other.r2c0 + this.r1c3 * other.r3c0;
        let r1c1 = this.r1c0 * other.r0c1 + this.r1c1 * other.r1c1 + this.r1c2 * other.r2c1 + this.r1c3 * other.r3c1;
        let r1c2 = this.r1c0 * other.r0c2 + this.r1c1 * other.r1c2 + this.r1c2 * other.r2c2 + this.r1c3 * other.r3c2;
        let r1c3 = this.r1c0 * other.r0c3 + this.r1c1 * other.r1c3 + this.r1c2 * other.r2c3 + this.r1c3 * other.r3c3;

        let r2c0 = this.r2c0 * other.r0c0 + this.r2c1 * other.r1c0 + this.r2c2 * other.r2c0 + this.r2c3 * other.r3c0;
        let r2c1 = this.r2c0 * other.r0c1 + this.r2c1 * other.r1c1 + this.r2c2 * other.r2c1 + this.r2c3 * other.r3c1;
        let r2c2 = this.r2c0 * other.r0c2 + this.r2c1 * other.r1c2 + this.r2c2 * other.r2c2 + this.r2c3 * other.r3c2;
        let r2c3 = this.r2c0 * other.r0c3 + this.r2c1 * other.r1c3 + this.r2c2 * other.r2c3 + this.r2c3 * other.r3c3;

        let r3c0 = this.r3c0 * other.r0c0 + this.r3c1 * other.r1c0 + this.r3c2 * other.r2c0 + this.r3c3 * other.r3c0;
        let r3c1 = this.r3c0 * other.r0c1 + this.r3c1 * other.r1c1 + this.r3c2 * other.r2c1 + this.r3c3 * other.r3c1;
        let r3c2 = this.r3c0 * other.r0c2 + this.r3c1 * other.r1c2 + this.r3c2 * other.r2c2 + this.r3c3 * other.r3c2;
        let r3c3 = this.r3c0 * other.r0c3 + this.r3c1 * other.r1c3 + this.r3c2 * other.r2c3 + this.r3c3 * other.r3c3;
    
        let m = [
            r0c0, r0c1, r0c2, r0c3,
            r1c0, r1c1, r1c2, r1c3,
            r2c0, r2c1, r2c2, r2c3,
            r3c0, r3c1, r3c2, r3c3
        ];
        return new Matrix(m);
    }
}