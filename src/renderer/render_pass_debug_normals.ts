import { RenderPass } from "renderer/render_pass";
import { Entity } from "components/entities/entity";
import { ShaderAttribute, ShaderProgram } from "components/shader_program";
import { Phase } from "renderer/renderer";
import { EntityModel } from "components/entities/entity_model";
import { Vertex } from "data/vertex";
import { Model } from "data/model/model";

export class RenderPassDebugNormals extends RenderPass {
    private debugNormalsProgram!: ShaderProgram;
    private debugNormalsVertexArray!: WebGLVertexArrayObject;
    private debugNormalsBuffer!: WebGLBuffer;

    static async create(gl: WebGL2RenderingContext): Promise<RenderPassDebugNormals> {
        return await new RenderPassDebugNormals().init([gl]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl] = args as [WebGL2RenderingContext];
        await super.init([Phase.PassDebugNormals]);

        this.debugNormalsProgram = await ShaderProgram.create(gl, "src/shaders/debug_normals/debug_normals_vertex.glsl", "src/shaders/debug_normals/debug_normals_fragment.glsl");
        this.debugNormalsVertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.debugNormalsVertexArray);

        this.debugNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.debugNormalsBuffer);

        gl.enableVertexAttribArray(ShaderAttribute.Position);
        gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*3, 0);

        gl.bindVertexArray(null);

        return this;
    }

    private normalPositionsData(model: Model, normalLength: number): Float32Array {
        let normalsCount = model.verticesCount/3;

        let normalPositionsData = new Float32Array(normalsCount * 3 * 2);

        for (let normalIndex=0; normalIndex<normalsCount; normalIndex++) {
            let vertexIndex0 = normalIndex*3;
            let vertexIndex1 = normalIndex*3 + 1;
            let vertexIndex2 = normalIndex*3 + 2;

            let x = 0;
            x += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 0];
            x += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 0];
            x += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 0];
            x /= 3;

            let y = 0;
            y += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 1];
            y += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 1];
            y += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 1];
            y /= 3;

            let z = 0;
            z += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 2];
            z += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 2];
            z += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 2];
            z /= 3;

            let nx = 0;
            nx += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 3 + 0];
            nx += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 3 + 0];
            nx += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 3 + 0];
            nx /= 3;
            nx *= normalLength;

            let ny = 0;
            ny += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 3 + 1];
            ny += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 3 + 1];
            ny += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 3 + 1];
            ny /= 3;
            ny *= normalLength;

            let nz = 0;
            nz += model.verticesData[vertexIndex0 * Vertex.STRIDE_LENGTH + 3 + 2];
            nz += model.verticesData[vertexIndex1 * Vertex.STRIDE_LENGTH + 3 + 2];
            nz += model.verticesData[vertexIndex2 * Vertex.STRIDE_LENGTH + 3 + 2];
            nz /= 3;
            nz *= normalLength;

            normalPositionsData.set([x, y, z, x + nx, y + ny, z + nz], normalIndex * 6);
        }

        return normalPositionsData;
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.useProgram(this.debugNormalsProgram.program);
        
        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.debugNormalsProgram);
        });
        
        gl.bindVertexArray(this.debugNormalsVertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.debugNormalsBuffer);

        entities.forEach(entity => {
            if (entity instanceof EntityModel) {
                let model = (entity as EntityModel).model;
                let normalsCount = model.verticesCount/3;
                gl.bufferData(gl.ARRAY_BUFFER, this.normalPositionsData(model, 0.5), gl.STATIC_DRAW);

                let modelMatrixId = gl.getUniformLocation(this.debugNormalsProgram.program, "u_modelMatrix");
                gl.uniformMatrix4fv(modelMatrixId, false, entity.modelMatrixGlobal.m);

                gl.drawArrays(gl.LINES, 0, normalsCount * 2);
            }
        });
    }
}