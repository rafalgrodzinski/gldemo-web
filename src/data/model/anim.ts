export class Anim {
    startFrame: number;
    framesCount: number;
    frameDuration: number;

    setCurrentAnim: ((animation: Anim | null) => void) | null = null;

    constructor(startFrame: number, framesCount: number, frameDuration: number) {
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