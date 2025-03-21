#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;

void main() {
    float scale = 1000.0;
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position * scale, 1.0);
}