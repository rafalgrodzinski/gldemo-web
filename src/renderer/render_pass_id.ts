import { Entity } from "../components/entities/entity";
import { ShaderProgram } from "../components/shader_program";
import { Input } from "../utils/input";
import { RenderPass } from "./render_pass";
import { Phase } from "./renderer";

export class RenderPassId extends RenderPass {
    private shaderProgram!: ShaderProgram;
    private idFramebuffer!: WebGLFramebuffer;
    private idTexture!: WebGLTexture;
    private static TEXTURE_SIZE = 1024

    static async create(gl: WebGL2RenderingContext): Promise<RenderPassId> {
        return await new RenderPassId().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassId]);
        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/id/id_vertex.glsl", "src/shaders/id/id_fragment.glsl");

        this.idTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.idTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, RenderPassId.TEXTURE_SIZE, RenderPassId.TEXTURE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.idFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.idFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.idTexture, 0);

        let depthRenderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
            throw new Error("Failed to create id framebuffer");

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.shaderProgram.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.idFramebuffer);
        gl.viewport(0, 0, RenderPassId.TEXTURE_SIZE, RenderPassId.TEXTURE_SIZE);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });
        entities.forEach(entity => {
            this.shaderProgram.setInt(gl, "u_id", entity.id);
            entity.draw(gl, this.shaderProgram);
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    idForInput(gl: WebGL2RenderingContext, input: Input): number {
        let pixelX = Math.floor(input.pointer.x * RenderPassId.TEXTURE_SIZE);
        let pixelY = Math.floor(RenderPassId.TEXTURE_SIZE - input.pointer.y * RenderPassId.TEXTURE_SIZE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.idFramebuffer);
        let colorData = new Uint8Array(4);
        gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, colorData);
        let id = colorData[0] + (colorData[1] << 8) + (colorData[2] << 16);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return id;
     }
}