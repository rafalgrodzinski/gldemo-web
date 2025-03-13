import { Entity } from "/components/entities/entity.js";
import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"
import { RenderPassPhong } from "./render_pass_phong.js";
import { RenderPassGrid } from "./render_pass_grid.js";

export class Renderer {
    static PHASE_RESIZE;
    static PHASE_UPDATE;
    static PHASE_PASS_PHONG;
    static PHASE_PASS_GRID;

    #gl = null;
    #renderPasses = [];
    rootEntity = null;

     static async create(gl) {
        return await new Renderer()._init(gl);
     }

     async _init(gl) {
        this.#gl = gl;

        this.#renderPasses = await Promise.all([
            await RenderPassPhong.create(gl),
            await RenderPassGrid.create(gl)
        ]);

        this.rootEntity = await Entity.create([], "Root", gl);

         this.rootEntity.addChild(
             await EntityCamera.create(
                 [Renderer.PHASE_RESIZE, Renderer.PHASE_UPDATE, Renderer.PHASE_PASS_PHONG, Renderer.PHASE_PASS_GRID],
                 "Camera #1"
             )
         );
         this.rootEntity.addChild(
             await EntityLight.create(
                 [Renderer.PHASE_PASS_PHONG],
                 "Light #1",
                 EntityLight.DIRECTIONAL,
                 {
                     color: { r: 1, g: 0, b: 0 },
                     intensity: 1
                 }
             )
         );
         this.rootEntity.addChild(
             await EntityLight.create(
                 [Renderer.PHASE_PASS_PHONG],
                 "Light #2",
                 EntityLight.DIRECTIONAL,
                 {
                     color: { r: 0, g: 1, b: 0 },
                     intensity: 1
                 }
             )
         );
         this.rootEntity.addChild(
             await EntityModel.create(
                 [Renderer.PHASE_PASS_PHONG],
                 "Pyramid #1",
                 gl
             )
         );
         this.rootEntity.addChild(
             await EntityModel.create(
                 [Renderer.PHASE_PASS_PHONG],
                 "Pyramid #2",
                 gl
             )
         );

        return this;
     }

    resize(width, height) {
        let gl = this.#gl;

        let entities = this.rootEntity.entitiesForPhase(Renderer.PHASE_RESIZE);
        entities.forEach(entity => {
            entity.resize(width, height);
        });

        gl.viewport(0, 0, width, height);
        this.draw();
    }

    update(elapsedMiliseconds, input) {
        let entities = this.rootEntity.entitiesForPhase(Renderer.PHASE_UPDATE);
        entities.forEach(entity => {
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
            let entities = this.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.draw(gl, entities);
        });
    }
}
