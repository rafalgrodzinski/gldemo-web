import { Entity } from "../components/entities/entity";
import { ShaderAttribute, ShaderProgram } from "../components/shader_program";
import { RenderPass } from "./render_pass";
import { Phase } from "./renderer";

export class RenderPassAxis extends RenderPass {    
        private static vertices: Array<number> = [
            0, 0, 0,
            1, 0, 0,
            0, 0, 0,
            0, 1, 0,
            0, 0, 0,
            0, 0, 1
        ];
        private shaderProgram!: ShaderProgram;
        private vertexArray!: WebGLVertexArrayObject;
    
        static async create(gl: WebGL2RenderingContext): Promise<RenderPassAxis> {
            return await new RenderPassAxis().init([gl]);
        }
    
        protected async init(args: Array<any>): Promise<this> {
            let [gl] = args as [WebGL2RenderingContext];
            await super.init([Phase.PassAxis]);
    
            // Axis
            this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/axis/axis_vertex.glsl", "src/shaders/axis/axis_fragment.glsl");
    
            this.vertexArray = gl.createVertexArray();
            gl.bindVertexArray(this.vertexArray);
    
            let axisVerticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RenderPassAxis.vertices), gl.STATIC_DRAW);
    
            gl.enableVertexAttribArray(ShaderAttribute.Position);
            gl.vertexAttribPointer(ShaderAttribute.Position, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindVertexArray(null);
    
            return this;
        }
    
        draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {    
            // Axis
            gl.useProgram(this.shaderProgram.program);
            entities.forEach(entity => {
                entity.prepareForDraw(gl, this.shaderProgram);
            });
    
            gl.bindVertexArray(this.vertexArray);
    
            // X
            this.shaderProgram.setInt(gl, "u_axisDirection", 0);
            gl.drawArrays(gl.LINES, 0, 2);
            // Y
            this.shaderProgram.setInt(gl, "u_axisDirection", 1);
            gl.drawArrays(gl.LINES, 2, 2);
            // Z
            this.shaderProgram.setInt(gl, "u_axisDirection", 2);
            gl.drawArrays(gl.LINES, 4, 2);

            gl.bindVertexArray(null);
        }
}