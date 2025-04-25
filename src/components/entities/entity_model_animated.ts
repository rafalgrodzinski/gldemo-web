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

    update(elapsedSeconds: number, input: Input) {
        this.currentTime += elapsedSeconds;
    }

    draw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        shaderProgram.setMatrix(gl, "u_modelMatrix", this.modelMatrixGlobal.m);
        shaderProgram.setVector(gl, "u_material.color", this.modelAnimated.material.color.m);
        shaderProgram.setFloat(gl, "u_material.ambientIntensity", this.modelAnimated.material.ambientIntensity);
        shaderProgram.setFloat(gl, "u_material.diffuseIntensity", this.modelAnimated.material.diffuseIntensity);
        shaderProgram.setFloat(gl, "u_material.specularIntensity", this.modelAnimated.material.specularIntensity);
        shaderProgram.setBool(gl, "u_material.isUnshaded", this.modelAnimated.material.isUnshaded);
        shaderProgram.setBool(gl, "u_material.hasDiffuseTexture", this.modelAnimated.material.diffuseTexture != null);
        shaderProgram.setBool(gl, "u_material.hasRoughnessTexture", this.modelAnimated.material.roughnessTexture != null);

        if (this.modelAnimated.material.diffuseTexture != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.modelAnimated.material.diffuseTexture.texture);
            shaderProgram.setInt(gl, "u_diffuseSampler", 0);
        }

        if (this.modelAnimated.material.roughnessTexture != null) {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.modelAnimated.material.roughnessTexture.texture);
            shaderProgram.setInt(gl, "u_roughnessSampler", 2);
        }

        shaderProgram.setBool(gl, "u_isAnimated", true);

        let currentFrame = 0;
        if (this.currentAnim != null) {
            currentFrame = this.currentAnim.startFrame + Math.floor(this.currentTime / this.currentAnim.frameDuration) % this.currentAnim.framesCount;
            
            let tweenFactor = (this.currentTime % this.currentAnim.frameDuration) / this.currentAnim.frameDuration;
            shaderProgram.setFloat(gl, "u_tweenFactor", tweenFactor);
        }

        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, currentFrame * this.modelAnimated.verticesCount, this.modelAnimated.verticesCount);
    }
}