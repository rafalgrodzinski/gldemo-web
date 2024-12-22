export class Renderer {
    constructor(gl) { }

    static async create(gl) {
        let instance = new Renderer();

        let vertexSource = await instance.fileContent("shader.vsh");
        let vertexShader = instance.createShader(gl, gl.VERTEX_SHADER, vertexSource);

        let fragmentSource = await instance.fileContent("shader.fsh");
        let fragmentShader = instance.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        instance.program = instance.createProgram(gl, vertexShader, fragmentShader);

        return instance;
    }

    async fileContent(fileName) {
        let content = await fetch(fileName)
            .then(response => response.text())
        return content;
    }

    createShader(gl, type, source) {
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

    createProgram(gl, vertexShader, fragmentShader) {
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

    draw(gl) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);

        let positionAttribLocation = gl.getAttribLocation(this.program, "position");
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let positions = [0, 0, 0, 0.5, 0.7, 0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        let colorAttribLocation = gl.getAttribLocation(this.program, "color");
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        let colors = [Math.random(), Math.random(), Math.random(), 1, Math.random(), Math.random(), Math.random(), 1, Math.random(), Math.random(), Math.random(), 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
