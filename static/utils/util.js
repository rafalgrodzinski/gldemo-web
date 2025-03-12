export class Util {
    static clamp(number, min, max) {
        if (number < min)
            return min;
        if (number > max)
            return max;
        return number;
    }

    static clampEdge(number, edge, max) {
        if (number < edge)
            return 0;
        if (number > max)
            return max;
        return number;
    }

    static deadzone(number, edge) {
        if (Math.abs(number) < edge)
                return 0;
        return number;
    }

    static async texture(fileName) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = fileName;
            image.addEventListener("load", () => {
                resolve(image);
            });
        });
    }

    static runPhase(entities, phase, callback) {
        let filteredEntities = entities.filter(entity => {
            return entity.phases.includes(phase);
        });
        filteredEntities.forEach(callback);
    }
}