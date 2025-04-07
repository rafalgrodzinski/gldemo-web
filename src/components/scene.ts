import { CoordsOrientation, Phase } from "renderer/renderer";
import { Entity } from "entities/entity";
import { EntityNode } from "entities/entity_node";
import { EntityModel } from "components/entities/entity_model";
import { EntityCamera } from "components/entities/entity_camera";
import { EntityLight } from "components/entities/entity_light"
import { Vector } from "data/vector";
import { Material } from "data/material";
import { Light, LightKind } from "data/light";
import { ModelProcedural, ModelProceduralKind } from "data/model/model_procedural";
import { Data } from "data/data_types";
import { ModelObj } from "data/model/model_obj";
import { ModelMdl } from "../data/model/model_mdl";
import { Texture2D } from "../data/texture/texture_2d";
import { EntityModelAnimated } from "./entities/entity_model_animated";

export class Scene {
    rootEntity!: Entity;

    static async create(gl: WebGL2RenderingContext, coordsOrientation: CoordsOrientation) {
        return await new Scene().init([gl, coordsOrientation]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, coordsOrientation] = args as [WebGL2RenderingContext, CoordsOrientation];

        this.rootEntity = await EntityNode.create("Root");

        // Camera
        let cameraEntity = await EntityCamera.create(
            [Phase.Resize, Phase.Update, Phase.PassPhong, Phase.PassGrid, Phase.PassAxis, Phase.PassDebugNormals, Phase.PassSkybox],
            "Camera",
            coordsOrientation
        );
        cameraEntity.translation.y = 4;
        cameraEntity.translation.z = 4;
        this.rootEntity.addChild(cameraEntity);

        // Ambient light
        let ambientLight = await EntityLight.create([Phase.PassPhong], "Ambient light", gl, new Light(LightKind.Ambient, Data.rgb(1, 1, 1), 1, 0, 0, false), coordsOrientation);
        this.rootEntity.addChild(ambientLight);

        // Directional Light
        let directionalLightNodeEntity = await EntityNode.create("Directional Light Node");
        directionalLightNodeEntity.translation.y = 5;
        directionalLightNodeEntity.translation.z = 5;
        this.rootEntity.addChild(directionalLightNodeEntity);

        let directionalLightMaterial = new Material(Data.rgb(1, 1, 0.5), 0, 0, 0, true, null);
        let directionalLightModel = await ModelProcedural.create(ModelProceduralKind.Pyramid, directionalLightMaterial);
        let directionalLightModelEntity = await EntityModel.create([Phase.PassPhong], "Directional Light Model", gl, directionalLightModel);
        directionalLightModelEntity.rotation.x = Math.PI / 2;
        directionalLightModelEntity.scale = new Vector(0.5, 0.5, 0.5);
        directionalLightNodeEntity.addChild(directionalLightModelEntity);

        let directionaLight = new Light(LightKind.Directional, Data.rgb(1, 1, 1), 1, 0, 0, true)
        let directionalLightEntity = await EntityLight.create([Phase.PassPhong, Phase.PassShadowMap, Phase.Resize], "Directional Light", gl, directionaLight, coordsOrientation);
        directionalLightNodeEntity.addChild(directionalLightEntity);

        // Point light
        let pointLightNodeEntity = await EntityNode.create("Point Light Node");
        pointLightNodeEntity.translation.x = 5;
        pointLightNodeEntity.translation.y = 5;
        pointLightNodeEntity.translation.z = 5;
        this.rootEntity.addChild(pointLightNodeEntity);

        let pointLightMaterial = new Material(Data.rgb(0.5, 0.5, 1), 0, 0, 0, true, null);
        let pointLightModel = await ModelProcedural.create(ModelProceduralKind.Cube, pointLightMaterial);
        let pointLightModelEntity = await EntityModel.create([Phase.PassPhong], "Point light model", gl, pointLightModel);
        pointLightModelEntity.scale = new Vector(0.5, 0.5, 0.5);
        pointLightNodeEntity.addChild(pointLightModelEntity);

        let pointLight = new Light(LightKind.Point, Data.rgb(0.5, 0.5, 1), 1, 0.07, 0.017, false);
        let pointLightEntity = await EntityLight.create([Phase.PassPhong], "Point light", gl, pointLight, coordsOrientation);
        pointLightNodeEntity.addChild(pointLightEntity);

        // Bear
        let bearTexture = await Texture2D.create(gl, "bear.png");
        let bearMaterial = new Material(Data.rgb(1,  1, 1), 0.1, 1, 8, false, bearTexture);
        let bearModel = await ModelObj.create("bear.obj", bearMaterial);
        let bearEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap], "Bear", gl, bearModel);
        bearEntity.translation.z = -4;
        bearEntity.translation.x = 4;
        bearEntity.scale.x = bearEntity.scale.y = bearEntity.scale.z = 0.2;
        this.rootEntity.addChild(bearEntity);

        // Cube
        let cubeTexture = await Texture2D.create(gl, "box.jpg");
        let cubeMaterial = new Material(Data.rgb(1, 1, 1), 0.1, 1, 0, false, cubeTexture);
        let cubeModel = await ModelProcedural.create(ModelProceduralKind.Cube, cubeMaterial);
        let cubeEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap], "Cube", gl, cubeModel);
        cubeEntity.translation.z = -5;
        cubeEntity.translation.y = 1;
        this.rootEntity.addChild(cubeEntity);

        // Sphere
        let sphereTexture = await Texture2D.create(gl, "box.jpg");
        let sphereMaterial = new Material(Data.rgb(1, 0.5, 0.5), 0.1, 0.5, 2, false, sphereTexture);
        let sphereModel = await ModelProcedural.create(ModelProceduralKind.Sphere, sphereMaterial);
        let sphereEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap], "Sphere", gl, sphereModel);
        sphereEntity.translation.x += 3;
        sphereEntity.translation.y += 2;
        sphereEntity.translation.z += 1;
        this.rootEntity.addChild(sphereEntity);

        // Ground
        let groundTexture = await Texture2D.create(gl, "grass.jpg");
        let groundMaterial = new Material(Data.rgb(0.5, 0.5, 0.5), 0.1, 1, 0, false, groundTexture);
        let groundModel = await ModelProcedural.create(ModelProceduralKind.Plane, groundMaterial);
        let groundEntity = await EntityModel.create([Phase.PassPhong, Phase.PassShadowMap], "Ground", gl, groundModel);
        groundEntity.scale.y = 0.5;
        groundEntity.scale.x = 20;
        groundEntity.scale.z = 20;
        groundEntity.translation.y = -0.5;
        this.rootEntity.addChild(groundEntity);

        // Soldier
        let soldierModel = await ModelMdl.create(gl, "soldier.mdl");
        let soldierEntity = await EntityModelAnimated.create([Phase.PassPhong, Phase.PassShadowMap, Phase.Update], "Soldier", gl, soldierModel);
        soldierEntity.scale.x = soldierEntity.scale.y = soldierEntity.scale.z = 0.2;
        soldierEntity.translation.y = 4;
        soldierEntity.translation.x = -5;
        this.rootEntity.addChild(soldierEntity);
        soldierModel.anims[0].play();

        return this;
    }
}