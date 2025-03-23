import { Vector } from "utils/vector";

export class Material {
    color: Vector;
    ambientIntensity: number;
    diffuseIntensity: number;
    specularIntensity: number;
    isUnshaded: boolean;
    diffuseTexture: HTMLImageElement | null;

    constructor(color: Vector, ambientIntensity: number, diffuseIntensity: number, specularIntensity: number, isUnshaded: boolean, diffuseTexture: HTMLImageElement | null) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
        this.diffuseTexture = diffuseTexture;
    }
}