import { Util } from "../../utils/util";
import { Texture } from "./texture";

export class TextureCube extends Texture {
    static async create(gl: WebGL2RenderingContext, fileNameLeft: string, fileNameRight: string, fileNameFront: string, fileNameBack: string, fileNameBottom: string, fileNameTop: string): Promise<TextureCube> {
        return await new TextureCube().init([gl, fileNameLeft, fileNameRight, fileNameFront, fileNameBack, fileNameBottom, fileNameTop]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, fileNameLeft, fileNameRight, fileNameFront, fileNameBack, fileNameBottom, fileNameTop] = args as [WebGL2RenderingContext, string, string, string, string, string, string];

        let left = await Util.image(fileNameLeft);
        let right = await Util.image(fileNameRight);

        let front = await Util.image(fileNameFront);
        let back = await Util.image(fileNameBack);

        let bottom = await Util.image(fileNameBottom);
        let top = await Util.image(fileNameTop);

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, left);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, right);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, front);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, back);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bottom);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, top);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        await super.init([texture]);
        return this;
    }
}