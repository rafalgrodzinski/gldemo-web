import { Phase } from "renderer/renderer"
import { Entity } from "../components/entities/entity";

export abstract class RenderPass {
    phase!: Phase;

    protected async init(args: Array<any>): Promise<this> {
        let [phase] = args as [Phase];
        this.phase = phase;
        return this;
    }

    prepareForDraw(gl: WebGL2RenderingContext, entities: Array<Entity>) { }
    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) { }
}