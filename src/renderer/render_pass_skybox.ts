import { Entity } from "components/entities/entity";
import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Data } from "data/data_types";
import { Material } from "data/material";
import { Model } from "data/model/model";
import { ModelProcedural, ModelProceduralKind } from "data/model/model_procedural";
import { Vertex } from "data/vertex";
import { RenderPass } from "renderer/render_pass";
import { Phase } from "renderer/renderer";

export type SkyboxTextures = {
    left: HTMLImageElement,
    right: HTMLImageElement,
    front: HTMLImageElement,
    back: HTMLImageElement,
    top: HTMLImageElement,
    bottom: HTMLImageElement
};

export class RenderPassSkybox extends RenderPass {
    private shaderProgram!: ShaderProgram;
    private vertexArray!: WebGLVertexArrayObject;
    private texture!: WebGLTexture;
    private model!: Model;

    static async create(gl: WebGL2RenderingContext, textures: SkyboxTextures) {
        return await new RenderPassSkybox().init([gl, textures]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, textures] = args as [WebGL2RenderingContext, SkyboxTextures];
        await super.init([Phase.PassSkybox]);
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/skybox/skybox_vertex.glsl", "src/shaders/skybox/skybox_fragment.glsl");

        let material = new Material(Data.rgb(0, 0, 0), 0, 0, 0, false, null);
        this.model = await ModelProcedural.create(ModelProceduralKind.Cube, material)

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.model.verticesData, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.POSITION_OFFSET);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.left);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.right);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.front);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.back);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.bottom);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.top);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
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
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        let samplerId = gl.getUniformLocation(this.shaderProgram.program, "u_sampler");
        gl.uniform1i(samplerId, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesCount);
    }
}