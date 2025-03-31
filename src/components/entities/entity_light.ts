import { Phase } from "renderer/renderer";
import { Entity, EntityKind } from "components/entities/entity";
import { Light, LightKind } from "data/light";
import { ShaderProgram } from "components/shader_program";
import { Matrix } from "data/matrix";
import { Data } from "data/data_types";

export class EntityLight extends Entity {
    private static MAX_LIGHTS: number = 8;
    private static lightsCount: number = 0;
    private static SHADOW_MAP_SIZE = 2048;

    light!: Light;
    private depthMapFramebuffer!: WebGLFramebuffer;
    private depthMapTexture!: WebGLTexture;
    private index!: number;
    private projectionMatrix!: Matrix;

    static async create(phases: Array<Phase>, name: string, gl: WebGL2RenderingContext, light: Light): Promise<EntityLight> {
        return await new EntityLight().init([phases, name, gl, light]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let  [phases, name, gl, light] = args as [Array<Phase>, string, WebGL2RenderingContext, Light];
        await super.init([phases, name, EntityKind.Light]);

        if (EntityLight.lightsCount >= EntityLight.MAX_LIGHTS) {
            alert("Exceeded max lights: " + EntityLight.MAX_LIGHTS);
            throw new Error();
        }

        this.index = EntityLight.lightsCount;
        EntityLight.lightsCount++;

        this.light = light;
        this.projectionMatrix = Matrix.makeIdentity();

        if (light.shouldCastShadow) {
            this.depthMapTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.depthMapTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, EntityLight.SHADOW_MAP_SIZE, EntityLight.SHADOW_MAP_SIZE, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            this.depthMapFramebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFramebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthMapTexture, 0);
            gl.drawBuffers([gl.NONE]);
            gl.readBuffer(gl.NONE)
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
                throw new Error("Failed to create depth map framebuffer");

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        return this;
    }

    get viewMatrix(): Matrix {
        return Matrix.makeLookAt(Data.vector(this.translationGlobal), Data.vector(this.directionGlobal));
    }

    resize(width: number, height: number): void {
        this.projectionMatrix = Matrix.makeOrthographic(1, 100, 100);
    }

    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let idPrefix = `u_lights[${this.index}].`;

        let kindId = gl.getUniformLocation(shaderProgram.program, idPrefix + "kind");
        gl.uniform1i(kindId, this.light.kind);

        switch (this.light.kind) {
            case LightKind.Ambient: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.light.color.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.light.intensity);
                break;
            }
            case LightKind.Directional: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.light.color.m);

                let directionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "direction");
                gl.uniform3fv(directionId, this.directionGlobal.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.light.intensity);

                let shouldCastShadowId = gl.getUniformLocation(shaderProgram.program, idPrefix + "shouldCastShadow");
                gl.uniform1i(shouldCastShadowId, this.light.shouldCastShadow ? 1 : 0);

                /*let lightProjectionMatrixId = gl.getUniformLocation(shaderProgram.program, idPrefix + "projectionMatrix");
                gl.uniformMatrix4fv(lightProjectionMatrixId, false, this.projectionMatrix.m);

                let lightViewMatrixId = gl.getUniformLocation(shaderProgram.program, idPrefix + "viewMatrix");
                gl.uniformMatrix4fv(lightViewMatrixId, false, this.viewMatrix.m);*/

                if (this.light.shouldCastShadow) {
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, this.depthMapTexture);
                    let shadowMapSamplerId = gl.getUniformLocation(shaderProgram.program, "u_shadowMapSampler");
                    gl.uniform1i(shadowMapSamplerId, 1);

                    let lightProjectionMatrixId = gl.getUniformLocation(shaderProgram.program, "u_lightProjectionMatrix");
                    gl.uniformMatrix4fv(lightProjectionMatrixId, false, this.projectionMatrix.m);
            
                    let lightViewMatrixId = gl.getUniformLocation(shaderProgram.program, "u_lightViewMatrix");
                    gl.uniformMatrix4fv(lightViewMatrixId, false, this.viewMatrix.m);
                }

                break;
            }
            case LightKind.Point: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.light.color.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.light.intensity);

                let positionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "position");
                gl.uniform3fv(positionId, this.translationGlobal.m);

                let linearAttenuationId = gl.getUniformLocation(shaderProgram.program, idPrefix + "linearAttenuation");
                gl.uniform1f(linearAttenuationId, this.light.linearAttenuation);

                let quadaraticAttenuationId = gl.getUniformLocation(shaderProgram.program, idPrefix + "quadaraticAttenuation");
                gl.uniform1f(quadaraticAttenuationId, this.light.quadaraticAttenuation);
                break;
            }
        }
    }

    prepareForShadowMap(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFramebuffer);
        gl.viewport(0, 0, EntityLight.SHADOW_MAP_SIZE, EntityLight.SHADOW_MAP_SIZE);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);

        let lightProjectionMatrixId = gl.getUniformLocation(shaderProgram.program, "u_lightProjectionMatrix");
        gl.uniformMatrix4fv(lightProjectionMatrixId, false, this.projectionMatrix.m);

        let lightViewMatrixId = gl.getUniformLocation(shaderProgram.program, "u_lightViewMatrix");
        gl.uniformMatrix4fv(lightViewMatrixId, false, this.viewMatrix.m);
    }
}