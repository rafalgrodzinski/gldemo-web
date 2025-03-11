import { Entity } from "/components/entities/entity.js";
import { Vector3 } from "/utils/vector.js";
import { Matrix } from "/utils/matrix.js";

export class EntityLight extends Entity {
    static DIRECTIONAL = 1 << 0;
    static POINT = 1 << 1;
    static SPOT = 1 << 2;
    static #MAX_LIGHTS = 8;
    static #lightsCount = 0;
    #index;
    #kind;
    config = {
        direction: null,
        intensity: null
     };

    static async create(name, kind, config) {
        return await new EntityLight()._init(name, kind, config);
    }

    async _init(name, kind, config) {
        await super._init(name);

        if (EntityLight.#lightsCount >= EntityLight.#MAX_LIGHTS) {
            alert("Exceeded max lights: ", EntityLight.#MAX_LIGHTS);
            throw new Error();
        }

        this.#index = EntityLight.#lightsCount;
        EntityLight.#lightsCount++;

        this.#kind = kind;
        Object.defineProperty(this.config, "direction", { 
            get: () => {
                let direction = new Vector3(0, -1, 0);
                direction = Matrix.makeRotationX(this.rotation.x).multiplyVector3(direction);
                direction = Matrix.makeRotationY(this.rotation.y).multiplyVector3(direction);
                direction = Matrix.makeRotationZ(this.rotation.z).multiplyVector3(direction);
                return direction;
            }
        });
        this.config.intensity = config.intensity ?? 0;

        return this;
    }

    prepareForDraw(gl, shaderProgram) {
        let idPrefix = `u_lights[${this.#index}].`;

        let kindId = gl.getUniformLocation(shaderProgram.program, idPrefix + "kind");
        gl.uniform1i(kindId, this.#kind);

        switch (this.#kind) {
            case EntityLight.DIRECTIONAL:
                let directionId = gl.getUniformLocation(shaderProgram.program, idPrefix + "direction");
                gl.uniform3f(directionId, this.config.direction.x, this.config.direction.y, this.config.direction.z);
                let intensityId = gl.getUniformLocation(shaderProgram.program, idPrefix + "intensity");
                gl.uniform1f(intensityId, this.config.intensity);
                break;
        }
    }
}