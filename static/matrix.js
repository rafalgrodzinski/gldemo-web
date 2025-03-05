export class Matrix {
    static makeIdentity() {
        let instance = new Matrix();
        instance.m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
        return instance;  
    }

    static makeTranslate(x, y, z) {
        let instance = new Matrix();
        instance.m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]
        return instance;
    }

    static makePerspective(fieldOfView, aspect, near, far) {
        let instance = new Matrix();

        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
        var rangeInv = 1.0 / (near - far);

        instance.m = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0,
        ];
        return instance;
    }
}