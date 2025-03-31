import { RenderPass } from "render_pass";
import { RenderPassPhong } from "renderer/render_pass_phong";
import { RenderPassGrid } from "renderer/render_pass_grid";
import { RenderPassDebugNormals } from "renderer/render_pass_debug_normals";
import { Scene } from "components/scene";
import { Input } from "utils/input";
import { RenderPassShadowMap } from "renderer/render_pass_shadow";
import { RenderPassSkybox, SkyboxTextures } from "renderer/render_pass_skybox";
import { Util } from "utils/util";

export enum Phase{
        Resize,
        Update,
        PassPhong,
        PassGrid,
        PassDebugNormals,
        PassShadowMap,
        PassSkybox
}

export class Renderer {
    scene!: Scene;
    private renderPasses: Array<RenderPass> = [];

     static async create(gl: WebGL2RenderingContext, scene: Scene) {
        return await new Renderer().init([gl, scene]);
     }

     protected async init(args: Array<any>): Promise<this> {
        let [gl, scene] = args as [WebGL2RenderingContext, Scene];
        this.scene = scene;

        let skyboxTextures: SkyboxTextures = {
            left: await Util.image("skybox_left.png"),
            right: await Util.image("skybox_right.png"),
            front: await Util.image("skybox_front.png"),
            back: await Util.image("skybox_back.png"),
            bottom: await Util.image("skybox_bottom.png"),
            top: await Util.image("skybox_top.png")
        };

        this.renderPasses = await Promise.all([
            await RenderPassSkybox.create(gl, skyboxTextures),
            await RenderPassShadowMap.create(gl),
            await RenderPassPhong.create(gl),
            //await RenderPassDebugNormals.create(gl),
            await RenderPassGrid.create(gl),
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
        gl.frontFace(gl.CCW);

        this.renderPasses.forEach(renderPass => {
            let entities = this.scene.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.prepareForDraw(gl, entities);
            renderPass.draw(gl, entities);
        });
    }
}
