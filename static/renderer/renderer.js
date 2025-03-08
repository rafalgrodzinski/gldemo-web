import { Entity, EntityModel } from "/components/entities/entity.js";
import { EntityCamera } from "/components/entities/camera.js";
import { ShaderProgram } from "/components/shader_program.js";

export class Renderer {
    #gl = null;
    #shaderProgram = null;
    #camera = null;

     static async create(gl) {
        return await new Renderer().init(gl);
     }

     async init(gl) {
        this.#gl = gl;

        this.#shaderProgram = await ShaderProgram.create(gl, "shaders/shader.vsh", "shaders/shader.fsh");
        this.#camera = await EntityCamera.create("Camera #1");
        this.#camera.translation.z = 4;

        let awaitingEntities = [
            await EntityModel.create("Pyramid #1", gl, this.#shaderProgram),
            await EntityModel.create("Pyramid #2", gl, this.#shaderProgram)
        ];
        this.entities = await Promise.all(awaitingEntities);
        this.entities.push(this.#camera);

        return this;
     }

    resize(width, height) {
        let gl = this.#gl;

        this.#camera.resize(width, height);
        gl.viewport(0, 0, width, height);
        this.draw();
    }

    update(elapsedMiliseconds) {
        //console.log(elapsedMiliseconds);
    }

    draw() {
        let gl = this.#gl;

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.#shaderProgram.programId);
        this.#camera.prepareForDraw(gl, this.#shaderProgram);

        for (let i=0; i<this.entities.length; i++)
            this.entities[i].draw(gl, this.#shaderProgram);
    }
}
