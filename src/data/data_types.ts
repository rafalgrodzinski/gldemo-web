import { Vector } from "data/vector";

export class Data {
    static st(s: number, t: number): Data2 {
        return new Data2(s, t);
    }

    static xyz(x: number, y: number, z: number): Data3 {
        return new Data3(x, y, z)
    }

    static rgb(r: number, g: number, b: number): Data3 {
        return new Data3(r, g, b)
    }

    static vector(vector: Vector): Data3 {
        return new Data3(vector.x, vector.y, vector.z);
    }
}

export class Data2 {
    m: Array<number>;

    constructor(d0: number, d1: number) {
        this.m = [d0, d1];
    }

    // XY
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

    // ST
    get s(): number {
        return this.m[0];
    }

    set s(value: number) {
        this.m[0] = value;
    }

    get t(): number {
        return this.m[1];
    }

    set t(value: number) {
        this.m[1] = value;
    }
};

export class Data3 {
    m: Array<number>;

    constructor(d0: number, d1: number, d2: number) {
        this.m = [d0, d1, d2];
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

    // RGB
    get r(): number {
        return this.m[0];
    }

    set r(value: number) {
        this.m[0] = value;
    }

    get g(): number {
        return this.m[1];
    }

    set g(value: number) {
        this.m[1] = value;
    }

    get b(): number {
        return this.m[2];
    }

    set b(value: number) {
        this.m[2] = value;
    }
};