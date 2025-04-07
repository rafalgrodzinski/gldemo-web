import { CoordsOrientation, Phase } from "renderer/renderer";
import { Entity, EntityKind } from "components/entities/entity";
import { Light, LightKind } from "data/light";
import { ShaderProgram } from "components/shader_program";
import { Matrix } from "data/matrix";
import { Data } from "data/data_types";

export class EntityLight extends Entity {
    private static MAX_LIGHTS: number = 8;
    private static lightsCount: number = 0;
    private static SHADOW_MAP_SIZE = 2048;
    private coordsOrientation!: CoordsOrientation

    light!: Light;
    private depthMapFramebuffer!: WebGLFramebuffer;
    private depthMapTexture!: WebGLTexture;
    private index!: number;
    private projectionMatrix!: Matrix;

    static async create(phases: Array<Phase>, name: string, gl: WebGL2RenderingContext, light: Light, coordsOrientation: CoordsOrientation): Promise<EntityLight> {
        return await new EntityLight().init([phases, name, gl, light, coordsOrientation]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let  [phases, name, gl, light, coordsOrientation] = args as [Array<Phase>, string, WebGL2RenderingContext, Light, CoordsOrientation];
        await super.init([phases, name, EntityKind.Light]);

        if (EntityLight.lightsCount >= EntityLight.MAX_LIGHTS) {
            alert("Exceeded max lights: " + EntityLight.MAX_LIGHTS);
            throw new Error();
        }

        this.index = EntityLight.lightsCount;
        EntityLight.lightsCount++;

        this.light = light;
        this.coordsOrientation = coordsOrientation;
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
        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                this.projectionMatrix = this.projectionMatrix = Matrix.makeOrthographicLeft(1, 100, 100);
                break;
            case CoordsOrientation.RightHanded:
                this.projectionMatrix = this.projectionMatrix = Matrix.makeOrthographicRight(1, 100, 100);
                break;
        }

    }

    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let idPrefix = `u_lights[${this.index}].`;

        shaderProgram.setInt(gl, idPrefix + "kind", this.light.kind);

        switch (this.light.kind) {
            case LightKind.Ambient: {
                shaderProgram.setVector(gl, idPrefix + "color", this.light.color.m);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity)
                break;
            }
            case LightKind.Directional: {
                shaderProgram.setVector(gl, idPrefix + "color", this.light.color.m);
                shaderProgram.setVector(gl, idPrefix + "direction", this.directionGlobal.m);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity)
                shaderProgram.setBool(gl, idPrefix + "shouldCastShadow", this.light.shouldCastShadow);

                /*let lightProjectionMatrixId = gl.getUniformLocation(shaderProgram.program, idPrefix + "projectionMatrix");
                gl.uniformMatrix4fv(lightProjectionMatrixId, false, this.projectionMatrix.m);

                let lightViewMatrixId = gl.getUniformLocation(shaderProgram.program, idPrefix + "viewMatrix");
                gl.uniformMatrix4fv(lightViewMatrixId, false, this.viewMatrix.m);*/

                if (this.light.shouldCastShadow) {
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, this.depthMapTexture);
                    shaderProgram.setInt(gl, "u_shadowMapSampler", 1);
                    shaderProgram.setMatrix(gl, "u_lightProjectionMatrix", this.projectionMatrix.m);
                    shaderProgram.setMatrix(gl, "u_lightViewMatrix", this.viewMatrix.m);
                }
                break;
            }
            case LightKind.Point: {
                shaderProgram.setVector(gl, idPrefix + "color", this.light.color.m);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity);
                shaderProgram.setVector(gl, idPrefix + "position", this.translationGlobal.m);
                shaderProgram.setFloat(gl, idPrefix + "linearAttenuation", this.light.linearAttenuation);
                shaderProgram.setFloat(gl, idPrefix + "quadaraticAttenuation", this.light.quadaraticAttenuation);
                break;
            }
        }
    }

    prepareForShadowMap(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFramebuffer);
        gl.viewport(0, 0, EntityLight.SHADOW_MAP_SIZE, EntityLight.SHADOW_MAP_SIZE);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        shaderProgram.setMatrix(gl, "u_lightProjectionMatrix", this.projectionMatrix.m);
        shaderProgram.setMatrix(gl, "u_lightViewMatrix", this.viewMatrix.m);
    }
}