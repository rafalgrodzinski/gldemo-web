#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_lightProjectionMatrix;
uniform mat4 u_lightViewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = u_lightProjectionMatrix * u_lightViewMatrix * u_modelMatrix * vec4(a_position, 1.0);
}