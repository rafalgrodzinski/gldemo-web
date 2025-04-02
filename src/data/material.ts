import { Data3 } from "data/data_types";
import { Texture } from "data/texture/texture";

export class Material {
    color: Data3;
    ambientIntensity: number;
    diffuseIntensity: number;
    specularIntensity: number;
    isUnshaded: boolean;
    diffuseTexture: Texture | null;

    constructor(color: Data3, ambientIntensity: number, diffuseIntensity: number, specularIntensity: number, isUnshaded: boolean, diffuseTexture: Texture | null) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
        this.diffuseTexture = diffuseTexture;
    }
}