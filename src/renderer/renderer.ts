import { RenderPass } from "render_pass";
import { RenderPassPhong } from "renderer/render_pass_phong";
import { RenderPassGrid } from "renderer/render_pass_grid";
import { Scene } from "components/scene";
import { Input } from "utils/input";

export class Renderer {
    static PHASE_RESIZE = "phase_resize";
    static PHASE_UPDATE = "phase_update";
    static PHASE_PASS_PHONG = "phase_pass_phong";
    static PHASE_PASS_GRID = "phase_pass_grid";

    scene!: Scene;
    #renderPasses: Array<RenderPass> = [];

     static async create(gl: WebGL2RenderingContext, scene: Scene) {
        return await new Renderer()._init(gl, scene);
     }

     async _init(gl: WebGL2RenderingContext, scene: Scene) {
        this.scene = scene;

        this.#renderPasses = await Promise.all([
            await RenderPassPhong.create(gl),
            await RenderPassGrid.create(gl)
        ]);

        return this;
     }

    resize(gl: WebGL2RenderingContext, width: number, height: number) {
        let entities = this.scene.rootEntity.entitiesForPhase(Renderer.PHASE_RESIZE);
        entities.forEach(entity => {
            entity.resize(width, height);
        });

        gl.viewport(0, 0, width, height);
        this.draw(gl);
    }

    update(elapsedMiliseconds: number, input: Input) {
        let entities = this.scene.rootEntity.entitiesForPhase(Renderer.PHASE_UPDATE);
        entities.forEach(entity => {
            entity.update(elapsedMiliseconds, input);
        });
        input.resetState();
    }

    draw(gl: WebGL2RenderingContext) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        this.#renderPasses.forEach(renderPass => {
            let entities = this.scene.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.draw(gl, entities);
        });
    }
}
