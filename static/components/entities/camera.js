import { Entity } from "/components/entities/entity.js";
import { Matrix } from "/utils/Matrix.js";

export class EntityCamera extends Entity {
    //#projectionMatrix = Matrix.makeIdentity();
    //#viewMatrix = Matrix.makeIdentity();

    constructor(name, gl, shaderProgram) {
        let instance = super(name)
        .then((that) => {
            //console.log(this);
            //console.log(that);
            that.projectionMatrix = Matrix.makeIdentity();
            return this;
        })
        return instance;
    }

    get viewMatrix() {
        let viewMatrix = Matrix.makeRotationX(this.rotation.x);
        viewMatrix = viewMatrix.multiply(Matrix.makeRotationY(this.rotation.y));
        viewMatrix = viewMatrix.multiply(Matrix.makeTranslation(-this.translation.x, -this.translation.y, -this.translation.z));
        return viewMatrix;
    }

    resize(width, height) {
        this.projectionMatrix = Matrix.makePerspective(Math.PI / 2, width/height, 0.1, 100);
    }

    prepareForDraw(gl, shaderProgram) {
        let projectionMatrixId = gl.getUniformLocation(shaderProgram.programId, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixId, false, this.projectionMatrix.m);

        let viewMatrixId = gl.getUniformLocation(shaderProgram.programId, "u_viewMatrix");
        gl.uniformMatrix4fv(viewMatrixId, false, this.viewMatrix.m)
    }
}