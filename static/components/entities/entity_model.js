import { ShaderProgram } from "/components/shader_program.js";
import { Entity } from "/components/entities/entity.js";
import { Vertex } from "/utils/vertex.js";

export class EntityModel extends Entity {
    static #pyramidVertices = [
        // Front
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: 0.6396 }),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }),
        // Back
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: -0.6396 }),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }),
        // Left
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: -0.6396, y: 0.4264, z: 0 }),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: -0.6396, y: 0.4264, z: 0 }),
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: -0.6396, y: 0.4264, z: 0 }),
        // Right
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0.6396, y: 0.4264, z: 0 }),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0.6396, y: 0.4264, z: 0 }),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0.6396, y: 0.4264, z: 0 }),
        // Bottom
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }),
    ];

    #vertices;
    #vertexArray;

    static async create(phases, name, gl) {
        return await new EntityModel()._init(phases, name, gl);
    }

    async _init(phases, name, gl) {
        await super._init(phases, name, Entity.MODEL);

        this.#vertices = EntityModel.#pyramidVertices;

        this.#vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.#vertexArray);

        let data =  new Float32Array(6 * this.#vertices.length);
        for (let i=0; i<this.#vertices.length; i++) {
            data[i*6 + 0] = this.#vertices[i].position.x;
            data[i*6 + 1] = this.#vertices[i].position.y;
            data[i*6 + 2] = this.#vertices[i].position.z;
            data[i*6 + 3] = this.#vertices[i].normal.x;
            data[i*6 + 4] = this.#vertices[i].normal.y;
            data[i*6 + 5] = this.#vertices[i].normal.z;
        }

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderProgram.A_POSITION);
        gl.vertexAttribPointer(ShaderProgram.A_POSITION, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.POSITION_OFFSET);

        gl.enableVertexAttribArray(ShaderProgram.A_NORMAL);
        gl.vertexAttribPointer(ShaderProgram.A_NORMAL, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.NORMAL_OFFSET);

        gl.bindVertexArray(null);

        return this;
    }

    draw(gl, shaderProgram) {
        let modelMatrixId = gl.getUniformLocation(shaderProgram.program, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixId, false, this.modelMatrix.m);

        gl.bindVertexArray(this.#vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.#vertices.length);
    }
}