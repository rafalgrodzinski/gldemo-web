#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;

out vec3 v_texCoords;

void main() {
    v_texCoords = a_position;

    mat4 projection = u_projectionMatrix;
    projection[3][3] = 0.0;
    vec4 position = vec4(a_position, 1.0) * mat4(mat3(u_viewMatrix)) * projection;
    gl_Position = position.xyww;
}