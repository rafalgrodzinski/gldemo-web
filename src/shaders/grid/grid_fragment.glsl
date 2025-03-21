#version 300 es

precision highp float;

in vec2 v_coordsLevel0;
in vec2 v_coordsLevel1;
in vec2 v_coordsLevel2;

uniform sampler2D u_sampler;

out vec4 o_color;

void main() {
    vec4 color;

    vec4 level0Color = texture(u_sampler, v_coordsLevel0);
    level0Color *= 2.0;
    level0Color.a = clamp(level0Color.a, 0.0, 0.75);
    color = level0Color;

    vec4 level1Color = texture(u_sampler, v_coordsLevel1);
    level1Color *= 2.0;
    level1Color.a = clamp(level1Color.a, 0.0, 0.75);
    color = mix(color, level1Color, 1.0 - color.a);

    vec4 level2Color = texture(u_sampler, v_coordsLevel2);
    level2Color *= 2.0;
    level2Color.a = clamp(level2Color.a, 0.0, 0.75);
    color = mix(color, level2Color, 1.0 - color.a);

    o_color = color;
}