export enum CameraProjectionKind {
    Ortographic,
    Perspective
}

export class Camera {
    projectionKind: CameraProjectionKind;
    angle: number;
    width: number;
    depth: number;

    private constructor(projectionKind: CameraProjectionKind, angle: number, width: number, depth: number) {
        this.projectionKind = projectionKind;
        this.angle = angle;
        this.width = width;
        this.depth = depth;
    }

    static makeOrtographic(width: number, depth: number): Camera {
        return new Camera(CameraProjectionKind.Ortographic, 0, width, depth);
    }

    static makePerspective(angle: number, depth: number): Camera {
        return new Camera(CameraProjectionKind.Perspective, angle, 0, depth);
    }
}