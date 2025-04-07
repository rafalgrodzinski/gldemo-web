import { RenderPass } from "renderer/render_pass";
import { Phase } from "renderer/renderer";
import { ShaderProgram, ShaderAttribute } from "components/shader_program";
import { Util } from "utils/util";
import { Entity } from "components/entities/entity";

export class RenderPassGrid extends RenderPass {
    // Grid
    private static vertices: Array<number> = [
        -1, 0, -1,
        -1, 0, 1,
        1, 0, -1,
        1, 0, 1
    ];
    private static indices: Array<number> = [
        0, 1, 2,
        1, 3, 2
    ];
    private shaderProgram!: ShaderProgram;
    private vertexArray!: WebGLVertexArrayObject;
    private texture!: WebGLTexture;

    static async create(gl: WebGL2RenderingContext): Promise<RenderPassGrid> {
        return await new RenderPassGrid().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassGrid]);

        // Grid
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/grid/grid_vertex.glsl", "src/shaders/grid/grid_fragment.glsl");

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        let gridVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gridVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassGrid.vertices), gl.STATIC_DRAW);

        let gridIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gridIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(RenderPassGrid.indices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Grid
        gl.useProgram(this.shaderProgram.program);
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });

        gl.bindVertexArray(this.vertexArray);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        this.shaderProgram.setInt(gl, "u_sampler", 0);

        gl.drawElements(gl.TRIANGLES, RenderPassGrid.indices.length, gl.UNSIGNED_INT, 0);
    }
}