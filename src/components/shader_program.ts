import { Util } from "utils/util"

export enum ShaderAttribute {
    Position = 0,
    Normal = 1,
    TexCoords = 2
}

export class ShaderProgram {
    program!: WebGLProgram;

    static async create(gl: WebGL2RenderingContext, vertexShaderFileName: string, fragmentShaderFileName: string) {
        return await new ShaderProgram().init([gl, vertexShaderFileName, fragmentShaderFileName]);
    }

    async init(args: Array<any>): Promise<this> {
        let [gl, vertexShaderFileName, fragmentShaderFileName] = args as [WebGL2RenderingContext, string, string];

        let vertexSource = await Util.text(vertexShaderFileName);
        let vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSource);

        let fragmentSource = await Util.text(fragmentShaderFileName);
        let fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        this.program = this.linkProgram(gl, vertexShader, fragmentShader);

        return this;
    }

    private compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
        let shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw new Error();
        }
        return shader;
    }

    private linkProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!success) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            throw new Error();
        }
        return program;
    }
}