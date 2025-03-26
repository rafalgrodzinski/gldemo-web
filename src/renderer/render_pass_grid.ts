import { RenderPass } from "renderer/render_pass";
import { Phase } from "renderer/renderer";
import { ShaderProgram, ShaderAttribute } from "components/shader_program";
import { Util } from "utils/util";
import { Entity } from "components/entities/entity";

export class RenderPassGrid extends RenderPass {
    // Grid
    private static gridVertices: Array<number> = [
        -1, 0, -1,
        -1, 0, 1,
        1, 0, -1,
        1, 0, 1
    ];
    private static gridIndices: Array<number> = [
        0, 1, 2,
        1, 3, 2
    ];
    private gridShaderProgram!: ShaderProgram;
    private gridVertexArray!: WebGLVertexArrayObject;
    private gridTexture!: WebGLTexture;

    // Axis
    private static axisVertices: Array<number> = [
        0, 0, 0,
        1, 0, 0,
        0, 0, 0,
        0, 1, 0,
        0, 0, 0,
        0, 0, 1
    ];
    private axisShaderProgram!: ShaderProgram;
    private axisVertexArray!: WebGLVertexArrayObject;

    static async create(gl: WebGL2RenderingContext) {
        return await new RenderPassGrid().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassGrid]);

        // Grid
        this.gridShaderProgram = await ShaderProgram.create(gl, "src/shaders/grid/grid_vertex.glsl", "src/shaders/grid/grid_fragment.glsl");

        this.gridVertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.gridVertexArray);

        let gridVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gridVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassGrid.gridVertices), gl.STATIC_DRAW);

        let gridIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gridIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(RenderPassGrid.gridIndices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        this.gridTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.gridTexture);
        let image = await Util.image("grid.png");
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        let glExt = gl.getExtension("EXT_texture_filter_anisotropic");
        if (glExt) {
            let maxAnisotropy = gl.getParameter(glExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
            gl.texParameteri(gl.TEXTURE_2D, glExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAnisotropy);
        }

        // Axis
        this.axisShaderProgram = await ShaderProgram.create(gl, "src/shaders/grid/axis_vertex.glsl", "src/shaders/grid/axis_fragment.glsl");

        this.axisVertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.axisVertexArray);

        let axisVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassGrid.axisVertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Grid
        gl.useProgram(this.gridShaderProgram.program);
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.gridShaderProgram);
        });

        gl.bindVertexArray(this.gridVertexArray);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.gridTexture);
        let samplerId = gl.getUniformLocation(this.gridShaderProgram.program, "u_sampler");
        gl.uniform1i(samplerId, 0);

        gl.drawElements(gl.TRIANGLES, RenderPassGrid.gridIndices.length, gl.UNSIGNED_INT, 0);

        // Axis
        gl.useProgram(this.axisShaderProgram.program);
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.axisShaderProgram);
        });

        gl.bindVertexArray(this.axisVertexArray);

        let axisDirectionId = gl.getUniformLocation(this.axisShaderProgram.program, "u_axisDirection");
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