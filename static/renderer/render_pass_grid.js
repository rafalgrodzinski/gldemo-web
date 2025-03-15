import { RenderPass } from "/renderer/render_pass.js";
import { Renderer } from "/renderer/renderer.js";
import { ShaderProgram } from "/components/shader_program.js";
import { Util } from "/utils/util.js";

export class RenderPassGrid extends RenderPass {
    // Grid
    static #gridVertices = [
        -1, 0, 1,
        -1, 0, -1,
        1, 0, -1,
        1, 0, 1
    ];
    static #gridIndices = [
        0, 1, 2,
        0, 2, 3
    ];
    #gridShaderProgram;
    #gridVertexArray;
    #gridTexture;

    // Axis
    static #axisVertices = [
        0, 0, 0,
        1, 0, 0,
        0, 0, 0,
        0, 1, 0,
        0, 0, 0,
        0, 0, 1
    ];
    #axisShaderProgram;
    #axisVertexArray;

    static async create(gl) {
        return await new RenderPassGrid()._init(gl);
    }

    async _init(gl) {
        await super._init(Renderer.PHASE_PASS_GRID);

        // Grid
        this.#gridShaderProgram = await ShaderProgram.create(gl, "shaders/grid/grid_vertex.glsl", "shaders/grid/grid_fragment.glsl");

        this.#gridVertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.#gridVertexArray);

        let gridVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gridVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassGrid.#gridVertices), gl.STATIC_DRAW);

        let gridIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gridIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(RenderPassGrid.#gridIndices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderProgram.A_POSITION);
        gl.vertexAttribPointer(ShaderProgram.A_POSITION, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        this.#gridTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.#gridTexture);
        let image = await Util.texture("grid.png");
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        let glExt = gl.getExtension("EXT_texture_filter_anisotropic");
        let maxAnisotropy = gl.getParameter(glExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        gl.texParameteri(gl.TEXTURE_2D, glExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAnisotropy);

        // Axis
        this.#axisShaderProgram = await ShaderProgram.create(gl, "shaders/grid/axis_vertex.glsl", "shaders/grid/axis_fragment.glsl");

        this.#axisVertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.#axisVertexArray);

        let axisVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassGrid.#axisVertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderProgram.A_POSITION);
        gl.vertexAttribPointer(ShaderProgram.A_POSITION, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);

        return this;
    }

    draw(gl, entities) {
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.LINE_SMOOTH);

        // Grid
        gl.useProgram(this.#gridShaderProgram.program);
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.#gridShaderProgram);
        });

        gl.bindVertexArray(this.#gridVertexArray);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#gridTexture);
        let samplerId = gl.getUniformLocation(this.#gridShaderProgram.program, "u_sampler");
        gl.uniform1i(samplerId, 0);

        gl.drawElements(gl.TRIANGLES, RenderPassGrid.#gridIndices.length, gl.UNSIGNED_INT, null);

        // Axis
        gl.useProgram(this.#axisShaderProgram.program);
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.#axisShaderProgram);
        });

        gl.bindVertexArray(this.#axisVertexArray);

        let axisDirectionId = gl.getUniformLocation(this.#axisShaderProgram.program, "u_axisDirection");
        // X
        gl.uniform1i(axisDirectionId, 0);
        gl.drawArrays(gl.LINES, 0, 2);
        // Y
        gl.uniform1i(axisDirectionId, 1);
        gl.drawArrays(gl.LINES, 2, 2);
        // Z
        gl.uniform1i(axisDirectionId, 2);
        gl.drawArrays(gl.LINES, 4, 2);
    }
}