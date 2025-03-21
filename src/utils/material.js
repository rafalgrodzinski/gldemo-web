export class Material {
    color;
    ambientIntensity;
    diffuseIntensity;
    specularIntensity;
    isUnshaded;
    hasDiffuseTexture;

    constructor(color, ambientIntensity, diffuseIntensity, specularIntensity, isUnshaded, hasDiffuseTexture) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
        this.hasDiffuseTexture = hasDiffuseTexture;
    }
}