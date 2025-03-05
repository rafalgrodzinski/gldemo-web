import { Renderer } from "/renderer.js";
import { Config } from "/config.js";

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

        instance.renderer = await new Renderer(instance.gl);

        let resizeObserver = new ResizeObserver( entries => {
            let entry = entries[0];
            canvas.width = entry.contentRect.width;
            canvas.height = entry.contentRect.height;
            instance.renderer.resize(instance.gl, entry.contentRect.width, entry.contentRect.height);
        });
        resizeObserver.observe(canvas);

        let entitiesContainer = document.querySelector("#config-entities");
        let translationGroup = document.querySelector("#config-translation");
        let rotationGroup = document.querySelector("#config-rotation");
        let scaleGroup = document.querySelector("#config-scale");
        instance.config = await new Config(entitiesContainer, translationGroup, rotationGroup, scaleGroup);
        instance.config.entities = instance.renderer.entities;

        return instance;
    }

    runLoop() {
        let renderer = this.renderer;
        let gl = this.gl;
        let oldTimestamp;

        function nextFrame(timestamp) {
            if (oldTimestamp == undefined)
                oldTimestamp = timestamp;
            let elapsed = timestamp - oldTimestamp;
            oldTimestamp = timestamp;

            renderer.update(elapsed);
            renderer.draw(gl);

            requestAnimationFrame(nextFrame);
        }
        requestAnimationFrame(nextFrame);
    }
}

let main = await Main.create();
main.runLoop();