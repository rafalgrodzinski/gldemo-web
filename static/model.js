export class Model {
    static pyramidVertices = [
        // Front
        -1, -1, 1, 0, 1, 0, 1, -1, 1,
        // Back
        1, -1, -1, 0, 1, -1, -1, -1, 0,
        // Left
        -1, -1, -1, 0, 1, 0, -1, -1, 1,
        // Right
        1, -1, 1, 0, 1, 0, 1, -1, -1,
        // Bottom
        -1, -1, 1, 1, -1, 1, -1, -1, -1,
        -1, -1, -1, 1, -1, 1, 1, -1, -1
    ]

    constructor() { }

    static async create(gl, program, kind) {
        let instance = new Model()

        switch (kind) {
            case "pyramid":
                instance.vertices = Model.pyramidVertices
                break;
        }

        instance.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(instance.vertexArray);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instance.vertices), gl.STATIC_DRAW);
        let positionAttribId = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttribId);
        gl.vertexAttribPointer(positionAttribId, 3, gl.FLOAT, false, 0, 0);

        return instance;
    }

    draw(gl, programId, modelMatrix) {
        gl.bindVertexArray(this.vertexArray);
        //let modelMatrixUniformId = gl.getUniformLocation(programId, "u_modelMatrix");
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}