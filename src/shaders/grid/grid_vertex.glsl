#version 300 es

layout (location=0) in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform vec3 u_cameraPosition;

out vec2 v_coordsLevel0;
out vec2 v_coordsLevel1;
out vec2 v_coordsLevel2;

void main() {
    float scale = 1000.0;

    vec3 position = vec3(a_position.x * scale + u_cameraPosition.x, 0.002, a_position.z * scale + u_cameraPosition.z);
    v_coordsLevel0 = position.xz / 10.0;
    v_coordsLevel1 = position.xz;
    v_coordsLevel2 = position.xz * 10.0;
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(position, 1);
}