import { Phase } from "renderer/renderer";
import { Entity } from "entities/entity";
import { EntityNode } from "entities/entity_node";
import { EntityModel } from "components/entities/entity_model";
import { EntityCamera } from "components/entities/entity_camera";
import { EntityLight } from "components/entities/entity_light"
import { Vector } from "data/vector";
import { Material } from "data/material";
import { Light, LightKind } from "data/light";
import { Util } from "utils/util";
import { ModelProcedural, ModelProceduralKind } from "data/model/model_procedural";
import { Data } from "data/data_types";
import { ModelObj } from "data/model/model_obj";

export class Scene {
    rootEntity!: Entity;

    static async create(gl: WebGL2RenderingContext) {
        return await new Scene().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];

        this.rootEntity = await EntityNode.create("Root");

        let material1 = new Material(Data.rgb(1, 1, 1), 0.1, 1, 0, false, await Util.image("box.jpg"));
        let material2 = new Material(Data.rgb(1, 0.5, 0.5), 0.1, 0.5, 2, false, await Util.image("box.jpg"));
        let material3 = new Material(Data.rgb(0.5, 1, 0.5), 0.1, 0.8, 16, false, null);
        let material4 = new Material(Data.rgb(1, 1, 0.5), 0, 0, 0, true, null);
        let pointLightMaterial = new Material(Data.rgb(0.5, 0.5, 1), 0, 0, 0, true, null);

        let modelPyramid = await ModelProcedural.create(ModelProceduralKind.Pyramid, material1);
        let modelCube = await ModelProcedural.create(ModelProceduralKind.Cube, material1);
        let modelSphere = await ModelProcedural.create(ModelProceduralKind.Sphere, material2);
        let modelPyramid2 = await ModelProcedural.create(ModelProceduralKind.Pyramid, material4);
        let modelCube2 = await ModelProcedural.create(ModelProceduralKind.Cube, pointLightMaterial);
        
        let pyramid1_1 = await EntityModel.create([Phase.PassPhong], "Pyramid #1.1", gl, modelPyramid);
        let pyramid1_2 = await EntityModel.create([Phase.PassPhong], "Pyramid #1.2", gl, modelPyramid);
        let camera = await EntityCamera.create(
            [Phase.Resize, Phase.Update, Phase.PassPhong, Phase.PassGrid, Phase.PassDebugNormals],
            "Camera #1"
        );
        pyramid1_2.addChild(camera);
        pyramid1_1.addChild(pyramid1_2);
        this.rootEntity.addChild(pyramid1_1);
        
        let pyramid2 = await EntityModel.create([Phase.PassPhong], "Pyramid #2", gl, modelPyramid);
        this.rootEntity.addChild(pyramid2);
        pyramid2.addChild(
            await EntityModel.create([Phase.PassPhong], "Pyramid #3", gl, modelPyramid)
        );

        let lightNode = await EntityNode.create("Light Node");
        lightNode.translation.y = 5;
        this.rootEntity.addChild(lightNode);

        let lightNodeModel = await EntityModel.create([Phase.PassPhong], "Light Model", gl, modelPyramid2);
        lightNodeModel.rotation.x = Math.PI/2;
        lightNodeModel.scale = new Vector(0.5, 0.5, 0.5);
        lightNode.addChild(lightNodeModel);

        let lightNodeLight = await EntityLight.create(
            [Phase.PassPhong],
            "Light #2",
            new Light(LightKind.Directional, Data.rgb(1, 1, 1), 1, 0, 0)
        );
        lightNode.addChild(lightNodeLight);

        let cube = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals], "Cube", gl, modelCube);
        cube.translation.z = -5;
        this.rootEntity.addChild(cube);

        let sphere = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals], "Sphere", gl, modelSphere);
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

        let pointLightModel = await EntityModel.create([Phase.PassPhong], "Point light model", gl, modelCube2);
        pointLightModel.scale = new Vector(0.5, 0.5, 0.5);
        pointLightNode.addChild(pointLightModel);

        let pointLight = await EntityLight.create([Phase.PassPhong], "Point light", new Light(LightKind.Point, Data.rgb(0.5, 0.5, 1), 1, 0.07, 0.017));
        pointLightNode.addChild(pointLight);

        // Ambient light
        let ambientLight = await EntityLight.create([Phase.PassPhong], "Ambient light", new Light(LightKind.Ambient, Data.rgb(1, 1, 1), 1, 0, 0));
        this.rootEntity.addChild(ambientLight);

        // Bear
        let bearMaterial = new Material(Data.rgb(1,  1, 1), 0.1, 1, 8, false, await Util.image("bear.png"));
        let bearModel = await ModelObj.create("bear.obj", bearMaterial);
        let bearEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals], "Bear", gl, bearModel);
        bearEntity.scale.x = bearEntity.scale.y = bearEntity.scale.z = 0.2;
        this.rootEntity.addChild(bearEntity);

        return this;
    }
}