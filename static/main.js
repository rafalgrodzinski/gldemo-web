import { Renderer } from "/renderer.js";

class Main {
    constructor() {
        let canvas = document.querySelector("#gl-view");
        this.gl = canvas.getContext("webgl2");
        if(!this.gl) {
            alert("Unable to initialize WebGL");
            throw new Error();
        }

        this.renderer = new Renderer(this.gl);
    }

    runLoop() {
        this.renderer.draw();
    }
}

let main = new Main();
main.runLoop();