import { Renderer } from "/renderer/renderer.js";
import { Config } from "/utils/config.js";

class Main {
    #renderer = null;
    #config = null;

    constructor() { 
        let instance = async () => {
            let canvas = document.querySelector("#gl-view");
            let gl = canvas.getContext("webgl2");
            if(!gl) {
                alert("Unable to initialize WebGL");
                throw new Error();
            }
    
            this.#renderer = await new Renderer(gl);
    
            let resizeObserver = new ResizeObserver( entries => {
                let entry = entries[0];
                canvas.width = entry.contentRect.width;
                canvas.height = entry.contentRect.height;
                this.#renderer.resize(entry.contentRect.width, entry.contentRect.height);
            });
            resizeObserver.observe(canvas);
    
            let entitiesContainer = document.querySelector("#config-entities");
            let translationGroup = document.querySelector("#config-translation");
            let rotationGroup = document.querySelector("#config-rotation");
            let scaleGroup = document.querySelector("#config-scale");
            this.#config = await new Config(entitiesContainer, translationGroup, rotationGroup, scaleGroup);
            this.#config.entities = this.#renderer.entities;
    
            return this;
        };
        return instance();
    }

    runLoop() {
        let renderer = this.#renderer;
        let oldTimestamp;

        function nextFrame(timestamp) {
            if (oldTimestamp == undefined)
                oldTimestamp = timestamp;
            let elapsed = timestamp - oldTimestamp;
            oldTimestamp = timestamp;

            renderer.update(elapsed);
            renderer.draw();

            requestAnimationFrame(nextFrame);
        }
        requestAnimationFrame(nextFrame);
    }
}

let main = await new Main();
main.runLoop();