import { RenderPass } from "renderer/render_pass.js";
import { Renderer } from "renderer/renderer.js";
import { ShaderProgram } from "components/shader_program.js";
import { Entity } from "components/entities/entity";

export class RenderPassPhong extends RenderPass {
    private shaderProgram!: ShaderProgram;

    static async create(gl: WebGL2RenderingContext) {
        return await new RenderPassPhong().init([gl]);
    }

    protected async init(args: Array<any>): Promise<RenderPassPhong> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Renderer.PHASE_PASS_PHONG]);

        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/phong/phong_vertex.glsl", "src/shaders/phong/phong_fragment.glsl");
        return this
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.useProgram(this.shaderProgram.program);

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });
        entities.forEach(entity => {
            entity.draw(gl, this.shaderProgram);
        });
    }
}