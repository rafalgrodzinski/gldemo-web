import { Renderer } from "/renderer.js";

class Main {
    constructor() { }

    static async create() {
        let instance = new Main();

        let canvas = document.querySelector("#gl-view");
        instance.gl = canvas.getContext("webgl2");
        if(!instance.gl) {
            alert("Unable to initialize WebGL");
            throw new Error();
        }

        instance.renderer = await Renderer.create(instance.gl);

        return instance;
    }

    runLoop() {
        this.renderer.draw(this.gl);
    }
}

let main = await Main.create();
main.runLoop();