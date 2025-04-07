import { Data3 } from "data/data_types";
import { Texture } from "data/texture/texture";
import { TextureCube } from "./texture/texture_cube";

export class Material {
    color: Data3;
    ambientIntensity: number;
    diffuseIntensity: number;
    specularIntensity: number;
    isUnshaded: boolean;
    diffuseTexture: Texture | null;
    roughnessTexture: Texture | null;
    environmentTexture: TextureCube | null;

    constructor(
        color: Data3,
        ambientIntensity: number,
        diffuseIntensity: number,
        specularIntensity: number,
        isUnshaded: boolean,
        diffuseTexture: Texture | null,
        roughnessTexture: Texture | null,
        environmentTexture: TextureCube | null
    ) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
        this.diffuseTexture = diffuseTexture;
        this.roughnessTexture = roughnessTexture;
        this.environmentTexture = environmentTexture;
    }
}