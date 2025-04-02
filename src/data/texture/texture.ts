export abstract class Texture {
    texture!: WebGLTexture;

    protected async init(args: Array<any>): Promise<this> {
        let [texture] = args as [WebGLTexture];
        this.texture = texture;
        return this;
    }
}