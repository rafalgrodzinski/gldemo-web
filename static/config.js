export class Config {
    constructor() { }

    static async create(translationGroup, rotationGroup, scaleGroup) {
        let instance = new Config();

        // Translation
        instance.translationX = translationGroup.querySelector("#x");
        instance.translationX.oninput = (event) => {
            console.log("tx: ", event.target.value);
        };

        instance.translationY = translationGroup.querySelector("#y");
        instance.translationY.oninput = (event) => {
            console.log("ty: ", event.target.value);
        };

        instance.translationZ = translationGroup.querySelector("#z");
        instance.translationZ.oninput = (event) => {
            console.log("tz: ", event.target.value);
        };

        // Rotation
        instance.rotationX = rotationGroup.querySelector("#x");
        instance.rotationX.oninput = (event) => {
            console.log("rx: ", event.target.value);
        };

        instance.rotationY = rotationGroup.querySelector("#y");
        instance.rotationY.oninput = (event) => {
            console.log("ry: ", event.target.value);
        };

        instance.rotationZ = rotationGroup.querySelector("#z");
        instance.rotationZ.oninput = (event) => {
            console.log("rz: ", event.target.value);
        };

        // Scale
        instance.scaleX = scaleGroup.querySelector("#x");
        instance.scaleX.oninput = (event) => {
            console.log("sx: ", event.target.value);
        };

        instance.scaleY = scaleGroup.querySelector("#y");
        instance.scaleY.oninput = (event) => {
            console.log("sy: ", event.target.value);
        };

        instance.scaleZ = scaleGroup.querySelector("#z");
        instance.scaleZ.oninput = (event) => {
            console.log("sz: ", event.target.value);
        };

        return instance;
    }

    set entities(value) {

    }
}