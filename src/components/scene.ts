import { Phase } from "renderer/renderer";
import { Entity } from "entities/entity";
import { EntityNode } from "entities/entity_node";
import { EntityModel } from "components/entities/entity_model";
import { EntityCamera } from "components/entities/entity_camera";
import { EntityLight } from "components/entities/entity_light"
import { Vector } from "utils/vector";
import { Material } from "utils/material";
import { Light } from "utils/light";

export class Scene {
    rootEntity!: Entity;

    static async create(gl: WebGL2RenderingContext) {
        return await new Scene().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];

        this.rootEntity = await EntityNode.create("Root");

        let material1 = new Material(new Vector(1, 1, 1), 0.1, 1, 0, false, true);
        let material2 = new Material(new Vector(1, 0.5, 0.5), 0.1, 0.5, 2, false, true);
        let material3 = new Material(new Vector(0.5, 1, 0.5), 0.1, 0.8, 16, false, false);
        let material4 = new Material(new Vector(1, 1, 0.5), 0, 0, 0, true);
        
        let pyramid1_1 = await EntityModel.create(
            [Phase.PassPhong],
            "Pyramid #1.1",
            gl,
            EntityModel.KIND_PYRAMID,
            material1
        );
        let pyramid1_2 = await EntityModel.create(
            [Phase.PassPhong],
            "Pyramid #1.2",
            gl,
            EntityModel.KIND_PYRAMID,
            material1
        );
        let camera = await EntityCamera.create(
            [Phase.Resize, Phase.Update, Phase.PassPhong, Phase.PassGrid],
            "Camera #1"
        );
        pyramid1_2.addChild(camera);
        pyramid1_1.addChild(pyramid1_2);
        this.rootEntity.addChild(pyramid1_1);
        
        let pyramid2 = await EntityModel.create(
            [Phase.PassPhong],
            "Pyramid #2",
            gl,
            EntityModel.KIND_PYRAMID,
            material1
        )
        this.rootEntity.addChild(pyramid2);
        pyramid2.addChild(
            await EntityModel.create(
                [Phase.PassPhong],
                "Pyramid #3",
                gl,
                EntityModel.KIND_PYRAMID,
                material1
            )
        );

        let lightNode = await EntityNode.create("Light Node");
        lightNode.translation.y = 5;
        this.rootEntity.addChild(lightNode);

        let lightNodeModel = await EntityModel.create([Phase.PassPhong], "Light Model", gl, EntityModel.KIND_PYRAMID, material4);
        lightNodeModel.rotation.x = Math.PI/2;
        lightNodeModel.scale = new Vector(0.5, 0.5, 0.5);
        lightNode.addChild(lightNodeModel);

        let lightNodeLight = await EntityLight.create(
            [Phase.PassPhong],
            "Light #2",
            new Light(Light.KIND_DIRECTIONAL, new Vector(1, 1, 1), 1)
        );
        lightNode.addChild(lightNodeLight);

        let cube = await EntityModel.create(
            [Phase.PassPhong],
            "Cube",
            gl,
            EntityModel.KIND_CUBE,
            material3
        );
        cube.translation.z = -5;
        this.rootEntity.addChild(cube);

        let sphere = await EntityModel.create([Phase.PassPhong], "Sphere", gl, EntityModel.KIND_SPHERE, material2);
        sphere.translation.x += 3;
        sphere.translation.y += 2;
        sphere.translation.z += 1;
        this.rootEntity.addChild(sphere);

        // Point light
        let pointLightNode = await EntityNode.create("Point light node");
        pointLightNode.translation.x = 5;
        pointLightNode.translation.y = 5;
        pointLightNode.translation.z = 5;
        this.rootEntity.addChild(pointLightNode);

        let pointLightMaterial = new Material(new Vector(0.5, 0.5, 1), 0, 0, 0, true);
        let pointLightModel = await EntityModel.create([Phase.PassPhong], "Point light model", gl, EntityModel.KIND_CUBE, pointLightMaterial);
        pointLightModel.scale = new Vector(0.5, 0.5, 0.5);
        pointLightNode.addChild(pointLightModel);

        let pointLight = await EntityLight.create([Phase.PassPhong], "Point light", new Light(Light.KIND_POINT, new Vector(0.5, 0.5, 1), 1, 0.07, 0.017));
        pointLightNode.addChild(pointLight);

        // Ambient light
        let ambientLight = await EntityLight.create([Phase.PassPhong], "Ambient light", new Light(Light.KIND_AMBIENT, new Vector(1, 1, 1), 1));
        this.rootEntity.addChild(ambientLight);

        return this;
    }
}