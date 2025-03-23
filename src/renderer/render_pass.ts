import { Phase } from "renderer/renderer"
import { EntityNode } from "../components/entities/entity_node";

export abstract class RenderPass {
    phase!: Phase;

    protected async init(args: Array<any>): Promise<this> {
        let [phase] = args as [Phase];
        this.phase = phase;
        return this;
    }

    prepareForDraw(gl: WebGL2RenderingContext, entities: Array<EntityNode>) { }
    draw(gl: WebGL2RenderingContext, entities: Array<EntityNode>) { }
}