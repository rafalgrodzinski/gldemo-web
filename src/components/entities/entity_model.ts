import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Entity } from "components/entities/entity";
import { Vertex } from "data/vertex";
import { Phase } from "renderer/renderer";
import { EntityKind } from "components/entities/entity";
import { Model } from "data/model/model";

export class EntityModel extends Entity {
    model!: Model;
    private vertexArray!: WebGLVertexArrayObject;

    static async create(phases: Array<Phase>, name: string, gl: WebGL2RenderingContext, model: Model): Promise<EntityModel> {
        return await new EntityModel().init([phases, name, gl, model]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, gl, model] = args as [Array<Phase>, string, WebGL2RenderingContext, Model];
        await super.init([phases, name, EntityKind.Model]);
        this.model = model;

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, model.verticesData, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.POSITION_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.Normal);
        gl.vertexAttribPointer(ShaderAttribute.Normal, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.NORMAL_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.TexCoords);
        gl.vertexAttribPointer(ShaderAttribute.TexCoords, 2, gl.FLOAT, false, Vertex.STRIDE, Vertex.TEX_COORDS_OFFSET);

        gl.bindVertexArray(null);

        return this;
    }

    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        shaderProgram.setMatrix(gl, "u_modelMatrix", this.modelMatrixGlobal.m);
        shaderProgram.setVector(gl, "u_material.color", this.model.material.color.m);
        shaderProgram.setFloat(gl, "u_material.ambientIntensity", this.model.material.ambientIntensity);
        shaderProgram.setFloat(gl, "u_material.diffuseIntensity", this.model.material.diffuseIntensity);
        shaderProgram.setFloat(gl, "u_material.specularIntensity", this.model.material.specularIntensity);
        shaderProgram.setBool(gl, "u_material.isUnshaded", this.model.material.isUnshaded);
        shaderProgram.setBool(gl, "u_material.hasDiffuseTexture", this.model.material.diffuseTexture != null);
        shaderProgram.setBool(gl, "u_material.hasRoughnessTexture", this.model.material.roughnessTexture != null);
        shaderProgram.setBool(gl, "u_material.hasEnvironmentTexture", this.model.material.environmentTexture != null);

        if (this.model.material.diffuseTexture != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.model.material.diffuseTexture.texture);
            shaderProgram.setInt(gl, "u_diffuseSampler", 0);
        }

        if (this.model.material.roughnessTexture != null) {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.model.material.roughnessTexture.texture);
            shaderProgram.setInt(gl, "u_roughnessSampler", 2);
        }

        if (this.model.material.environmentTexture != null) {
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.model.material.environmentTexture.texture);
            shaderProgram.setInt(gl, "u_environmentSampler", 3);
        }

        shaderProgram.setBool(gl, "u_isAnimated", false);

        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesCount);
    }
}