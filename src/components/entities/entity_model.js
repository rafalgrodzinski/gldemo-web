import { ShaderProgram } from "components/shader_program.js";
import { Entity } from "components/entities/entity.js";
import { Vertex } from "utils/vertex.js";
import { Vector } from "utils/vector.js";
import { Util } from "utils/util.js";

export class EntityModel extends Entity {
    static KIND_CUBE = "cube";
    static KIND_PYRAMID = "pyramid";
    static KIND_SPHERE = "sphere";

    static #cubeVertices = [
        // Front
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 0, t: 0}),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 1, t: 0}),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }, {s: 1, t: 1}),
        // Back
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 1, t: 1}),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 0, t: 0}),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 1, t: 1}),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: 0, z: -1 }, {s: 1, t: 0}),
        // Left
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: -1, y: 0, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }, {s: 1, t: 1}),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: -1, y: 0, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: -1, y: 0, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: -1, y: 0, z: 0 }, {s: 1, t: 1}),
        // Right
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }, {s: 1, t: 1}),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 1, y: 0, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 1, y: 0, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 1, y: 0, z: 0 }, {s: 1, t: 1}),
        // Top
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, {s: 1, t: 1}),
        new Vertex({ x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, {s: 1, t: 1}),
        // Bottom
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 1}),
        new Vertex({ x: -1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: -1, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 1})
    ];

    static #pyramidVertices = [
        // Front
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 0.5, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: 0.4264, z: 0.6396 }, {s: 1, t: 0}),
        // Back
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 0.5, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: 0.4264, z: -0.6396 }, {s: 1, t: 0}),
        // Left
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 0.5, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: -0.6396, y: 0.4264, z: 0 }, {s: 1, t: 0}),
        // Right
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 0, y: 0.75, z: 0 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 0.5, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0.6396, y: 0.4264, z: 0 }, {s: 1, t: 0}),
        // Bottom
        new Vertex({ x: -1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 0}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: -1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 0, t: 1}),
        new Vertex({ x: 1, y: -0.75, z: 1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 0}),
        new Vertex({ x: 1, y: -0.75, z: -1 }, { x: 0, y: -1, z: 0 }, {s: 1, t: 1}),
    ];

    #vertices;
    #vertexArray;
    #material;
    #texture;

    static async create(phases, name, gl, kind, material) {
        return await new EntityModel()._init(phases, name, gl, kind, material);
    }

    async _init(phases, name, gl, kind, material) {
        await super._init(phases, name, Entity.MODEL);

        this.#material = material;

        switch (kind) {
            case EntityModel.KIND_CUBE:
                this.#vertices = EntityModel.#cubeVertices;
                break;
            case EntityModel.KIND_PYRAMID:
                this.#vertices = EntityModel.#pyramidVertices;
                break;
            case EntityModel.KIND_SPHERE:
                let segments = 32;
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

                        let n1 = new Vector(x1, y1, z1).normalized();
                        let n2 = new Vector(x2, y2, z2).normalized();
                        let n3 = new Vector(x3, y3, z3).normalized();
                        let n4 = new Vector(x4, y4, z4).normalized();

                        let s1 = ix/segments;
                        let s2 = (ix+1)/segments;
                        let t1 = (iy+1)/segments;
                        let t2 = iy/segments;

                        this.#vertices.push(new Vertex({x: x1, y: y1, z: z1}, n1, {s: s1, t: t1}));
                        this.#vertices.push(new Vertex({x: x2, y: y2, z: z2}, n2, {s: s2, t: t1}));
                        this.#vertices.push(new Vertex({x: x3, y: y3, z: z3}, n3, {s: s2, t: t2}));

                        this.#vertices.push(new Vertex({x: x1, y: y1, z: z1}, n1, {s: s1, t: t1}));
                        this.#vertices.push(new Vertex({x: x3, y: y3, z: z3}, n3, {s: s2, t: t2}));
                        this.#vertices.push(new Vertex({x: x4, y: y4, z: z4}, n4, {s: s1, t: t2}));
                    }
                }
                break;
        }

        this.#vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.#vertexArray);

        let data =  new Float32Array(8 * this.#vertices.length);
        for (let i=0; i<this.#vertices.length; i++) {
            data[i*8 + 0] = this.#vertices[i].position.x;
            data[i*8 + 1] = this.#vertices[i].position.y;
            data[i*8 + 2] = this.#vertices[i].position.z;
            data[i*8 + 3] = this.#vertices[i].normal.x;
            data[i*8 + 4] = this.#vertices[i].normal.y;
            data[i*8 + 5] = this.#vertices[i].normal.z;
            data[i*8 + 6] = this.#vertices[i].texCoords.s;
            data[i*8 + 7] = this.#vertices[i].texCoords.t;
        }

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderProgram.A_POSITION);
        gl.vertexAttribPointer(ShaderProgram.A_POSITION, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.POSITION_OFFSET);

        gl.enableVertexAttribArray(ShaderProgram.A_NORMAL);
        gl.vertexAttribPointer(ShaderProgram.A_NORMAL, 3, gl.FLOAT, false, Vertex.STRIDE, Vertex.NORMAL_OFFSET);

        gl.enableVertexAttribArray(ShaderProgram.A_TEX_COORDS);
        gl.vertexAttribPointer(ShaderProgram.A_TEX_COORDS, 2, gl.FLOAT, false, Vertex.STRIDE, Vertex.TEX_COORDS_OFFSET);

        if (material.hasDiffuseTexture) {
            this.#texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.#texture);
            let image = await Util.texture("box.jpg");
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);

        return this;
    }

    draw(gl, shaderProgram) {
        let modelMatrixId = gl.getUniformLocation(shaderProgram.program, "u_modelMatrix");
        gl.uniformMatrix4fv(modelMatrixId, false, this.modelMatrixGlobal.m);

        let materialColorId = gl.getUniformLocation(shaderProgram.program, "u_material.color");
        gl.uniform3fv(materialColorId, this.#material.color.m);

        let materialAmbientIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.ambientIntensity");
        gl.uniform1f(materialAmbientIntensityId, this.#material.ambientIntensity);

        let materialDiffuseIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.diffuseIntensity");
        gl.uniform1f(materialDiffuseIntensityId, this.#material.diffuseIntensity);

        let materialSpecularIntensityId = gl.getUniformLocation(shaderProgram.program, "u_material.specularIntensity");
        gl.uniform1f(materialSpecularIntensityId, this.#material.specularIntensity);

        let materialIsUnshadedId = gl.getUniformLocation(shaderProgram.program, "u_material.isUnshaded");
        gl.uniform1i(materialIsUnshadedId, this.#material.isUnshaded);

        let materialHasDiffuseTextureId = gl.getUniformLocation(shaderProgram.program, "u_material.hasDiffuseTexture");
        gl.uniform1i(materialHasDiffuseTextureId, this.#material.hasDiffuseTexture);

        if (this.#material.hasDiffuseTexture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.#texture);
            let samplerId = gl.getUniformLocation(shaderProgram.program, "u_diffuseSampler");
            gl.uniform1i(samplerId, 0);
        }

        gl.bindVertexArray(this.#vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.#vertices.length);
    }
}