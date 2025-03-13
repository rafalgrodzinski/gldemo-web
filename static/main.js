import { Scene } from "/components/scene.js";
import { Renderer } from "/renderer/renderer.js";
import { Config } from "/utils/config.js";
import { Input } from "/utils/input.js";

class Main {
    #gl = null;
    #scene = null;
    #renderer = null;
    #config = null;
    #input = null;

    static async create() {
        return await new Main().init();
    }

    async init() {
        let canvas = document.querySelector("#gl-view");
        this.#gl = canvas.getContext("webgl2");
        if(!this.#gl) {
            alert("Unable to initialize WebGL");
            throw new Error();
        }

        this.#scene = await Scene.create(this.#gl);
        this.#renderer = await Renderer.create(this.#gl, this.#scene);
        this.#input = await Input.create(canvas);

        let resizeObserver = new ResizeObserver( entries => {
            let entry = entries[0];
            canvas.width = entry.contentRect.width;
            canvas.height = entry.contentRect.height;
            this.#renderer.resize(this.#gl, entry.contentRect.width, entry.contentRect.height);
        });
        resizeObserver.observe(canvas);

        let entitiesContainer = document.querySelector("#config-entities");
        let infoContainer = document.querySelector("#config-info");
        let translationGroup = document.querySelector("#config-translation");
        let rotationGroup = document.querySelector("#config-rotation");
        let scaleGroup = document.querySelector("#config-scale");
        this.#config = await Config.create(entitiesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, this.#scene);
        //this.#config.entities = this.#renderer.rootEntity.children;

        return this;
    }

    runLoop() {
        let gl = this.#gl;
        let renderer = this.#renderer;
        let oldTimestamp;
        let input = this.#input

        function nextFrame(timestamp) {
            if (oldTimestamp == undefined)
                oldTimestamp = timestamp;
            let elapsed = timestamp - oldTimestamp;
            oldTimestamp = timestamp;

            renderer.update(elapsed, input);
            renderer.draw(gl);

            requestAnimationFrame(nextFrame);
        }
        requestAnimationFrame(nextFrame);
    }
}

let main = await Main.create();
main.runLoop();