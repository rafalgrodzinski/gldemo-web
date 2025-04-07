export class Anim {
    name: string;
    startFrame: number;
    framesCount: number;
    frameDuration: number;

    get endFrame(): number {
        return this.startFrame + this.framesCount - 1;
    }

    setCurrentAnim: ((animation: Anim | null) => void) | null = null;

    constructor(name: string, startFrame: number, framesCount: number, frameDuration: number) {
        this.name = name;
        this.startFrame = startFrame;
        this.framesCount = framesCount;
        this.frameDuration = frameDuration;
    }

    play() {        
        if (this.setCurrentAnim != null)
            this.setCurrentAnim(this);
    }

    stop() {
        if (this.setCurrentAnim != null)
            this.setCurrentAnim(null);
    }
}