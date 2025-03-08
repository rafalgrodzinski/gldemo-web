export class ShaderProgram {
    static async create(gl, vertexShaderFileName, fragmentShaderFileName) {
        return await new ShaderProgram().init(gl, vertexShaderFileName, fragmentShaderFileName);
    }

    async init(gl, vertexShaderFileName, fragmentShaderFileName) {
        let vertexSource = await this.fileContent(vertexShaderFileName);
        let vertexShader = this.shader(gl, gl.VERTEX_SHADER, vertexSource);

        let fragmentSource = await this.fileContent(fragmentShaderFileName);
        let fragmentShader = this.shader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        let program = this.program(gl, vertexShader, fragmentShader);
        this.programId = program;

        return this;
    }

    async fileContent(fileName) {
        let content = await fetch(fileName)
            .then(response => response.text())
        return content;
    }

    shader(gl, type, source) {
        let shader = gl.createShader(type);
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

    program(gl, vertexShader, fragmentShader) {
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