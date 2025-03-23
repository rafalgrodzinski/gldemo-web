export class Util {
    static clamp(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }

    static clampEdge(value: number, edge: number, max: number) {
        if (value < edge)
            return 0;
        if (value > max)
            return max;
        return value;
    }

    static deadzone(value: number, edge: number): number {
        if (Math.abs(value) < edge)
                return 0;
        return value;
    }

    static async text(fileName: string): Promise<string> {
        return await fetch(fileName)
            .then(response => response.text())
    }

    static async image(fileName: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = fileName;
            image.addEventListener("load", () => {
                resolve(image);
            });
        });
    }
}