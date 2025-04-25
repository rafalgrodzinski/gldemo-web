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
    innerCutOff: number;
    outerCutOff: number;
    shouldCastShadow: boolean;


    private constructor(
        kind: LightKind,
        color: Data3,
        intensity: number,
        linearAttenuation: number,
        quadaraticAttenuation: number,
        innerCutOff: number,
        outerCutOff: number,
        shouldCastShadow: boolean
    ) {
        this.kind = kind;
        this.color = color;
        this.intensity = intensity;
        this.linearAttenuation = linearAttenuation;
        this.quadaraticAttenuation = quadaraticAttenuation;
        this.innerCutOff = innerCutOff;
        this.outerCutOff = outerCutOff;
        this.shouldCastShadow = shouldCastShadow;
    }

    static makeAmbient(color: Data3, intensity: number): Light {
        return new Light(LightKind.Ambient, color, intensity, 0, 0, 0, 0, false);
    }

    static makeDirectional(color: Data3, intensity: number, shouldCastShadow: boolean): Light {
        return new Light(LightKind.Directional, color, intensity, 0, 0, 0, 0, shouldCastShadow);
    }

    static makePoint(color: Data3, intensity: number, linearAttenuation: number, quadaraticAttenuation: number): Light {
        return new Light(LightKind.Point, color, intensity, linearAttenuation, quadaraticAttenuation, 0, 0, false);
    }

    static makeSpot(color: Data3, intensity: number, innerCutOff: number, outerCutOff: number, shouldCastShadow: boolean): Light {
        return new Light(LightKind.Spot, color, intensity, 0, 0, innerCutOff, outerCutOff, shouldCastShadow);
    }
}