import { Renderer } from "/renderer/renderer.js";
import { Config } from "/utils/config.js";
import { Input } from "/utils/input.js";

class Main {
    #renderer = null;
    #config = null;
    #input = null;

    static async create() {
        return await new Main().init();
    }

    async init() {
        let canvas = document.querySelector("#gl-view");
        let gl = canvas.getContext("webgl2");
        if(!gl) {
            alert("Unable to initialize WebGL");
            throw new Error();
        }

        this.#renderer = await Renderer.create(gl);
        this.#input = await Input.create(canvas);

        let resizeObserver = new ResizeObserver( entries => {
            let entry = entries[0];
            canvas.width = entry.contentRect.width;
            canvas.height = entry.contentRect.height;
            this.#renderer.resize(entry.contentRect.width, entry.contentRect.height);
        });
        resizeObserver.observe(canvas);

        let entitiesContainer = document.querySelector("#config-entities");
        let infoContainer = document.querySelector("#config-info");
        let translationGroup = document.querySelector("#config-translation");
        let rotationGroup = document.querySelector("#config-rotation");
        let scaleGroup = document.querySelector("#config-scale");
        this.#config = await Config.create(entitiesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup);
        this.#config.entities = this.#renderer.rootEntity.children;

        return this;
    }

    runLoop() {
        let renderer = this.#renderer;
        let oldTimestamp;
        let input = this.#input

        function nextFrame(timestamp) {
            if (oldTimestamp == undefined)
                oldTimestamp = timestamp;
            let elapsed = timestamp - oldTimestamp;
            oldTimestamp = timestamp;

            renderer.update(elapsed, input);
            renderer.draw();

            requestAnimationFrame(nextFrame);
        }
        requestAnimationFrame(nextFrame);
    }
}

let main = await Main.create();
main.runLoop();