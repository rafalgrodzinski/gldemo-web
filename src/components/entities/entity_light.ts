import { CoordsOrientation, Phase } from "renderer/renderer";
import { Entity, EntityKind } from "components/entities/entity";
import { Light, LightKind } from "data/light";
import { ShaderProgram } from "components/shader_program";
import { Matrix } from "data/matrix";

export class EntityLight extends Entity {
    private static MAX_LIGHTS: number = 8;
    private static lightsCount: number = 0;
    private static shadowMapsCount: number = 0;
    private static SHADOW_MAP_SIZE = 2048;
    private coordsOrientation!: CoordsOrientation

    light!: Light;
    private depthMapFramebuffer!: WebGLFramebuffer;
    private depthMapTexture!: WebGLTexture;
    private indexLight!: number;
    private indexShadowMap!: number;
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

        this.indexLight = EntityLight.lightsCount;
        EntityLight.lightsCount++;

        this.light = light;
        this.coordsOrientation = coordsOrientation;
        this.projectionMatrix = Matrix.makeIdentity();

        if (light.shouldCastShadow) {
            this.indexShadowMap = EntityLight.shadowMapsCount;
            EntityLight.shadowMapsCount++;

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

    #viewMatrix: Matrix = Matrix.makeIdentity();
    get viewMatrix(): Matrix {
        this.updateMatricesIfNeeded();
        return this.#viewMatrix;
    }

    updateMatrices() {
        super.updateMatrices();

        let viewMatrix = Matrix.makeIdentity();
        viewMatrix = viewMatrix.translate(-this.translationGlobal.x, -this.translationGlobal.y, -this.translationGlobal.z);

        switch (this.coordsOrientation) {
            case CoordsOrientation.LeftHanded:
                viewMatrix = viewMatrix.rotateZYX(0, -this.rotationGlobal.y, -this.rotationGlobal.x);
                break;
            case CoordsOrientation.RightHanded:
                viewMatrix = viewMatrix.rotateZYX(0, -this.rotationGlobal.y, -this.rotationGlobal.x);
                break;
        }

        this.#viewMatrix = viewMatrix;
    }

    resize(width: number, height: number): void {
        switch (this.light.kind) {
            case LightKind.Directional:
                this.projectionMatrix = Matrix.makeOrthographic(1, 100, 100);
                break;
            case LightKind.Spot:
                this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, 1, 100);
                break;
        }
    }

    prepareForDraw(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        let idPrefix = `u_lights[${this.indexLight}].`;

        shaderProgram.setInt(gl, idPrefix + "kind", this.light.kind);

        switch (this.light.kind) {
            case LightKind.Ambient: {
                shaderProgram.setData3(gl, idPrefix + "color", this.light.color);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity)
                break;
            }
            case LightKind.Directional: {
                shaderProgram.setData3(gl, idPrefix + "color", this.light.color);
                shaderProgram.setData3(gl, idPrefix + "direction", this.directionGlobal);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity)
                shaderProgram.setBool(gl, idPrefix + "shouldCastShadow", this.light.shouldCastShadow);

                if (this.light.shouldCastShadow) {
                    gl.activeTexture(gl.TEXTURE8 + this.indexShadowMap);
                    gl.bindTexture(gl.TEXTURE_2D, this.depthMapTexture);
                    shaderProgram.setInt(gl, idPrefix + "shadowMapSampler", 8 + this.indexShadowMap);
                    shaderProgram.setMatrix(gl, `u_lightProjectionMatrix[${this.indexLight}]`, this.projectionMatrix);
                    shaderProgram.setMatrix(gl, `u_lightViewMatrix[${this.indexLight}]`, this.viewMatrix);
                }
                break;
            }
            case LightKind.Point: {
                shaderProgram.setData3(gl, idPrefix + "color", this.light.color);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity);
                shaderProgram.setData3(gl, idPrefix + "position", this.translationGlobal);
                shaderProgram.setFloat(gl, idPrefix + "linearAttenuation", this.light.linearAttenuation);
                shaderProgram.setFloat(gl, idPrefix + "quadaraticAttenuation", this.light.quadaraticAttenuation);
                break;
            }
            case LightKind.Spot: {
                shaderProgram.setData3(gl, idPrefix + "color", this.light.color);
                shaderProgram.setData3(gl, idPrefix + "direction", this.directionGlobal);
                shaderProgram.setFloat(gl, idPrefix + "intensity", this.light.intensity);
                shaderProgram.setData3(gl, idPrefix + "position", this.translationGlobal);
                shaderProgram.setFloat(gl, idPrefix + "innerCutOff", this.light.innerCutOff);
                shaderProgram.setFloat(gl, idPrefix + "outerCutOff", this.light.outerCutOff);
                shaderProgram.setBool(gl, idPrefix + "shouldCastShadow", this.light.shouldCastShadow);

                if (this.light.shouldCastShadow) {
                    gl.activeTexture(gl.TEXTURE8 + this.indexShadowMap);
                    gl.bindTexture(gl.TEXTURE_2D, this.depthMapTexture);
                    shaderProgram.setInt(gl, idPrefix + "shadowMapSampler", 8 + this.indexShadowMap);
                    shaderProgram.setMatrix(gl, `u_lightProjectionMatrix[${this.indexLight}]`, this.projectionMatrix);
                    shaderProgram.setMatrix(gl, `u_lightViewMatrix[${this.indexLight}]`, this.viewMatrix);
                }
                break;
            }
        }
    }

    prepareForShadowMap(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFramebuffer);
        gl.viewport(0, 0, EntityLight.SHADOW_MAP_SIZE, EntityLight.SHADOW_MAP_SIZE);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        shaderProgram.setMatrix(gl, "u_lightProjectionMatrix", this.projectionMatrix);
        shaderProgram.setMatrix(gl, "u_lightViewMatrix", this.viewMatrix);
    }
}