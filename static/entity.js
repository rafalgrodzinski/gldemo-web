import { Matrix } from "/matrix.js";

export class Entity {
    constructor(name) {
        let instance = async () => {
            this.name = name;
            this.translation = {x: 1.3, y: -2.3, z: -4};
            this.rotation = {x: 0, y: 0, z: 0};
            this.scale = {x: 1, y: 1, z: 1};
            return this;
        };
        return instance();
    }

    get modelMatrix() {
        let modelMatrix = Matrix.makeTranslate(this.translation.x, this.translation.y, this.translation.z);
        return modelMatrix;
    }
}

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

    constructor(name, gl, program) {
        let instance = super(name)
            .then((that) => {
                that.vertices = EntityModel.pyramidVertices;
                that.vertexArray = gl.createVertexArray();
                gl.bindVertexArray(that.vertexArray);

                let buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertices), gl.STATIC_DRAW);

                let positionAttribId = gl.getAttribLocation(program, "a_position");
                gl.enableVertexAttribArray(positionAttribId);
                gl.vertexAttribPointer(positionAttribId, 3, gl.FLOAT, false, 0, 0);

                return this;
            });
        return instance;
    }

    draw(gl, programId) {
        gl.bindVertexArray(this.vertexArray);
        let modelMatrixUniformId = gl.getUniformLocation(programId, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniformId, false, this.modelMatrix.m);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}