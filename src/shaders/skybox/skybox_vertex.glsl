#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;

out vec3 v_texCoords;

void main() {
    v_texCoords = vec3(a_position.x, a_position.y, -a_position.z);

    vec4 position = vec4(a_position, 1.0) * mat4(mat3(u_viewMatrix)) * u_projectionMatrix; 
    gl_Position = position.xyww;
}