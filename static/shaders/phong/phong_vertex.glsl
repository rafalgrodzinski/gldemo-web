#version 300 es

layout (location=0) in vec3 a_position;
layout (location=1) in vec3 a_normal;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

out vec3 v_position;
out vec3 v_normal;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

    v_normal = mat3(u_modelMatrix) * a_normal;
    v_position = vec3(u_modelMatrix * vec4(a_position, 1.0));
}