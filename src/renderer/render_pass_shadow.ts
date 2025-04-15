import { RenderPass } from "renderer/render_pass";
import { ShaderProgram } from "components/shader_program";
import { Phase } from "renderer/renderer";
import { Entity } from "components/entities/entity";
import { EntityLight } from "components/entities/entity_light";

export class RenderPassShadowMap extends RenderPass {
    private shaderProgram!: ShaderProgram;

    static async create(gl: WebGL2RenderingContext) {
        return await new RenderPassShadowMap().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassShadowMap]);
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/shadow_map/vertex.glsl", "src/shaders/shadow_map/fragment.glsl");

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        let viewportSize = gl.getParameter(gl.VIEWPORT) as Array<number>;

        let lightEntities = entities.map((entity) => {
            return (entity instanceof EntityLight && entity.light.shouldCastShadow) ? entity : null
        }).filter((entity) => {
            return entity != null;
        });

        gl.useProgram(this.shaderProgram.program);
        lightEntities.forEach((lightEntity) => {
            lightEntity.prepareForShadowMap(gl, this.shaderProgram);
            entities.forEach((entity) => {
                entity.draw(gl, this.shaderProgram);
            });
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(viewportSize[0], viewportSize[1], viewportSize[2], viewportSize[3]);
    }
}