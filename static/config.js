export class Config {
    #entities = [];
    #entitiesContainer = null;
    #selectedEntity = null;

    static translationScale = 10;
    static rotationScale = Math.PI;

    constructor(entitiesContainer, translationGroup, rotationGroup, scaleGroup) { 
        let instance = async () => {
            this.#entitiesContainer = entitiesContainer;

            // Translation
            this.translationX = translationGroup.querySelector("#x");
            this.translationX.oninput = (event) => {
                this.#selectedEntity.translation.x = event.target.value * Config.translationScale;
            };

            this.translationY = translationGroup.querySelector("#y");
            this.translationY.oninput = (event) => {
                this.#selectedEntity.translation.y = event.target.value * Config.translationScale;
            };

            this.translationZ = translationGroup.querySelector("#z");
            this.translationZ.oninput = (event) => {
                this.#selectedEntity.translation.z = event.target.value * Config.translationScale;
            };

            // Rotation
            this.rotationX = rotationGroup.querySelector("#x");
            this.rotationX.oninput = (event) => {
                this.#selectedEntity.rotation.x = event.target.value * Config.rotationScale;
            };

            this.rotationY = rotationGroup.querySelector("#y");
            this.rotationY.oninput = (event) => {
                this.#selectedEntity.rotation.y = event.target.value * Config.rotationScale;
            };

            this.rotationZ = rotationGroup.querySelector("#z");
            this.rotationZ.oninput = (event) => {
                this.#selectedEntity.rotation.z = event.target.value * Config.rotationScale;
            };

            // Scale
            this.scaleX = scaleGroup.querySelector("#x");
            this.scaleX.oninput = (event) => {
                this.#selectedEntity.scale.x = event.target.value;
            };

            this.scaleY = scaleGroup.querySelector("#y");
            this.scaleY.oninput = (event) => {
                this.#selectedEntity.scale.y = event.target.value
            };

            this.scaleZ = scaleGroup.querySelector("#z");
            this.scaleZ.oninput = (event) => {
                this.#selectedEntity.scale.z = event.target.value
            };

            return this;
        }
        return instance();
    }

    set entities(value) {
        this.#entities = value;

        this.#entitiesContainer.innerHTML = "";
        for (let i=0; i<this.#entities.length; i++) {
            //this.#entitiesContainer.innerHTML += `<div id="entity${i}" class="entities-entry">${this.#entities[i].name}</div>`
            //let entity = this.#entitiesContainer.querySelector(`entity${i}`);
            let entity = document.createElement("div");
            entity.classList.add("entities-entry");
            entity.appendChild(document.createTextNode(this.#entities[i].name))
            this.#entitiesContainer.appendChild(entity);

            entity.onclick = () => {
                console.log("Selected: ", entity);
                this.#selectedEntity = this.#entities[i];
            }
        }
    }
}