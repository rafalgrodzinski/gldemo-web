#version 300 es

layout (location=0) in vec3 a_position;
layout (location=1) in vec3 a_normal;
layout (location=2) in vec2 a_texCoords;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

uniform mat4 u_lightProjectionMatrix;
uniform mat4 u_lightViewMatrix;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texCoords;

out vec4 v_lightSpacePosition;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

    v_normal = normalize(mat3(u_modelMatrix) * a_normal);
    v_position = vec3(u_modelMatrix * vec4(a_position, 1.0));
    v_texCoords = a_texCoords;

    v_lightSpacePosition = u_lightProjectionMatrix * u_lightViewMatrix * u_modelMatrix * vec4(a_position, 1.0);
}