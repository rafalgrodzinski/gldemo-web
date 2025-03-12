import { Entity } from "/components/entities/entity.js";
import { EntityModel } from "/components/entities/entity_model.js";
import { EntityCamera } from "/components/entities/entity_camera.js";
import { EntityLight } from "/components/entities/entity_light.js"
import { ShaderProgram } from "/components/shader_program.js";
import { RenderPassGrid } from "./render_pass_grid.js";

export class Renderer {
    #gl = null;
    #shaderProgram = null;
    #camera = null;
    #light1 = null;
    #light2 = null;
    #renderPassGrid = null;

     static async create(gl) {
        return await new Renderer()._init(gl);
     }

     async _init(gl) {
        this.#gl = gl;

        this.#shaderProgram = await ShaderProgram.create(gl, "shaders/phong/phong_vertex.glsl", "shaders/phong/phong_fragment.glsl");

        let awaitingEntities = [
            await EntityModel.create("Pyramid #1", gl, this.#shaderProgram),
            await EntityModel.create("Pyramid #2", gl, this.#shaderProgram)
        ];
        this.entities = await Promise.all(awaitingEntities);

        this.#camera = await EntityCamera.create("Camera #1");
        this.#camera.translation.z = 4;
        this.entities.push(this.#camera);

        this.#light1 = await EntityLight.create("Light #1", EntityLight.DIRECTIONAL, {color: {r: 1, g: 0, b: 0}, intensity: 1});
        this.#light2 = await EntityLight.create("Light #2", EntityLight.DIRECTIONAL, {color: {r: 0, g: 1, b: 0}, intensity: 1})
        this.entities.push(this.#light1);
        this.entities.push(this.#light2);

        this.#renderPassGrid = await RenderPassGrid.create(gl);

        return this;
     }

    resize(width, height) {
        let gl = this.#gl;

        this.#camera.resize(width, height);
        gl.viewport(0, 0, width, height);
        this.draw();
    }

    update(elapsedMiliseconds, input) {
        this.#camera.update(elapsedMiliseconds, input);
        input.resetState();
    }

    draw() {
        let gl = this.#gl;

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.#shaderProgram.program);
        this.#camera.prepareForDraw(gl, this.#shaderProgram);
        this.#light1.prepareForDraw(gl, this.#shaderProgram);
        this.#light2.prepareForDraw(gl, this.#shaderProgram);

        for (let i=0; i<this.entities.length; i++)
            this.entities[i].draw(gl, this.#shaderProgram);

        this.#renderPassGrid.draw(gl, this.#camera);
    }
}
