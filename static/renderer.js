export class Renderer {
    constructor(gl) {
        this.gl = gl;
    }

    draw() {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
