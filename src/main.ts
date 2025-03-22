import { Scene } from "components/scene";
import { Renderer } from "renderer/renderer";
import { Config } from "utils/config";
import { Input } from "utils/input";

class Main {
    #gl!: WebGL2RenderingContext;
    #scene!: Scene;
    #renderer!: Renderer;
    #input!: Input;
    #config!: Config;

    static async create() {
        return await new Main().init();
    }

    async init() {
        let canvas = document.querySelector("#gl-view") as HTMLCanvasElement;

        this.#gl = canvas.getContext("webgl2")!;
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

        let entitiesContainer = document.querySelector("#config-entities") as HTMLElement;
        let infoContainer = document.querySelector("#config-info") as HTMLElement;
        let translationGroup = document.querySelector("#config-translation") as HTMLElement;
        let rotationGroup = document.querySelector("#config-rotation") as HTMLElement;
        let scaleGroup = document.querySelector("#config-scale") as HTMLElement;
        this.#config = await Config.create(
            entitiesContainer,
            infoContainer,
            translationGroup,
            rotationGroup,
            scaleGroup,
            this.#scene
        );

        return this;
    }

    runLoop() {
        let oldTimestamp: DOMHighResTimeStamp | null = null;

        let nextFrame = (timestamp: DOMHighResTimeStamp) => {
            if (oldTimestamp == null)
                oldTimestamp = timestamp;
            let elapsed = timestamp - oldTimestamp;
            oldTimestamp = timestamp;

            this.#renderer.update(elapsed, this.#input);
            this.#renderer.draw(this.#gl);

            requestAnimationFrame(nextFrame);
        };
        requestAnimationFrame(nextFrame);
    }
}

Main.create().then((main) => {
    main.runLoop();
});