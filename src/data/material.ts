import { Data3 } from "data/data_types";

export class Material {
    color: Data3;
    ambientIntensity: number;
    diffuseIntensity: number;
    specularIntensity: number;
    isUnshaded: boolean;
    diffuseTexture: HTMLImageElement | null;

    constructor(color: Data3, ambientIntensity: number, diffuseIntensity: number, specularIntensity: number, isUnshaded: boolean, diffuseTexture: HTMLImageElement | null) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
        this.diffuseTexture = diffuseTexture;
    }
}