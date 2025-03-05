export class Config {
    #entities = [];

    static translationScale = 10;
    static rotationScale = Math.PI;

    constructor(translationGroup, rotationGroup, scaleGroup) { 
        let instance = async () => {
            // Translation
            this.translationX = translationGroup.querySelector("#x");
            this.translationX.oninput = (event) => {
                this.#entities[0].translation.x = event.target.value * Config.translationScale;
            };

            this.translationY = translationGroup.querySelector("#y");
            this.translationY.oninput = (event) => {
                this.#entities[0].translation.y = event.target.value * Config.translationScale;
            };

            this.translationZ = translationGroup.querySelector("#z");
            this.translationZ.oninput = (event) => {
                this.#entities[0].translation.z = event.target.value * Config.translationScale;
            };

            // Rotation
            this.rotationX = rotationGroup.querySelector("#x");
            this.rotationX.oninput = (event) => {
                this.#entities[0].rotation.x = event.target.value * Config.rotationScale;
            };

            this.rotationY = rotationGroup.querySelector("#y");
            this.rotationY.oninput = (event) => {
                this.#entities[0].rotation.y = event.target.value * Config.rotationScale;
            };

            this.rotationZ = rotationGroup.querySelector("#z");
            this.rotationZ.oninput = (event) => {
                this.#entities[0].rotation.z = event.target.value * Config.rotationScale;
            };

            // Scale
            this.scaleX = scaleGroup.querySelector("#x");
            this.scaleX.oninput = (event) => {
                this.#entities[0].scale.x = event.target.value;
            };

            this.scaleY = scaleGroup.querySelector("#y");
            this.scaleY.oninput = (event) => {
                this.#entities[0].scale.y = event.target.value
            };

            this.scaleZ = scaleGroup.querySelector("#z");
            this.scaleZ.oninput = (event) => {
                this.#entities[0].scale.z = event.target.value
            };

            return this;
        }
        return instance();
    }

    set entities(value) {
        this.#entities = value;
    }
}