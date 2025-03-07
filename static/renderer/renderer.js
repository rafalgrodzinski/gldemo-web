import { Matrix } from "/utils/matrix.js";
import { Entity, EntityModel } from "/components/entities/entity.js";
import { ShaderProgram } from "/components/shader_program.js";

export class Renderer {
    #gl = null;
    #shaderProgram = null;

    constructor(gl) {
        let instance = async () => {
            this.#gl = gl;

            this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, 1, 0.1, 100);

            this.#shaderProgram = await new ShaderProgram(gl, "shaders/shader.vsh", "shaders/shader.fsh");
    
            let awaitingEntities = [
                await new EntityModel("Pyramid 1", gl, this.#shaderProgram),
                await new EntityModel("Pyramid 2", gl, this.#shaderProgram),
                await new EntityModel("Pyramid 3", gl, this.#shaderProgram),
                await new EntityModel("Pyramid 4", gl, this.#shaderProgram),
                await new EntityModel("Pyramid 5", gl, this.#shaderProgram)
            ];
            this.entities = await Promise.all(awaitingEntities);

            return this;
        };
        return instance();
     }

    resize(width, height) {
        let gl = this.#gl;

        this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, width/height, 0.1, 100);
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

        let projectionMatrixUniformId = gl.getUniformLocation(this.#shaderProgram.programId, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixUniformId, false, this.projectionMatrix.m);

        for (let i=0; i<this.entities.length; i++)
            this.entities[i].draw(gl, this.#shaderProgram);
    }
}
