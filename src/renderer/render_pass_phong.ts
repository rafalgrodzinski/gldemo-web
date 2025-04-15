import { RenderPass } from "renderer/render_pass";
import { CoordsOrientation, Phase } from "renderer/renderer";
import { ShaderProgram } from "components/shader_program";
import { Entity } from "components/entities/entity";

export class RenderPassPhong extends RenderPass {
    private shaderProgram!: ShaderProgram;
    private coordsOrientation!: CoordsOrientation;

    static async create(gl: WebGL2RenderingContext, coordsOrientation: CoordsOrientation) {
        return await new RenderPassPhong().init([gl, coordsOrientation]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, coordsOrientation] = args as [WebGL2RenderingContext, CoordsOrientation];
        await super.init([Phase.PassPhong]);

        this.shaderProgram = await ShaderProgram.create(gl, "src/shaders/phong/phong_vertex.glsl", "src/shaders/phong/phong_fragment.glsl");
        this.coordsOrientation = coordsOrientation;
        return this
    }

    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.useProgram(this.shaderProgram.program);

        this.shaderProgram.setBool(gl, "u_hasPositiveDepth", this.coordsOrientation == CoordsOrientation.LeftHanded);

        entities.forEach(entity => {
            entity.prepareForDraw(gl, this.shaderProgram);
        });
        entities.forEach(entity => {
            entity.draw(gl, this.shaderProgram);
        });
    }
}