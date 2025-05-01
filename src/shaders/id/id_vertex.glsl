#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = vec4(a_position, 1.0) * u_modelMatrix * u_viewMatrix * u_projectionMatrix;
}