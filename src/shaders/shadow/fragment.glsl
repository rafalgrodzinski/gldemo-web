#version 300 es
precision highp float;

out vec4 o_color;
void main() {
    gl_FragDepth = gl_FragCoord.z;
    
    //o_color = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
    //o_color = vec4(1.0, 0.0, 0.0, 1.0);
}