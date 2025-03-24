import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Entity } from "components/entities/entity";
import { Vertex } from "utils/vertex";
import { Phase } from "renderer/renderer";
import { EntityKind } from "components/entities/entity";
import { Model } from "data/model";

export class EntityModel extends Entity {
    private model!: Model;
    private vertexArray!: WebGLVertexArrayObject;
    private texture: WebGLTexture | null = null;

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

        if (model.material.diffuseTexture) {
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.material.diffuseTexture);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);

        return this;
    }

    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let modelMatrixId = gl.getUniformLocation(shaderProgram.program, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixId, false, this.modelMatrixGlobal.m);

        let materialColorId = gl.getUniformLocation(shaderProgram.program, "u_material.color");
        gl.uniform3fv(materialColorId, this.model.material.color.m);

        let materialAmbientIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.ambientIntensity");
        gl.uniform1f(materialAmbientIntensityId, this.model.material.ambientIntensity);

        let materialDiffuseIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.diffuseIntensity");
        gl.uniform1f(materialDiffuseIntensityId, this.model.material.diffuseIntensity);

        let materialSpecularIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.specularIntensity");
        gl.uniform1f(materialSpecularIntensityId, this.model.material.specularIntensity);

        let materialIsUnshadedId = gl.getUniformLocation(shaderProgram.program, "u_material.isUnshaded");
        gl.uniform1i(materialIsUnshadedId, this.model.material.isUnshaded ? 1 : 0);

        let materialHasDiffuseTextureId = gl.getUniformLocation(shaderProgram.program, "u_material.hasDiffuseTexture");
        gl.uniform1i(materialHasDiffuseTextureId, this.model.material.diffuseTexture ? 1 : 0);

        if (this.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            let samplerId = gl.getUniformLocation(shaderProgram.program, "u_diffuseSampler");
            gl.uniform1i(samplerId, 0);
        }

        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesCount);
    }
}