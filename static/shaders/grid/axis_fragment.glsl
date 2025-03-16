#version 300 es

precision highp float;

uniform int u_axisDirection;

out vec4 o_color;

void main() {
    if (u_axisDirection == 0) {
        o_color = vec4(1, 0, 0, 1);
    } else if (u_axisDirection == 1) {
        o_color = vec4(0, 1, 0, 1);
    } else if (u_axisDirection == 2) {
        o_color = vec4(0, 0, 1, 1);
    } else {
        discard;
    }
}