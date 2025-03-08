import { Entity } from "/components/entities/entity.js";

export class EntityModel extends Entity {
    static pyramidVertices = [
        // Front
        -1, -1, 1, 0, 1, 0, 1, -1, 1,
        // Back
        1, -1, -1, 0, 1, 0, -1, -1, -1,
        // Left
        -1, -1, -1, 0, 1, 0, -1, -1, 1,
        // Right
        1, -1, 1, 0, 1, 0, 1, -1, -1,
        // Bottom
        -1, -1, 1, 1, -1, 1, -1, -1, -1,
        -1, -1, -1, 1, -1, 1, 1, -1, -1
    ]

    static async create(name, gl, shaderProgram) {
        return await new EntityModel()._init(name, gl, shaderProgram);
    }

    async _init(name, gl, shaderProgram) {
        await super._init(name);

        this.vertices = EntityModel.pyramidVertices;
        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        let positionAttribId = gl.getAttribLocation(shaderProgram.programId, "a_position");
        gl.enableVertexAttribArray(positionAttribId);
        gl.vertexAttribPointer(positionAttribId, 3, gl.FLOAT, false, 0, 0);

        return this;
    }

    draw(gl, shaderProgram) {
        gl.bindVertexArray(this.vertexArray);
        let modelMatrixUniformId = gl.getUniformLocation(shaderProgram.programId, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniformId, false, this.modelMatrix.m);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}