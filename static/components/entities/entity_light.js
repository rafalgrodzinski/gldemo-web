import { Entity } from "/components/entities/entity.js";

export class EntityLight extends Entity {
    static DIRECTIONAL = 1;
    static POINT = 2;
    static SPOT = 3;
    static #MAX_LIGHTS = 8;
    static #lightsCount = 0;
    #index;
    #kind;
    config = {
        color: null,
        intensity: null
     };

    static async create(phases, name, kind, config) {
        return await new EntityLight()._init(phases, name, kind, config);
    }

    async _init(phases, name, kind, config) {
        await super._init(phases, name, Entity.LIGHT);

        if (EntityLight.#lightsCount >= EntityLight.#MAX_LIGHTS) {
            alert("Exceeded max lights: ", EntityLight.#MAX_LIGHTS);
            throw new Error();
        }

        this.#index = EntityLight.#lightsCount;
        EntityLight.#lightsCount++;

        this.#kind = kind;
        this.config.color = config.color ?? {r: 0, g: 0, b: 0};
        this.config.intensity = config.intensity ?? 0;

        return this;
    }

    prepareForDraw(gl, shaderProgram) {
        let idPrefix = `u_lights[${this.#index}].`;

        let kindId = gl.getUniformLocation(shaderProgram.program, idPrefix + "kind");
        gl.uniform1i(kindId, this.#kind);

        switch (this.#kind) {
            case EntityLight.DIRECTIONAL:
                let colorId = gl.getUniformLocation(shaderProgram.program, idPrefix + "color");
                gl.uniform3f(colorId, this.config.color.r, this.config.color.g, this.config.color.b);
                
                let directionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "direction");
                gl.uniform3f(directionId, this.directionGlobal.x, this.directionGlobal.y, this.directionGlobal.z);

                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.config.intensity);
                break;
        }
    }
}