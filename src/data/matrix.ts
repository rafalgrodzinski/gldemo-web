import { Vector } from "data/vector";

export class Matrix {
    m: Array<number>;

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
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
        return new Matrix(m);
    }

    static makeRotationX(angle: number): Matrix {
        let m = [
            1, 0, 0, 0,
            0, Math.cos(angle), -Math.sin(angle), 0,
            0, Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    static makeRotationY(angle: number): Matrix {
        let m = [
            Math.cos(angle), 0, Math.sin(angle), 0,
            0, 1, 0, 0,
            -Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
    }

    static makeRotationZ(angle: number): Matrix {
        let m = [
            Math.cos(angle), -Math.sin(angle), 0, 0,
            Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return new Matrix(m);
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

    static makePerspective(fieldOfView: number, aspect: number, near: number, far: number): Matrix {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
        var rangeInv = 1.0 / (near - far);

        let m = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0,
        ];
        return new Matrix(m);
    }

    multiply(other: Matrix): Matrix {
        // This
        let l00 = this.m[4 * 0 + 0];
        let l01 = this.m[4 * 0 + 1];
        let l02 = this.m[4 * 0 + 2];
        let l03 = this.m[4 * 0 + 3];

        let l10 = this.m[4 * 1 + 0];
        let l11 = this.m[4 * 1 + 1];
        let l12 = this.m[4 * 1 + 2];
        let l13 = this.m[4 * 1 + 3];

        let l20 = this.m[4 * 2 + 0];
        let l21 = this.m[4 * 2 + 1];
        let l22 = this.m[4 * 2 + 2];
        let l23 = this.m[4 * 2 + 3];

        let l30 = this.m[4 * 3 + 0];
        let l31 = this.m[4 * 3 + 1];
        let l32 = this.m[4 * 3 + 2];
        let l33 = this.m[4 * 3 + 3];

        // Other
        let r00 = other.m[4 * 0 + 0];
        let r01 = other.m[4 * 0 + 1];
        let r02 = other.m[4 * 0 + 2];
        let r03 = other.m[4 * 0 + 3];

        let r10 = other.m[4 * 1 + 0];
        let r11 = other.m[4 * 1 + 1];
        let r12 = other.m[4 * 1 + 2];
        let r13 = other.m[4 * 1 + 3];

        let r20 = other.m[4 * 2 + 0];
        let r21 = other.m[4 * 2 + 1];
        let r22 = other.m[4 * 2 + 2];
        let r23 = other.m[4 * 2 + 3];

        let r30 = other.m[4 * 3 + 0];
        let r31 = other.m[4 * 3 + 1];
        let r32 = other.m[4 * 3 + 2];
        let r33 = other.m[4 * 3 + 3];
    
        let m = [
            l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30, l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31, l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32, l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33,
            l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30, l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31, l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32, l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33,
            l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30, l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31, l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32, l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33,
            l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30, l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31, l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32, l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33,
        ];
        return new Matrix(m);
    }

    multiplyVector(vector: Vector): Vector {
        // This
        let l00 = this.m[4 * 0 + 0];
        let l01 = this.m[4 * 0 + 1];
        let l02 = this.m[4 * 0 + 2];

        let l10 = this.m[4 * 1 + 0];
        let l11 = this.m[4 * 1 + 1];
        let l12 = this.m[4 * 1 + 2];

        let l20 = this.m[4 * 2 + 0];
        let l21 = this.m[4 * 2 + 1];
        let l22 = this.m[4 * 2 + 2];

        return new Vector(
            l00 * vector.x + l01 * vector.y + l02 * vector.z,
            l10 * vector.x + l11 * vector.y + l12 * vector.z,
            l20 * vector.x + l21 * vector.y + l22 * vector.z
        );
    }
}