import { Matrix } from "/matrix.js";
import { Entity, EntityModel } from "/entity.js";

export class Renderer {
    constructor(gl) {
        let instance = async () => {
            this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, 1, 0.1, 100);

            let vertexSource = await this.fileContent("shader.vsh");
            let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
    
            let fragmentSource = await this.fileContent("shader.fsh");
            let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    
            this.program = this.createProgram(gl, vertexShader, fragmentShader);
    
            let awaitingEntities = [await new EntityModel("pyramid", gl, this.program)];
            this.entities = await Promise.all(awaitingEntities);

            return this;
        };
        return instance();
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

        for (let i=0; i<this.entities.length; i++)
            this.entities[i].draw(gl, this.program);
    }
}
