export class RenderPass {
    phase;

    async _init(phase) {
        this.phase = phase;
    }

    prepareForDraw(gl, entities) { }
    draw(gl, entities) { }
}