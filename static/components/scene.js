import { Renderer } from "/renderer/renderer.js";
import { Entity } from "/components/entities/entity.js";
import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"

export class Scene {
    rootEntity = null;

    static async create(gl) {
        return await new Scene()._init(gl);
    }

    async _init(gl) {
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
}