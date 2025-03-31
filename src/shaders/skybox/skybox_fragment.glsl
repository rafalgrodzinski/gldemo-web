#version 300 es

precision highp float;

in vec3 v_texCoords;

uniform samplerCube u_sampler;

out vec4 o_color;
void main() {
    o_color = texture(u_sampler, v_texCoords);
}