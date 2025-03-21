import { Entity } from "components/entities/entity.js";
import { Light } from "utils/light.js";

export class EntityLight extends Entity {
    static #MAX_LIGHTS = 8;
    static #lightsCount = 0;
    #index;
    #light;

    static async create(phases, name, light) {
        return await new EntityLight()._init(phases, name, light);
    }

    async _init(phases, name, light) {
        await super._init(phases, name, Entity.LIGHT);

        if (EntityLight.#lightsCount >= EntityLight.#MAX_LIGHTS) {
            alert("Exceeded max lights: ", EntityLight.#MAX_LIGHTS);
            throw new Error();
        }

        this.#index = EntityLight.#lightsCount;
        EntityLight.#lightsCount++;

        this.#light = light;

        return this;
    }

    prepareForDraw(gl, shaderProgram) {
        let idPrefix = `u_lights[${this.#index}].`;

        let kindId = gl.getUniformLocation(shaderProgram.program, idPrefix + "kind");
        gl.uniform1i(kindId, this.#light.kind);

        switch (this.#light.kind) {
            case Light.KIND_AMBIENT: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.#light.color.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.#light.intensity);
                break;
            }
            case Light.KIND_DIRECTIONAL: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.#light.color.m);

                let directionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "direction");
                gl.uniform3fv(directionId, this.directionGlobal.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.#light.intensity);
                break;
            }
            case Light.KIND_POINT: {
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3fv(colorId, this.#light.color.m);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.#light.intensity);

                let positionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "position");
                gl.uniform3fv(positionId, this.translationGlobal.m);

                let linearAttenuationId = gl.getUniformLocation(shaderProgram.program, idPrefix + "linearAttenuation");
                gl.uniform1f(linearAttenuationId, this.#light.linearAttenuation);

                let quadaraticAttenuationId = gl.getUniformLocation(shaderProgram.program, idPrefix + "quadaraticAttenuation");
                gl.uniform1f(quadaraticAttenuationId, this.#light.quadaraticAttenuation);
                break;
            }
        }
    }
}