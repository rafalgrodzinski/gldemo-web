import { Entity, EntityKind } from "components/entities/entity";

export class EntityNode extends Entity {
    static async create(name: string): Promise<EntityNode> {
        return await new EntityNode().init([name]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [name] = args as [string];
        await super.init([null, name, EntityKind.Node]);
        return this;
    }
}