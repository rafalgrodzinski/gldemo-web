import { Phase } from "renderer/renderer";
import { Entity, EntityKind } from "components/entities/entity";
import { Light, LightKind } from "../../data/light";
import { ShaderProgram } from "components/shader_program";

export class EntityLight extends Entity {
    private static MAX_LIGHTS: number = 8;
    private static lightsCount: number = 0;

    private index!: number;
    private light!: Light;

    static async create(phases: Array<Phase>, name: string, light: Light): Promise<EntityLight> {
        return await new EntityLight().init([phases, name, light]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let  [phases, name, light] = args as [Array<Phase>, string, Light];
        await super.init([phases, name, EntityKind.Light]);

        if (EntityLight.lightsCount >= EntityLight.MAX_LIGHTS) {
            alert("Exceeded max lights: " + EntityLight.MAX_LIGHTS);
            throw new Error();
        }

        this.index = EntityLight.lightsCount;
        EntityLight.lightsCount++;

        this.light = light;

        return this;
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
}