#version 300 es

layout (location=0) in vec3 a_position;
layout (location=3) in vec3 a_positionNext;

uniform mat4 u_lightProjectionMatrix;
uniform mat4 u_lightViewMatrix;
uniform mat4 u_modelMatrix;

uniform bool u_isAnimated;
uniform float u_tweenFactor;

void main() {
    vec3 position;
    if (u_isAnimated) {
        position = mix(a_position, a_positionNext, u_tweenFactor);
    } else {
        position = a_position;
    }

    gl_Position = u_lightProjectionMatrix * u_lightViewMatrix * u_modelMatrix * vec4(position, 1.0);
}