import { Model } from "/model.js";
import { Matrix } from "/matrix.js";

export class Renderer {
    constructor() { }

    static async create(gl) {
        let instance = new Renderer();

        instance.projectionMatrix = Matrix.makePerspective(Math.PI / 2, 1, 0.1, 100);

        let vertexSource = await instance.fileContent("shader.vsh");
        let vertexShader = instance.createShader(gl, gl.VERTEX_SHADER, vertexSource);

        let fragmentSource = await instance.fileContent("shader.fsh");
        let fragmentShader = instance.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        instance.program = instance.createProgram(gl, vertexShader, fragmentShader);
        let awaitingModels = [await Model.create(gl, instance.program, "pyramid")]
        instance.models = await Promise.all(awaitingModels);

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

    resize(gl, width, height) {
        this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, width/height, 0.1, 100);
        gl.viewport(0, 0, width, height);
        this.draw(gl);
    }

    update(elapsedMiliseconds) {
        //console.log(elapsedMiliseconds);
    }

    draw(gl) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.program);

        let projectionMatrixUniformId = gl.getUniformLocation(this.program, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixUniformId, false, this.projectionMatrix.m);

        let modelMatrix = Matrix.makeTranslate(1.3, -2.3, -4);

        for (let i=0; i<this.models.length; i++) {
            this.models[i].draw(gl, this.program, modelMatrix);
        }
    }
}
