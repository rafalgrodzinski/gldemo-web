import { RenderPass } from "renderer/render_pass";
import { Phase } from "renderer/renderer";
import { ShaderProgram } from "components/shader_program";
import { Entity } from "components/entities/entity";

export class RenderPassPhong extends RenderPass {
    private shaderProgram!: ShaderProgram;

    static async create(gl: WebGL2RenderingContext) {
        return await new RenderPassPhong().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassPhong]);

        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/phong/phong_vertex.glsl", "src/shaders/phong/phong_fragment.glsl");
        return this
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.useProgram(this.shaderProgram.program);

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });
        entities.forEach(entity => {
            entity.draw(gl, this.shaderProgram);
        });
    }
}