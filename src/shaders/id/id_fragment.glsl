#version 300 es

precision highp float;

uniform int u_id;

out vec4 o_color;
void main() {
    float r = float(u_id & 0xff) / 255.0;
    float g = float((u_id >> 8) & 0xff) / 255.0;
    float b = float((u_id >> 16) & 0xff) / 255.0;
    o_color = vec4(r, g, b, 1.0);
}