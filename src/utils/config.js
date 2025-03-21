import { Entity } from "components/entities/entity.js";

export class Config {
    static translationMultiplier = 10;
    static rotationMultiplier = Math.PI;
    static scaleMultiplier = 10;

    //#entities = [];
    #selectedEntity = null;

    #entityEntriesContainer = null;
    #selectedEntityEntry = null;

    #info = null;
    #translationInputs = null;
    #rotationInputs = null;
    #scaleInputs = null;

    #translationGroup = null;
    #rotationGroup = null;
    #scaleGroup = null;

    static async create(entityEntriesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, scene) {
        return await new Config().init(entityEntriesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, scene);
    }

    async init(entityEntriesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, scene) {
        this.#entityEntriesContainer = entityEntriesContainer;
        this.#translationGroup = translationGroup;
        this.#rotationGroup = rotationGroup;
        this.#scaleGroup = scaleGroup;

        // Hierarchy
        this.#renderHierarchyLevel(entityEntriesContainer, scene.rootEntity);

        // Info
        this.#info = {
            name: infoContainer.querySelector("#name"),
            kind: infoContainer.querySelector("#kind")
        };

        // Translation
        this.#translationInputs = {
            x: translationGroup.querySelector("#x"),
            y: translationGroup.querySelector("#y"),
            z: translationGroup.querySelector("#z")
        };

        this.#translationInputs.x.oninput = (event) => {
            this.#selectedEntity.translation.x = event.target.value * Config.translationMultiplier;
        };

        this.#translationInputs.y.oninput = (event) => {
            this.#selectedEntity.translation.y = event.target.value * Config.translationMultiplier;
        };

        this.#translationInputs.z.oninput = (event) => {
            this.#selectedEntity.translation.z = event.target.value * Config.translationMultiplier;
        };

        // Rotation
        this.#rotationInputs = {
            x: rotationGroup.querySelector("#x"),
            y: rotationGroup.querySelector("#y"),
            z: rotationGroup.querySelector("#z")
        }

        this.#rotationInputs.x.oninput = (event) => {
            this.#selectedEntity.rotation.x = event.target.value * Config.rotationMultiplier;
        };

        this.#rotationInputs.y.oninput = (event) => {
            this.#selectedEntity.rotation.y = event.target.value * Config.rotationMultiplier;
        };

        this.#rotationInputs.z.oninput = (event) => {
            this.#selectedEntity.rotation.z = event.target.value * Config.rotationMultiplier;
        };

        // Scale
        this.#scaleInputs = {
            x: scaleGroup.querySelector("#x"),
            y: scaleGroup.querySelector("#y"),
            z: scaleGroup.querySelector("#z")
        }

        this.#scaleInputs.x.oninput = (event) => {
            this.#selectedEntity.scale.x = event.target.value * Config.scaleMultiplier;
        };

        this.#scaleInputs.y.oninput = (event) => {
            this.#selectedEntity.scale.y = event.target.value * Config.scaleMultiplier
        };

        this.#scaleInputs.z.oninput = (event) => {
            this.#selectedEntity.scale.z = event.target.value * Config.scaleMultiplier
        };

        this.selectedEntity = null;

        return this;
    }

    #renderHierarchyLevel(container, entity) {
        // Entity
        let entityEntryItem = document.createElement("li");
        entityEntryItem.classList.add("entities-entry-item");
        container.appendChild(entityEntryItem);

        let entityEntryButton = document.createElement("div");
        entityEntryButton.classList.add("entities-entry-button");
        entityEntryItem.appendChild(entityEntryButton);

        let entityEntry = document.createElement("div");
        entityEntry.classList.add("entities-entry");
        entityEntry.appendChild(document.createTextNode(entity.name));
        entityEntryItem.appendChild(entityEntry);

        // Children
        let childrenContainer = null;
        if (entity.children.length > 0) {
            // Button for children
            entityEntryButton.classList.add("entities-parrent-button");

            // Children
            childrenContainer = document.createElement("ul");
            childrenContainer.classList.add("entities-group");
            container.appendChild(childrenContainer);
            entity.children.forEach(child => {
                this.#renderHierarchyLevel(childrenContainer, child);
            });
        }

        entityEntryButton.onclick = (event) => {
            if (childrenContainer != null) {
                childrenContainer.classList.toggle("entities-group-active");
                event.target.classList.toggle("entities-parrent-button-active");
            }
        };

        entityEntry.onclick = event => {
            if (this.#selectedEntityEntry != null)
                this.#selectedEntityEntry.classList.remove("entities-entry-active");

            this.#selectedEntityEntry = event.target;
            this.#selectedEntityEntry.classList.add("entities-entry-active");
            this.selectedEntity = entity;
        };
    }

    set selectedEntity(value) {
        this.#selectedEntity = value;

        this.#info.name.innerHTML = value?.name ?? "";
        this.#info.kind.innerHTML = value?.kind ?? "";

        this.#translationInputs.x.value = (value?.translation.x ?? 0) / Config.translationMultiplier;
        this.#translationInputs.y.value = (value?.translation.y ?? 0) / Config.translationMultiplier;
        this.#translationInputs.z.value = (value?.translation.z ?? 0) / Config.translationMultiplier;

        this.#rotationInputs.x.value = (value?.rotation.x ?? 0) / Config.rotationMultiplier;
        this.#rotationInputs.y.value = (value?.rotation.y ?? 0) / Config.rotationMultiplier;
        this.#rotationInputs.z.value = (value?.rotation.z ?? 0) / Config.rotationMultiplier;

        this.#scaleInputs.x.value = (value?.scale.x ?? 1) / Config.scaleMultiplier;
        this.#scaleInputs.y.value = (value?.scale.y ?? 1) / Config.scaleMultiplier;
        this.#scaleInputs.z.value = (value?.scale.z ?? 1) / Config.scaleMultiplier;

        switch (value?.kind) {
            case Entity.NODE:
                this.#translationGroup.hidden = false;
                this.#rotationGroup.hidden = false;
                this.#scaleGroup.hidden = false;
                break;
            case Entity.MODEL:
                this.#translationGroup.hidden = false;
                this.#rotationGroup.hidden = false;
                this.#scaleGroup.hidden = false;
                break;
            case Entity.LIGHT:
                this.#translationGroup.hidden = true;
                this.#rotationGroup.hidden = false;
                this.#scaleGroup.hidden = true;
                break;
            case Entity.CAMERA:
                this.#translationGroup.hidden = false;
                this.#rotationGroup.hidden = false;
                this.#scaleGroup.hidden = true;
                break;
            default:
                this.#translationGroup.hidden = true;
                this.#rotationGroup.hidden = true;
                this.#scaleGroup.hidden = true;
        }
    }
}