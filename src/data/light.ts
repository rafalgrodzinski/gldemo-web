import { Data3 } from "data/data_types";

export enum LightKind {
    Ambient = 1,
    Directional = 2,
    Point = 3,
    Spot = 4
}

export class Light {
    kind: LightKind;
    color: Data3;
    intensity: number;
    linearAttenuation: number;
    quadaraticAttenuation: number;
    shouldCastShadow: boolean;

    constructor(
        kind: LightKind,
        color: Data3,
        intensity: number,
        linearAttenuation: number,
        quadaraticAttenuation: number,
        shouldCastShadow: boolean
    ) {
        this.kind = kind;
        this.color = color;
        this.intensity = intensity;
        this.linearAttenuation = linearAttenuation;
        this.quadaraticAttenuation = quadaraticAttenuation;
        this.shouldCastShadow = shouldCastShadow;
    }
}