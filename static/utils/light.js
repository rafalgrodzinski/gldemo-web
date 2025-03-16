export class Light {
    static KIND_AMBIENT = 1;
    static KIND_DIRECTIONAL = 2;
    static KIND_POINT = 3;
    static KIND_SPOT = 4;

    kind;
    color;
    intensity;
    linearAttenuation;
    quadaraticAttenuation

    constructor(kind, color, intensity, linearAttenuation, quadaraticAttenuation) {
        this.kind = kind;
        this.color = color;
        this.intensity = intensity;
        this.linearAttenuation = linearAttenuation;
        this.quadaraticAttenuation = quadaraticAttenuation;
    }
}