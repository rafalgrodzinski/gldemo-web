export class Material {
    color;
    ambientIntensity;
    diffuseIntensity;
    specularIntensity;
    isUnshaded;

    constructor(color, ambientIntensity, diffuseIntensity, specularIntensity, isUnshaded) {
        this.color = color;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.isUnshaded = isUnshaded
    }
}