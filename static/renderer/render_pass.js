export class RenderPass {
    async _init(phase) {
        this.phase = phase;
    }

    prepareForDraw(gl, entities) { }
    draw(gl, entities) { }
}