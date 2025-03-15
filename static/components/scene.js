import { Renderer } from "/renderer/renderer.js";
import { Entity } from "/components/entities/entity.js";
import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"
import { Vector3 } from "/utils/vector.js";

export class Scene {
    rootEntity = null;

    static async create(gl) {
        return await new Scene()._init(gl);
    }

    async _init(gl) {
        this.rootEntity = await Entity.create("Root");

        /*this.rootEntity.addChild(
            await EntityLight.create(
                [Renderer.PHASE_PASS_PHONG],
                "Light #2",
                EntityLight.DIRECTIONAL,
                {
                    color: { r: 0, g: 1, b: 0 },
                    intensity: 1
                }
            )
        );*/
        
        let pyramid1_1 = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Pyramid #1.1",
            gl
        );
        let pyramid1_2 = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Pyramid #1.2",
            gl
        );
        let camera = await EntityCamera.create(
            [Renderer.PHASE_RESIZE, Renderer.PHASE_UPDATE, Renderer.PHASE_PASS_PHONG, Renderer.PHASE_PASS_GRID],
            "Camera #1"
        );
        pyramid1_2.addChild(camera);
        pyramid1_1.addChild(pyramid1_2);
        this.rootEntity.addChild(pyramid1_1);
        
        let pyramid2 = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Pyramid #2",
            gl
        )
        this.rootEntity.addChild(pyramid2);
        pyramid2.addChild(
            await EntityModel.create(
                [Renderer.PHASE_PASS_PHONG],
                "Pyramid #3",
                gl
            )
        );

        let lightNode = await Entity.create("Light Node");
        this.rootEntity.addChild(lightNode);

        let lightNodeModel = await EntityModel.create([Renderer.PHASE_PASS_PHONG], "Light Model", gl);
        lightNodeModel.rotation.x = Math.PI/2;
        lightNodeModel.scale = new Vector3(0.5, 0.5, 0.5);
        lightNode.addChild(lightNodeModel);

        let lightNodeLight = await EntityLight.create(
            [Renderer.PHASE_PASS_PHONG],
            "Light #2",
            EntityLight.DIRECTIONAL,
            {
                color: { r: 1, g: 1, b: 1 },
                intensity: 1
            }
        );
        lightNode.addChild(lightNodeLight);

        return this;
    }
}