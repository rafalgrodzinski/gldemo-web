import { RenderPass } from "renderer/render_pass";
import { ShaderProgram } from "components/shader_program";
import { Phase } from "renderer/renderer";
import { Entity } from "components/entities/entity";
import { Matrix } from "../data/matrix";
import { EntityLight } from "../components/entities/entity_light";
import { Data } from "../data/data_types";

export class RenderPassShadow extends RenderPass {
    private shaderProgram!: ShaderProgram;

    static async create(gl: WebGL2RenderingContext) {
        return await new RenderPassShadow().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassShadow]);
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/shadow/vertex.glsl", "src/shaders/shadow/fragment.glsl");

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.useProgram(this.shaderProgram.program);

        let lightEntities = entities.map((entity) => {
            return (entity instanceof EntityLight && entity.light.shouldCastShadow) ? entity : null
        }).filter((entity) => {
            return entity != null;
        });

        lightEntities.forEach((lightEntity) => {
            lightEntity.prepareForDraw(gl, this.shaderProgram);
            gl.bindFramebuffer(gl.FRAMEBUFFER, lightEntity.depthMapFramebuffer);
            gl.clear(gl.DEPTH_BUFFER_BIT);
            entities.forEach((entity) => {
                entity.draw(gl, this.shaderProgram);
            });
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}