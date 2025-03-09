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
}