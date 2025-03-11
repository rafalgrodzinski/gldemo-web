#version 300 es

precision highp float;

struct Light {
    int kind;
    vec3 direction; // directional
    float intensity; // directional
};


const int LightKindUnused = 0;
const int LightKindDirectional = 1 << 0;
const int LightKindPoint = 1 << 1;
const int LightKindSpot = 1 << 2;

in vec3 v_normal;
in vec3 v_color;

uniform Light u_lights[8];

out vec4 o_color;

vec3 directionalLightColor(vec3 baseColor, Light light) {
    vec3 color = vec3(0);
    color += baseColor;
    return color;
}

void main() {
    vec3 baseColor = v_color;
    vec3 color = vec3(0);

    for (int i=0; i<8; i++) {
        if (u_lights[i].kind == LightKindDirectional)
            color += directionalLightColor(baseColor, u_lights[i]);
    }

    o_color = vec4(color, 1.0);
}