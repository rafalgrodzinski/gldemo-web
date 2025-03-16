#version 300 es

precision highp float;

struct Light {
    int kind;
    vec3 color; // ambient, directional, point
    vec3 direction; // directional
    float intensity; // ambient, directional, point
    vec3 position; // point
    float linearAttenuation; // point
    float quadraticAttenuation; // point
};

struct Material {
    vec3 color;
    float ambientIntensity;
    float diffuseIntensity;
    float specularIntensity;
    bool isUnshaded;
};

const int LightKindAmbient = 1;
const int LightKindDirectional = 2;
const int LightKindPoint = 3;
const int LightKindSpot = 4;

in vec3 v_position;
in vec3 v_normal;

uniform Light u_lights[8];
uniform Material u_material;
uniform vec3 u_cameraPosition;

out vec4 o_color;

vec3 ambientLightColor(Light light, Material material) {
    vec3 color = vec3(0);

    color += material.color * light.color * light.intensity * material.ambientIntensity;

    return color;
}

vec3 directionalLightColor(vec3 position, vec3 normal, vec3 cameraPosition, Light light, Material material) {
    vec3 color = vec3(0);
    
    // Diffuse
    float diffuseIntensity = dot(normal, -light.direction) * light.intensity * material.diffuseIntensity;
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
    color += material.color * light.color * diffuseIntensity;

    // Specular
    if (material.specularIntensity > 0.0) {
        vec3 cameraDirection = normalize(cameraPosition - position);
        vec3 reflected = reflect(light.direction, normal);
        float specularIntensity = dot(cameraDirection, reflected);
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);
        color += light.color * pow(specularIntensity, material.specularIntensity) * light.intensity;
    }

    return color;
}

vec3 pointLightColor(vec3 position, vec3 normal, vec3 cameraPosition, Light light, Material material) {
    vec3 color = vec3(0);

    vec3 direction = normalize(light.position - position);
    float distance = length(light.position - position);
    float attenuation = 1.0 / (1.0 + light.linearAttenuation * distance + light.quadraticAttenuation * distance * distance);

    // Diffuse
    float diffuseIntensity = dot(normal, direction) * attenuation * light.intensity * material.diffuseIntensity;
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
    color += material.color * light.color * diffuseIntensity;

    // Specular
    if (material.specularIntensity > 0.0) {
        vec3 cameraDirection = normalize(cameraPosition - position);
        vec3 reflected = reflect(-direction, normal);
        float specularIntensity = dot(cameraDirection, reflected);
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);
        color += light.color * pow(specularIntensity, material.specularIntensity) * light.intensity;
    }

    return color;
}

void main() {
    vec3 color = vec3(0);

    if (u_material.isUnshaded) {
        color = u_material.color;
    } else {
        for (int i=0; i<8; i++) {
            if (u_lights[i].kind == LightKindAmbient)
                color += ambientLightColor(u_lights[i], u_material);
            else if (u_lights[i].kind == LightKindDirectional)
                color += directionalLightColor(v_position, v_normal, u_cameraPosition, u_lights[i], u_material);
            else if (u_lights[i].kind == LightKindPoint)
                color += pointLightColor(v_position, v_normal, u_cameraPosition, u_lights[i], u_material);
        }
    }

    o_color = vec4(color, 1.0);
}