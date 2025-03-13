import { RenderPassPhong } from "./render_pass_phong.js";
import { RenderPassGrid } from "./render_pass_grid.js";

export class Renderer {
    static PHASE_RESIZE;
    static PHASE_UPDATE;
    static PHASE_PASS_PHONG;
    static PHASE_PASS_GRID;

    scene = null;
    #renderPasses = [];

     static async create(gl, scene) {
        return await new Renderer()._init(gl, scene);
     }

     async _init(gl, scene) {
        this.scene = scene;

        this.#renderPasses = await Promise.all([
            await RenderPassPhong.create(gl),
            await RenderPassGrid.create(gl)
        ]);

        return this;
     }

    resize(gl, width, height) {
        let entities = this.scene.rootEntity.entitiesForPhase(Renderer.PHASE_RESIZE);
        entities.forEach(entity => {
            entity.resize(width, height);
        });

        gl.viewport(0, 0, width, height);
        this.draw(gl);
    }

    update(elapsedMiliseconds, input) {
        let entities = this.scene.rootEntity.entitiesForPhase(Renderer.PHASE_UPDATE);
        entities.forEach(entity => {
            entity.update(elapsedMiliseconds, input);
        });
        input.resetState();
    }

    draw(gl) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        this.#renderPasses.forEach(renderPass => {
            let entities = this.scene.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.draw(gl, entities);
        });
    }
}
