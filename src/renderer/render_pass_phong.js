import { RenderPass } from "renderer/render_pass.js";
import { Renderer } from "renderer/renderer.js";
import { ShaderProgram } from "components/shader_program.js";

export class RenderPassPhong extends RenderPass {
    #shaderProgram = null;

    static async create(gl) {
        return await new RenderPassPhong()._init(gl);
    }

    async _init(gl) {
        await super._init(Renderer.PHASE_PASS_PHONG);

        this.#shaderProgram = await ShaderProgram.create(gl, "src/shaders/phong/phong_vertex.glsl", "src/shaders/phong/phong_fragment.glsl");
        return this;
    }

    draw(gl, entities) {
        gl.useProgram(this.#shaderProgram.program);

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.#shaderProgram);
        });
        entities.forEach(entity => {
            entity.draw(gl, this.#shaderProgram);
        });
    }
}