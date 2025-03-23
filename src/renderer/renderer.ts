import { RenderPass } from "render_pass";
import { RenderPassPhong } from "renderer/render_pass_phong";
import { RenderPassGrid } from "renderer/render_pass_grid";
import { Scene } from "components/scene";
import { Input } from "utils/input";

export enum Phase{
        Resize,
        Update,
        PassPhong,
        PassGrid
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

        this.renderPasses = await Promise.all([
            await RenderPassPhong.create(gl),
            await RenderPassGrid.create(gl)
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
        gl.enable(gl.DEPTH_TEST);

        this.renderPasses.forEach(renderPass => {
            let entities = this.scene.rootEntity.entitiesForPhase(renderPass.phase);
            renderPass.draw(gl, entities);
        });
    }
}
