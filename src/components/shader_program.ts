import { Util } from "utils/util"

export enum ShaderAttribute {
    Position = 0,
    PositionNext = 3,
    Normal = 1,
    NormalNext = 4,
    TexCoords = 2
}

export enum TextureIndex {
    Diffuse = 0,
    Roughness = 1,
    Environment = 2,
    ShadowMap0 = 8
}

export class ShaderProgram {
    program!: WebGLProgram;

    static async create(gl: WebGL2RenderingContext, vertexShaderFileName: string, fragmentShaderFileName: string) {
        return await new ShaderProgram().init([gl, vertexShaderFileName, fragmentShaderFileName]);
    }

    async init(args: Array<any>): Promise<this> {
        let [gl, vertexShaderFileName, fragmentShaderFileName] = args as [WebGL2RenderingContext, string, string];

        let vertexShader = await this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderFileName);
        let fragmentShader = await this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderFileName);
        this.program = this.linkProgram(gl, vertexShader, fragmentShader);

        return this;
    }

    private async compileShader(gl: WebGL2RenderingContext, type: GLenum, shaderFileName: string): Promise<WebGLShader> {
        let source = await Util.text(shaderFileName);

        let shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) {
            let message = `Failed to compile shader ${shaderFileName}:\n${gl.getShaderInfoLog(shader)}`;
            gl.deleteShader(shader);
            throw new Error(message);
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
            let message = `Failed to link program:\n${gl.getProgramInfoLog(program)}`;
            gl.deleteProgram(program);
            throw new Error(message);
        }
        return program;
    }

    setBool(gl: WebGL2RenderingContext, uniformLocation: string, value: boolean) {
        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        if (uniformId != null)
            gl.uniform1i(uniformId, value ? 1 : 0);
    }

    setInt(gl: WebGL2RenderingContext, uniformLocation: string, value: number) {
        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        if (uniformId != null)
            gl.uniform1i(uniformId, value);
    }

    setFloat(gl: WebGL2RenderingContext, uniformLocation: string, value: number) {
        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        if (uniformId != null)
            gl.uniform1f(uniformId, value);
    }

    setVector(gl: WebGL2RenderingContext, uniformLocation: string, value: Array<number>) {
        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        if (uniformId != null)
            gl.uniform3fv(uniformId, value);
    }

    setMatrix(gl: WebGL2RenderingContext, uniformLocation: string, value: Array<number>) {
        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        if (uniformId != null)
            gl.uniformMatrix4fv(uniformId, true, value);
    }
}