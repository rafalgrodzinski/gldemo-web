#version 300 es

layout (location=0) in vec3 a_position;
layout (location=3) in vec3 a_positionNext;
layout (location=1) in vec3 a_normal;
layout (location=4) in vec3 a_normalNext;
layout (location=2) in vec2 a_texCoords;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

uniform mat4 u_lightProjectionMatrix;
uniform mat4 u_lightViewMatrix;

uniform bool u_isAnimated;
uniform float u_tweenFactor;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texCoords;

out vec4 v_lightSpacePosition;

void main() {
    vec3 position;
    vec3 normal;
    if (u_isAnimated) {
        position = mix(a_position, a_positionNext, u_tweenFactor);
        normal = mix(a_normal, a_normalNext, u_tweenFactor);
    } else {
        position = a_position;
        normal = a_normal;
    }

    gl_Position = vec4(position, 1.0) * u_modelMatrix * u_viewMatrix * u_projectionMatrix;

    v_normal = normalize(mat3(u_modelMatrix) * normal);
    v_position = vec3(vec4(position, 1.0) * u_modelMatrix);
    v_texCoords = a_texCoords;

    v_lightSpacePosition = vec4(position, 1.0) * u_modelMatrix * u_lightViewMatrix * u_lightProjectionMatrix;
}