#version 300 es

precision highp float;

struct Light {
    int kind;
    vec3 color; // ambient, directional, spot, point
    vec3 direction; // directional, spot
    float intensity; // ambient, directional, spot, point
    vec3 position; // spot, point
    float linearAttenuation; // point
    float quadraticAttenuation; // point
    float innerCutOff; // spot
    float outerCutOff; // spot
    bool shouldCastShadow; // directional, spot
    sampler2D shadowMapSampler; // directional, spot
};

struct Material {
    vec3 color;
    float ambientIntensity;
    float diffuseIntensity;
    float specularIntensity;
    float roughnessIntensity;
    bool isUnshaded;
    bool hasDiffuseTexture;
    bool hasRoughnessTexture;
    bool hasEnvironmentTexture;
};

const int LightKindAmbient = 1;
const int LightKindDirectional = 2;
const int LightKindPoint = 3;
const int LightKindSpot = 4;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texCoords;

in vec4 v_lightSpacePosition[8];

uniform sampler2D u_diffuseSampler;
uniform sampler2D u_roughnessSampler;
uniform samplerCube u_environmentSampler;
uniform Light u_lights[8];
uniform Material u_material;
uniform vec3 u_cameraPosition;

out vec4 o_color;

float shadow(vec4 lightSpacePosition, vec3 normal, Light light) {
    vec3 lightSpaceNormalizedPosition = lightSpacePosition.xyz / lightSpacePosition.w;
    lightSpaceNormalizedPosition = lightSpaceNormalizedPosition * 0.5 + 0.5;

    if (lightSpaceNormalizedPosition.x < 0.0 || lightSpaceNormalizedPosition.x > 1.0 ||
        lightSpaceNormalizedPosition.y < 0.0 || lightSpaceNormalizedPosition.y > 1.0 ||
        lightSpaceNormalizedPosition.z < 0.0 || lightSpaceNormalizedPosition.z > 1.0) {
        return 0.0;
    }

    float fragmentDepth = lightSpaceNormalizedPosition.z;
    float shadowIntensity = 0.0;
    vec2 texelSize = vec2(textureSize(light.shadowMapSampler, 0).xy);
    for (int x=-2; x<=2; x++) {
        for (int y=-2; y<=2; y++) {
            vec2 offset = vec2(x, y) / texelSize;
            float shadowMapDepth = texture(light.shadowMapSampler, lightSpaceNormalizedPosition.xy + offset).x;
            shadowIntensity += fragmentDepth > shadowMapDepth ? 0.5 : 0.0;
        }
    }
    return shadowIntensity / 16.0;
}

vec3 ambientLightColor(Light light, Material material) {
    vec3 color = vec3(0);

    color += material.color * light.color * light.intensity * material.ambientIntensity;

    return color;
}

vec3 directionalLightColor(vec3 position, vec3 normal, vec3 cameraPosition, Light light, Material material, float shadowIntensity) {
    vec3 color = vec3(0);
    
    // Diffuse
    float diffuseIntensity = (light.intensity * material.diffuseIntensity - shadowIntensity) * dot(normal, -light.direction);
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
    color += material.color * light.color * diffuseIntensity;

    // Specular
    if (material.specularIntensity > 0.0) {
        vec3 cameraDirection = normalize(cameraPosition - position);
        vec3 reflected = reflect(light.direction, normal);
        float specularIntensity = dot(cameraDirection, reflected) - shadowIntensity;
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);
        color += light.color * pow(specularIntensity, material.specularIntensity) * light.intensity * material.roughnessIntensity;
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
        color += light.color * pow(specularIntensity, material.specularIntensity) * light.intensity * material.roughnessIntensity;
    }

    return color;
}

vec3 spotLightColor(vec3 position, vec3 normal, vec3 cameraPosition, Light light, Material material, float shadowIntensity) {
    vec3 color = vec3(0);

    vec3 direction = normalize(position - light.position);
    float theta = dot(direction, light.direction);
    float epsilon = light.innerCutOff - light.outerCutOff;
    float spotIntensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    
    // Diffuse
    float normalIntensity = clamp(dot(normal, -direction), 0.0, 1.0);
    float diffuseIntensity = (normalIntensity * light.intensity * material.diffuseIntensity - shadowIntensity) * spotIntensity ;
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
    color += material.color * light.color * diffuseIntensity;

    // Specular
    if (material.specularIntensity > 0.0) {
        vec3 cameraDirection = normalize(cameraPosition - position);
        vec3 reflected = reflect(direction, normal);
        float specularIntensity = dot(cameraDirection, reflected) - shadowIntensity;
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);
        color += light.color * pow(specularIntensity, material.specularIntensity) * spotIntensity * specularIntensity * light.intensity * material.roughnessIntensity;
    }

    return color;
}

void main() {
    vec3 color = vec3(0);

    Material material = u_material;

    // Diffuse texture
    if (material.hasDiffuseTexture) {
        material.color = texture(u_diffuseSampler, v_texCoords).rgb;
    }

    // Roughness texture
    material.roughnessIntensity = 1.0;
    if (material.hasRoughnessTexture) {
        material.roughnessIntensity = texture(u_roughnessSampler, v_texCoords).r;
    }

    // Environment texture
    if (material.hasEnvironmentTexture) {
        vec3 direction = normalize(v_position - u_cameraPosition);
        vec3 reflected = reflect(direction, v_normal);
        material.color = texture(u_environmentSampler, reflected).rgb;
    }

    if (u_material.isUnshaded) {
        color = material.color;
    } else {
        for (int i=0; i<8; i++) {
            float shadowIntensity = 0.0;
            if (u_lights[i].shouldCastShadow)
                shadowIntensity = shadow(v_lightSpacePosition[i], v_normal, u_lights[i]);

            if (u_lights[i].kind == LightKindAmbient) {
                color += ambientLightColor(u_lights[i], material);
            } else if (u_lights[i].kind == LightKindDirectional) {
                color += directionalLightColor(v_position, v_normal, u_cameraPosition, u_lights[i], material, shadowIntensity);
            } else if (u_lights[i].kind == LightKindPoint) {
                color += pointLightColor(v_position, v_normal, u_cameraPosition, u_lights[i], material);
            } else if (u_lights[i].kind == LightKindSpot) {
                color += spotLightColor(v_position, v_normal, u_cameraPosition, u_lights[i], material, shadowIntensity);
            }
        }
    }

    o_color = vec4(color, 1.0);
}