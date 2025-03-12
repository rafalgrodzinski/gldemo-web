import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"
import { RenderPassPhong } from "./render_pass_phong.js";
import { RenderPassGrid } from "./render_pass_grid.js";
import { Util } from "/utils/util.js";

export class Renderer {
    static PHASE_RESIZE;
    static PHASE_UPDATE;
    static PHASE_PASS_PHONG;
    static PHASE_PASS_GRID;

    #gl = null;
    #renderPasses = [];
    entities = [];

     static async create(gl) {
        return await new Renderer()._init(gl);
     }

     async _init(gl) {
        this.#gl = gl;

        this.#renderPasses = await Promise.all([
            await RenderPassPhong.create(gl),
            await RenderPassGrid.create(gl)
        ]);

        this.entities = await Promise.all([
            await EntityCamera.create(
                [Renderer.PHASE_RESIZE, Renderer.PHASE_UPDATE, Renderer.PHASE_PASS_PHONG, Renderer.PHASE_PASS_GRID],
                "Camera #1"
            ), 
            await EntityLight.create(
                [Renderer.PHASE_PASS_PHONG],
                "Light #1",
                EntityLight.DIRECTIONAL,
                {color: {r: 1, g: 0, b: 0},
                intensity: 1}
            ),
            await EntityLight.create(
                [Renderer.PHASE_PASS_PHONG],
                "Light #2",
                EntityLight.DIRECTIONAL,
                {color: {r: 0, g: 1, b: 0},
                intensity: 1}
            ),
            await EntityModel.create(
                [Renderer.PHASE_PASS_PHONG],
                "Pyramid #2",
                gl
            ),
            await EntityModel.create(
                [Renderer.PHASE_PASS_PHONG],
                "Pyramid #2",
                gl
            )
        ]);

        return this;
     }

    resize(width, height) {
        let gl = this.#gl;

        Util.runPhase(this.entities, Renderer.PHASE_RESIZE, entity => {
            entity.resize(width, height);
        })

        gl.viewport(0, 0, width, height);
        this.draw();
    }

    update(elapsedMiliseconds, input) {
        Util.runPhase(this.entities, Renderer.PHASE_UPDATE, entity => {
            entity.update(elapsedMiliseconds, input);
        });
        input.resetState();
    }

    draw() {
        let gl = this.#gl;

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        this.#renderPasses.forEach(renderPass => {
            let filteredEntities = this.entities.filter(entity => {
                return entity.phases.includes(renderPass.phase);
            });
            renderPass.draw(gl, filteredEntities);
        });
    }
}
