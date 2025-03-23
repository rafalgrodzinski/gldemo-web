import { Entity } from "components/entities/entity";

export abstract class RenderPass {
    phase!: string;

    protected async init(args: Array<any>): Promise<RenderPass> {
        let [phase] = args as [string];
        this.phase = phase;
        return this;
    }

    prepareForDraw(gl: WebGL2RenderingContext, entities: Array<Entity>) { }
    draw(gl: WebGL2RenderingContext, entities: Array<Entity>) { }
}