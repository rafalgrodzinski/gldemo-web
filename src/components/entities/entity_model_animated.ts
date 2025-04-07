import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Entity } from "components/entities/entity";
import { Phase } from "renderer/renderer";
import { EntityKind } from "components/entities/entity";
import { Input } from "../../utils/input";
import { Anim } from "../../data/model/anim";
import { ModelAnimated } from "../../data/model/model_animated";
import { VertexAnimated } from "../../data/vertex_animated";

export class EntityModelAnimated extends Entity {
    modelAnimated!: ModelAnimated;
    private vertexArray!: WebGLVertexArrayObject;
    private currentTime = 0;
    private currentAnim: Anim | null = null;

    static async create(phases: Array<Phase>, name: string, gl: WebGL2RenderingContext, modelAnimated: ModelAnimated): Promise<EntityModelAnimated> {
        return await new EntityModelAnimated().init([phases, name, gl, modelAnimated]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [phases, name, gl, modelAnimated] = args as [Array<Phase>, string, WebGL2RenderingContext, ModelAnimated];
        await super.init([phases, name, EntityKind.Model]);
        this.modelAnimated = modelAnimated;

        this.modelAnimated.anims.forEach((anim) => {
            anim.setCurrentAnim = (currentAnim) => {
                this.currentTime = 0;
                this.currentAnim = currentAnim;
            };
        });

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelAnimated.framesData, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, VertexAnimated.STRIDE, VertexAnimated.POSITION_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.PositionNext);
        gl.vertexAttribPointer(ShaderAttribute.PositionNext, 3, gl.FLOAT, false, VertexAnimated.STRIDE, VertexAnimated.POSITION_NEXT_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.Normal);
        gl.vertexAttribPointer(ShaderAttribute.Normal, 3, gl.FLOAT, false, VertexAnimated.STRIDE, VertexAnimated.NORMAL_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.NormalNext);
        gl.vertexAttribPointer(ShaderAttribute.NormalNext, 3, gl.FLOAT, false, VertexAnimated.STRIDE, VertexAnimated.NORMAL_NEXT_OFFSET);

        gl.enableVertexAttribArray(ShaderAttribute.TexCoords);
        gl.vertexAttribPointer(ShaderAttribute.TexCoords, 2, gl.FLOAT, false, VertexAnimated.STRIDE, VertexAnimated.TEX_COORDS_OFFSET);

        gl.bindVertexArray(null);

        return this;
    }

    update(elapsedMiliseconds: number, input: Input) {
        this.currentTime += elapsedMiliseconds / 1000;
    }

    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let modelMatrixId = gl.getUniformLocation(shaderProgram.program, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixId, false, this.modelMatrixGlobal.m);

        let materialColorId = gl.getUniformLocation(shaderProgram.program, "u_material.color");
        gl.uniform3fv(materialColorId, this.modelAnimated.material.color.m);

        let materialAmbientIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.ambientIntensity");
        gl.uniform1f(materialAmbientIntensityId, this.modelAnimated.material.ambientIntensity);

        let materialDiffuseIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.diffuseIntensity");
        gl.uniform1f(materialDiffuseIntensityId, this.modelAnimated.material.diffuseIntensity);

        let materialSpecularIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.specularIntensity");
        gl.uniform1f(materialSpecularIntensityId, this.modelAnimated.material.specularIntensity);

        let materialIsUnshadedId = gl.getUniformLocation(shaderProgram.program, "u_material.isUnshaded");
        gl.uniform1i(materialIsUnshadedId, this.modelAnimated.material.isUnshaded ? 1 : 0);

        let materialHasDiffuseTextureId = gl.getUniformLocation(shaderProgram.program, "u_material.hasDiffuseTexture");
        gl.uniform1i(materialHasDiffuseTextureId, this.modelAnimated.material.diffuseTexture ? 1 : 0);

        if (this.modelAnimated.material.diffuseTexture != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.modelAnimated.material.diffuseTexture.texture);
            let samplerId = gl.getUniformLocation(shaderProgram.program, "u_diffuseSampler");
            gl.uniform1i(samplerId, 0);
        }

        let currentFrame = 0;
        if (this.currentAnim != null) {
            currentFrame = this.currentAnim.startFrame + Math.floor(this.currentTime / this.currentAnim.frameDuration) % this.currentAnim.framesCount;
            
            let tweenFactor = (this.currentTime % this.currentAnim.frameDuration) / this.currentAnim.frameDuration;
            let tweenFactorId = gl.getUniformLocation(shaderProgram.program, "u_tweenFactor");
            gl.uniform1f(tweenFactorId, tweenFactor);
        }

        let isAnimatedId = gl.getUniformLocation(shaderProgram.program, "u_isAnimated");
        gl.uniform1i(isAnimatedId, 1);

        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, currentFrame * this.modelAnimated.verticesCount, this.modelAnimated.verticesCount);
    }
}