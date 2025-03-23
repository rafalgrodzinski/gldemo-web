import { Vector } from "utils/vector";

export enum LightKind {
    Ambient = 1,
    Directional = 2,
    Point = 3,
    Spot = 4
}

export class Light {
    kind: LightKind;
    color: Vector;
    intensity: number;
    linearAttenuation: number;
    quadaraticAttenuation: number;

    constructor(kind: LightKind, color: Vector, intensity: number, linearAttenuation: number, quadaraticAttenuation: number) {
        this.kind = kind;
        this.color = color;
        this.intensity = intensity;
        this.linearAttenuation = linearAttenuation;
        this.quadaraticAttenuation = quadaraticAttenuation;
    }
}