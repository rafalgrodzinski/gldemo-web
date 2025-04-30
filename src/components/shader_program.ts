import { Util } from "utils/util"
import { Data3 } from "../data/data_types";
import { Matrix } from "../data/matrix";

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
    private uniformLocationIds: Map<String, WebGLUniformLocation | null> = new Map();

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

    private uniformId(gl: WebGL2RenderingContext, uniformLocation: string): WebGLUniformLocation | null {
        if (uniformLocation in this.uniformLocationIds)
            return this.uniformLocationIds[uniformLocation];

        let uniformId = gl.getUniformLocation(this.program, uniformLocation);
        this.uniformLocationIds[uniformLocation] = uniformId;
        return uniformId;
    }

    setBool(gl: WebGL2RenderingContext, uniformLocation: string, value: boolean) {
        let uniformId = this.uniformId(gl, uniformLocation);
        if (uniformId != null)
            gl.uniform1i(uniformId, value ? 1 : 0);
    }

    setInt(gl: WebGL2RenderingContext, uniformLocation: string, value: number) {
        let uniformId = this.uniformId(gl, uniformLocation);
        if (uniformId != null)
            gl.uniform1i(uniformId, value);
    }

    setFloat(gl: WebGL2RenderingContext, uniformLocation: string, value: number) {
        let uniformId = this.uniformId(gl, uniformLocation);
        if (uniformId != null)
            gl.uniform1f(uniformId, value);
    }

    setData3(gl: WebGL2RenderingContext, uniformLocation: string, value: Data3) {
        let uniformId = this.uniformId(gl, uniformLocation);
        if (uniformId != null)
            gl.uniform3fv(uniformId, value.m);
    }

    setMatrix(gl: WebGL2RenderingContext, uniformLocation: string, value: Matrix) {
        let uniformId = this.uniformId(gl, uniformLocation);
        if (uniformId != null)
            gl.uniformMatrix4fv(uniformId, true, value.m);
    }
}