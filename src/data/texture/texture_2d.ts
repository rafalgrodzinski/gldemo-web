import { Util } from "../../utils/util";
import { Data2 } from "../data_types";
import { Texture } from "./texture";

export class Texture2D extends Texture {
    static async create(gl: WebGL2RenderingContext, source: string | Uint8Array, size: Data2 | null = null): Promise<Texture2D> {
        return await new Texture2D().init([gl, source, size]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, source, size] = args as [WebGL2RenderingContext, string | Uint8Array, Data2 | null];

        let texture: WebGLTexture;
        if (typeof source == "string")
            texture = await this.initFromFileName(gl, source);
        else if (size != null)
            texture = await this.initFromRgbData(gl, source, size);
        else
            throw new Error("Invalid texture data");

        await super.init([texture]);

        return this;
    }

    private async initFromFileName(gl: WebGL2RenderingContext, fileName: string): Promise<WebGLTexture> {
        let image = await Util.image(fileName);

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    private async initFromRgbData(gl: WebGL2RenderingContext, rgbData: Uint8Array, size: Data2): Promise<WebGLTexture> {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, size.x, size.y, 0, gl.RGB, gl.UNSIGNED_BYTE, rgbData);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
}