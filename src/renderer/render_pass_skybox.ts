import { Entity } from "components/entities/entity";
import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Data } from "data/data_types";
import { Material } from "data/material";
import { Model } from "data/model/model";
import { ModelProcedural, ModelProceduralKind } from "data/model/model_procedural";
import { Vertex } from "data/vertex";
import { RenderPass } from "renderer/render_pass";
import { Phase } from "renderer/renderer";
import { Texture } from "../data/texture/texture";

export class RenderPassSkybox extends RenderPass {
    private shaderProgram!: ShaderProgram;
    private vertexArray!: WebGLVertexArrayObject;
    private texture!: Texture;
    private model!: Model;

    static async create(gl: WebGL2RenderingContext, texture: Texture) {
        return await new RenderPassSkybox().init([gl, texture]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, texture] = args as [WebGL2RenderingContext, Texture];
        await super.init([Phase.PassSkybox]);

        this.texture = texture;
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/skybox/skybox_vertex.glsl", "src/shaders/skybox/skybox_fragment.glsl");

        let material = new Material(Data.rgb(0, 0, 0), 0, 0, 0, false, null);
        this.model = await ModelProcedural.create(ModelProceduralKind.Cube, material)

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.model.framesData, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.POSITION_OFFSET);

        gl.bindVertexArray(null);

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        gl.useProgram(this.shaderProgram.program);

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });

        gl.bindVertexArray(this.vertexArray);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture.texture);
        let samplerId = gl.getUniformLocation(this.shaderProgram.program, "u_sampler");
        gl.uniform1i(samplerId, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesCount);
    }
}