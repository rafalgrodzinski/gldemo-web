#version 300 es

precision highp float;

struct Light {
    int kind;
    vec3 color;
    vec3 direction; // directional
    float intensity; // directional
};

struct Material {
    vec3 color;
    float ambientIntensity;
    float diffuseIntensity;
    float specularIntensity;
};

const int LightKindDirectional = 1;
const int LightKindPoint = 2;
const int LightKindSpot = 3;

in vec3 v_position;
in vec3 v_normal;

uniform Light u_lights[8];
uniform vec3 u_cameraPosition;

out vec4 o_color;

vec3 directionalLightColor(vec3 position, vec3 cameraPosition, vec3 normal, Light light, Material material) {
    vec3 color = vec3(0);
    
    // Ambient & Diffuse
    float ambientIntensity = light.intensity * material.ambientIntensity;
    ambientIntensity = clamp(ambientIntensity, 0.0, 1.0);

    float diffuseIntensity = dot(normal, -light.direction) * light.intensity * material.diffuseIntensity;
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);

    float intensity = clamp(ambientIntensity + diffuseIntensity, 0.0, 1.0);
    color += material.color * light.color * intensity;

    // Specular
    vec3 cameraDirection = normalize(cameraPosition - position);
    vec3 halfv = normalize(cameraDirection + light.direction);
    float specularIntensity = dot(normal, -halfv);
    specularIntensity = clamp(specularIntensity, 0.0, 1.0);
    color += light.color * pow(specularIntensity, material.specularIntensity) * light.intensity;

    return color;
}

void main() {
    vec3 color = vec3(0);

    Material material;
    material.color = vec3(0.6, 0.6, 0.6);
    material.ambientIntensity = 0.1;
    material.diffuseIntensity = 1.0;
    material.specularIntensity = 8.0;

    for (int i=0; i<8; i++) {
        if (u_lights[i].kind == LightKindDirectional)
            color += directionalLightColor(v_position, u_cameraPosition, v_normal, u_lights[i], material);
    }

    o_color = vec4(color, 1.0);
}