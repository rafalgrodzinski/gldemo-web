import { Renderer } from "/renderer/renderer.js";
import { Entity } from "/components/entities/entity.js";
import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"
import { Vector } from "/utils/vector.js";
import { Material } from "/utils/material.js";

export class Scene {
    rootEntity = null;

    static async create(gl) {
        return await new Scene()._init(gl);
    }

    async _init(gl) {
        this.rootEntity = await Entity.create("Root");

        let material1 = new Material(new Vector(1, 1, 1), 0.1, 1, 0, false);
        let material2 = new Material(new Vector(1, 0.5, 0.5), 0.1, 0.5, 2, false);
        let material3 = new Material(new Vector(0.5, 1, 0.5), 0.1, 0.8, 16, false);
        let material4 = new Material(new Vector(1, 1, 0.5), 0, 0, 0, true);
        
        let pyramid1_1 = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Pyramid #1.1",
            gl,
            EntityModel.KIND_PYRAMID,
            material1
        );
        let pyramid1_2 = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Pyramid #1.2",
            gl,
            EntityModel.KIND_PYRAMID,
            material1
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
            gl,
            EntityModel.KIND_PYRAMID,
            material1
        )
        this.rootEntity.addChild(pyramid2);
        pyramid2.addChild(
            await EntityModel.create(
                [Renderer.PHASE_PASS_PHONG],
                "Pyramid #3",
                gl,
                EntityModel.KIND_PYRAMID,
                material1
            )
        );

        let lightNode = await Entity.create("Light Node");
        lightNode.translation.y = 5;
        this.rootEntity.addChild(lightNode);

        let lightNodeModel = await EntityModel.create([Renderer.PHASE_PASS_PHONG], "Light Model", gl, EntityModel.KIND_PYRAMID, material4);
        lightNodeModel.rotation.x = Math.PI/2;
        lightNodeModel.scale = new Vector(0.5, 0.5, 0.5);
        lightNode.addChild(lightNodeModel);

        let lightNodeLight = await EntityLight.create(
            [Renderer.PHASE_PASS_PHONG],
            "Light #2",
            EntityLight.DIRECTIONAL,
            {
                color: new Vector(1, 1, 1),
                intensity: 1
            }
        );
        lightNode.addChild(lightNodeLight);

        let cube = await EntityModel.create(
            [Renderer.PHASE_PASS_PHONG],
            "Cube",
            gl,
            EntityModel.KIND_CUBE,
            material3
        );
        cube.translation.z = -5;
        this.rootEntity.addChild(cube);

        let sphere = await EntityModel.create([Renderer.PHASE_PASS_PHONG], "Sphere", gl, EntityModel.KIND_SPHERE, material2);
        sphere.translation.x += 3;
        sphere.translation.y += 2;
        sphere.translation.z += 1;
        this.rootEntity.addChild(sphere);

        return this;
    }
}