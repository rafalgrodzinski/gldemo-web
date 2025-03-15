import { ShaderProgram } from "/components/shader_program.js";
import { Entity } from "/components/entities/entity.js";
import { Vertex } from "/utils/vertex.js";
import { Vector3 } from "/utils/vector.js";

export class EntityModel extends Entity {
    static KIND_CUBE = "cube";
    static KIND_PYRAMID = "pyramid";
    static KIND_SPHERE = "sphere";

    static #cubeVertices = [
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }),
        // Back
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }),
        // Left
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: -1, y: 0, z: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: -1, y: 0, z: 0 }),
        // Right
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 1, y: 0, z: 0 }),
        // Top
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }),
        // Bottom
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 })
    ];

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

    static async create(phases, name, gl, kind) {
        return await new EntityModel()._init(phases, name, gl, kind);
    }

    async _init(phases, name, gl, kind) {
        await super._init(phases, name, Entity.MODEL);

        switch (kind) {
            case EntityModel.KIND_CUBE:
                this.#vertices = EntityModel.#cubeVertices;
                break;
            case EntityModel.KIND_PYRAMID:
                this.#vertices = EntityModel.#pyramidVertices;
                break;
            case EntityModel.KIND_SPHERE:
                let segments = 8;
                this.#vertices = [];
                for (let iy=0; iy<segments; iy++) {
                    for (let ix=0; ix<segments; ix++) {
                        let x1 = Math.sin(ix/segments * Math.PI * 2) * Math.sin((iy+1)/segments * Math.PI);
                        let x2 = Math.sin((ix+1)/segments * Math.PI * 2) * Math.sin((iy+1)/segments * Math.PI);
                        let x3 = Math.sin((ix+1)/segments * Math.PI * 2) * Math.sin(iy/segments * Math.PI);
                        let x4 = Math.sin(ix/segments * Math.PI * 2) * Math.sin(iy/segments * Math.PI);

                        let y1 = Math.cos((iy+1)/segments * Math.PI);
                        let y2 = Math.cos((iy+1)/segments * Math.PI);
                        let y3 = Math.cos((iy+0)/segments * Math.PI);
                        let y4 = Math.cos((iy+0)/segments * Math.PI);

                        let z1 = Math.sin((iy+1) / segments * Math.PI) * Math.cos(ix / segments * Math.PI * 2);
                        let z2 = Math.sin((iy+1) / segments * Math.PI) * Math.cos((ix + 1) / segments * Math.PI * 2);
                        let z3 = Math.sin(iy / segments * Math.PI) * Math.cos((ix + 1) / segments * Math.PI * 2);
                        let z4 = Math.sin(iy / segments * Math.PI) * Math.cos(ix / segments * Math.PI * 2);

                        let n1 = new Vector3(x1, y1, z1).normalized();
                        let n2 = new Vector3(x2, y2, z2).normalized();
                        let n3 = new Vector3(x3, y3, z3).normalized();
                        let n4 = new Vector3(x4, y4, z4).normalized();

                        this.#vertices.push(new Vertex({x: x1, y: y1, z: z1}, n1));
                        this.#vertices.push(new Vertex({x: x2, y: y2, z: z2}, n2));
                        this.#vertices.push(new Vertex({x: x3, y: y3, z: z3}, n3));

                        this.#vertices.push(new Vertex({x: x1, y: y1, z: z1}, n1));
                        this.#vertices.push(new Vertex({x: x3, y: y3, z: z3}, n3));
                        this.#vertices.push(new Vertex({x: x4, y: y4, z: z4}, n4));
                    }
                }
                break;
        }

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
        gl.uniformMatrix4fv(modelMatrixId, false, this.modelMatrixGlobal.m);

        gl.bindVertexArray(this.#vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.#vertices.length);
    }
}