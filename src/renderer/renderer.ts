import { RenderPass } from "render_pass";
import { RenderPassPhong } from "renderer/render_pass_phong";
import { RenderPassGrid } from "renderer/render_pass_grid";
import { RenderPassDebugNormals } from "renderer/render_pass_debug_normals";
import { Scene } from "components/scene";
import { Input } from "utils/input";
import { RenderPassShadowMap } from "./render_pass_shadow_map";
import { RenderPassSkybox } from "renderer/render_pass_skybox";
import { TextureCube } from "../data/texture/texture_cube";
import { RenderPassAxis } from "./render_pass_axis";

export enum CoordsOrientation {
    LeftHanded,
    RightHanded,
}

export enum Phase{
        Resize,
        Update,
        PassPhong,
        PassGrid,
        PassAxis,
        PassDebugNormals,
        PassShadowMap,
        PassSkybox
}

export class Renderer {
    scene!: Scene;
    private renderPasses: Array<RenderPass> = [];
    private coordsOrientation!: CoordsOrientation;

     static async create(gl: WebGL2RenderingContext, scene: Scene, coordsOrientation: CoordsOrientation) {
        return await new Renderer().init([gl, scene, coordsOrientation]);
     }

     protected async init(args: Array<any>): Promise<this> {
        let [gl, scene, coordsOrientation] = args as [WebGL2RenderingContext, Scene, CoordsOrientation];
        this.scene = scene;
        this.coordsOrientation = coordsOrientation;

        let skyboxTexture = await TextureCube.create(
            gl,
            "skybox_left.png",
            "skybox_right.png",
            "skybox_front.png",
            "skybox_back.png",
            "skybox_bottom.png",
            "skybox_top.png"
        );

        this.renderPasses = await Promise.all([
            await RenderPassSkybox.create(gl, skyboxTexture),
            await RenderPassShadowMap.create(gl),
            await RenderPassPhong.create(gl, coordsOrientation),
            //await RenderPassDebugNormals.create(gl),
            await RenderPassGrid.create(gl),
            await RenderPassAxis.create(gl)
        ]);

        return this;
     }

    resize(gl: WebGL2RenderingContext, width: number, height: number) {
        let entities = this.scene.rootEntity.entitiesForPhase(Phase.Resize);
        entities.forEach(entity => {
            entity.resize(width, height);
        });

        gl.viewport(0, 0, width, height);
        this.draw(gl);
    }

    update(elapsedMiliseconds: number, input: Input) {
        let entities = this.scene.rootEntity.entitiesForPhase(Phase.Update);
        entities.forEach(entity => {
            entity.update(elapsedMiliseconds, input);
        });
        input.resetState();
    }

    draw(gl: WebGL2RenderingContext) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                gl.clearDepth(0);
                gl.depthFunc(gl.GEQUAL);
                gl.frontFace(gl.CW);
                break;
            case CoordsOrientation.RightHanded:
                gl.clearDepth(1);
                gl.depthFunc(gl.LEQUAL);
                gl.frontFace(gl.CCW);
                break;
        }

        this.renderPasses.forEach(renderPass => {
            let entities = this.scene.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.prepareForDraw(gl, entities);
            renderPass.draw(gl, entities);
        });
    }
}
