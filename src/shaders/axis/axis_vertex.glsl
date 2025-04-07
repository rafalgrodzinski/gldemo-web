#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;

void main() {
    float x = a_position.x * 1000.0;
    float y = a_position.y == 0.0 ? 0.01 : a_position.y * 1000.0;
    float z = a_position.z * 1000.0;

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(x, y, z, 1.0);
}