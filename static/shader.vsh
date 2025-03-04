#version 300 es

in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelMatrix;

out vec3 v_color;


void main() {
    gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 1.0);
    v_color = a_position;
}