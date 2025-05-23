import { CoordsOrientation, Phase } from "renderer/renderer";
import { Entity } from "entities/entity";
import { EntityNode } from "entities/entity_node";
import { EntityModel } from "components/entities/entity_model";
import { EntityCamera } from "components/entities/entity_camera";
import { EntityLight } from "components/entities/entity_light"
import { Material } from "data/material";
import { Light, LightKind } from "data/light";
import { ModelProcedural, ModelProceduralKind } from "data/model/model_procedural";
import { Data } from "data/data_types";
import { ModelObj } from "data/model/model_obj";
import { ModelMdl } from "../data/model/model_mdl";
import { Texture2D } from "../data/texture/texture_2d";
import { EntityModelAnimated } from "./entities/entity_model_animated";
import { TextureCube } from "../data/texture/texture_cube";
import { Camera } from "../data/camera";

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
            [Phase.Resize, Phase.Update, Phase.PassPhong, Phase.PassGrid, Phase.PassAxis, Phase.PassDebugNormals, Phase.PassSkybox, Phase.PassId],
            "Camera",
            Camera.makePerspective(Math.PI/2, 100),
            coordsOrientation
        );
        cameraEntity.translation.y = 4;
        cameraEntity.translation.z = 4;

        let cameraNodeEntity = await EntityNode.create("Camera Node");
        cameraNodeEntity.addChild(cameraEntity);
        this.rootEntity.addChild(cameraNodeEntity);

        // Ambient light
        let ambientLight = Light.makeAmbient(Data.rgb(1, 1, 1), 1);
        let ambientLightEntity = await EntityLight.create([Phase.PassPhong], "Ambient light", gl, ambientLight, coordsOrientation);
        this.rootEntity.addChild(ambientLightEntity);

        // Directional Light
        let directionalLightNodeEntity = await EntityNode.create("Directional Light Node");
        directionalLightNodeEntity.translation.y = 5;
        directionalLightNodeEntity.translation.z = 5;
        directionalLightNodeEntity.rotation.x = Math.PI/4;
        this.rootEntity.addChild(directionalLightNodeEntity);

        let directionalLightMaterial = new Material(Data.rgb(0.5, 1, 0.5), 0, 0, 0, true, null, null, null);
        let directionalLightModel = await ModelProcedural.create(ModelProceduralKind.Pyramid, directionalLightMaterial);
        let directionalLightModelEntity = await EntityModel.create([Phase.PassPhong], "Directional Light Model", gl, directionalLightModel);
        directionalLightModelEntity.rotation.x = Math.PI / 2;
        directionalLightModelEntity.scale = Data.xyz(0.5);
        directionalLightNodeEntity.addChild(directionalLightModelEntity);

        let directionaLight = Light.makeDirectional(Data.rgb(0.5, 1, 0.5), 1, true);
        let directionalLightEntity = await EntityLight.create([Phase.PassPhong, Phase.PassShadowMap, Phase.Resize], "Directional Light", gl, directionaLight, coordsOrientation);
        directionalLightNodeEntity.addChild(directionalLightEntity);

        // Point light
        let pointLightNodeEntity = await EntityNode.create("Point Light Node");
        pointLightNodeEntity.translation.x = 5;
        pointLightNodeEntity.translation.y = 5;
        pointLightNodeEntity.translation.z = 5;
        this.rootEntity.addChild(pointLightNodeEntity);

        let pointLightMaterial = new Material(Data.rgb(0.5, 0.5, 1), 0, 0, 0, true, null, null, null);
        let pointLightModel = await ModelProcedural.create(ModelProceduralKind.Cube, pointLightMaterial);
        let pointLightModelEntity = await EntityModel.create([Phase.PassPhong], "Point light model", gl, pointLightModel);
        pointLightModelEntity.scale = Data.xyz(0.5);
        pointLightNodeEntity.addChild(pointLightModelEntity);

        let pointLight = Light.makePoint(Data.rgb(0.5, 0.5, 1), 1, 0.07, 0.017);
        let pointLightEntity = await EntityLight.create([Phase.PassPhong], "Point light", gl, pointLight, coordsOrientation);
        pointLightNodeEntity.addChild(pointLightEntity);

        // Spot light
        let spotLightNodeEntity = await EntityNode.create("Spot Light Node");
        spotLightNodeEntity.translation.x = -10;
        spotLightNodeEntity.translation.y = 10;
        spotLightNodeEntity.translation.z = 10;
        spotLightNodeEntity.rotation.x = Math.PI/4;
        spotLightNodeEntity.rotation.y = Math.PI/4;
        this.rootEntity.addChild(spotLightNodeEntity);

        let spotLightMaterial = new Material(Data.rgb(1, 0.5, 0.5), 0, 0, 0, true, null, null, null);
        let spotLightModel = await ModelProcedural.create(ModelProceduralKind.Pyramid, spotLightMaterial);
        let spotLightModelEntity = await EntityModel.create([Phase.PassPhong], "Spot Light Model", gl, spotLightModel);
        spotLightModelEntity.rotation.x = Math.PI / 2;
        spotLightModelEntity.scale = Data.xyz(0.5);
        spotLightNodeEntity.addChild(spotLightModelEntity);

        let spotLight = Light.makeSpot(Data.rgb(1, 0.5, 0.5), 1, 0.9, 0.8, true);
        let spotLightEntity = await EntityLight.create([Phase.PassPhong, Phase.PassShadowMap, Phase.Resize], "Spot Light", gl, spotLight, coordsOrientation);
        spotLightNodeEntity.addChild(spotLightEntity);

        // Cube
        let cubeTexture = await Texture2D.create(gl, "box.jpg");
        let cubeSpecularTexture = await Texture2D.create(gl, "box_roughness.png");
        let cubeEnvironmentTexture = await TextureCube.create(
            gl,
            "skybox_left.png",
            "skybox_right.png",
            "skybox_front.png",
            "skybox_back.png",
            "skybox_bottom.png",
            "skybox_top.png"
        );
        let cubeMaterial = new Material(Data.rgb(1, 1, 1), 0.1, 1, 8, false, cubeTexture, cubeSpecularTexture, cubeEnvironmentTexture);
        let cubeModel = await ModelProcedural.create(ModelProceduralKind.Cube, cubeMaterial);
        let cubeEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap, Phase.PassId], "Cube", gl, cubeModel);
        cubeEntity.translation.z = -5;
        cubeEntity.translation.y = 1;
        this.rootEntity.addChild(cubeEntity);

        // Bear
        let bearTexture = await Texture2D.create(gl, "bear.png");
        let bearMaterial = new Material(Data.rgb(1, 1, 1), 0.1, 1, 8, false, bearTexture, bearTexture, cubeEnvironmentTexture);
        let bearModel = await ModelObj.create("bear.obj", bearMaterial);
        let bearEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap, Phase.PassId], "Bear", gl, bearModel);
        bearEntity.translation.z = -4;
        bearEntity.translation.x = 4;
        bearEntity.scale.x = bearEntity.scale.y = bearEntity.scale.z = 0.2;
        this.rootEntity.addChild(bearEntity);

        // Sphere
        let sphereTexture = await Texture2D.create(gl, "box.jpg");
        let sphereMaterial = new Material(Data.rgb(1, 0.5, 0.5), 0.1, 0.5, 2, false, sphereTexture, null, null);
        let sphereModel = await ModelProcedural.create(ModelProceduralKind.Sphere, sphereMaterial);
        let sphereEntity = await EntityModel.create([Phase.PassPhong, Phase.PassDebugNormals, Phase.PassShadowMap, Phase.PassId], "Sphere", gl, sphereModel);
        sphereEntity.translation.x += 3;
        sphereEntity.translation.y += 2;
        sphereEntity.translation.z += 1;
        this.rootEntity.addChild(sphereEntity);

        // Ground
        let groundTexture = await Texture2D.create(gl, "grass.jpg");
        let groundMaterial = new Material(Data.rgb(0.5, 0.5, 0.5), 0.1, 1, 0, false, groundTexture, null, null);
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