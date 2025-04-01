import { Util } from "../../utils/util";
import { Data, Data3 } from "../data_types";
import { Model } from "./model";

export class ModelMdl extends Model {
    private static ident = 1330660425; // 'I' << 0 + 'D' << 8 + 'P' << 16 + 'O' << 24
    private static version = 6

    static async create(fileName: string): Promise<ModelMdl> {
        return await new ModelMdl().init([fileName]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [fileName] = args as [string];

        let dataView = new DataView(await Util.arrayBuffer(fileName));

        let headerIdent = dataView.getInt32(0, true);
        let headerVersion = dataView.getInt32(4, true);
        let scale = Data.xyz(0, 0, 0);
        scale.x = dataView.getFloat32(8, true);
        scale.y = dataView.getFloat32(12, true);
        scale.z = dataView.getFloat32(16, true);

        return this;
    }
}