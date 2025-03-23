import { Entity, EntityKind } from "components/entities/entity";
import { Scene } from "components/scene";

export class Config {
    static translationMultiplier = 10;
    static rotationMultiplier = Math.PI;
    static scaleMultiplier = 10;

    #selectedEntity: Entity | null = null;
    private selectedEntityEntry: HTMLElement | null = null;

    private entityEntriesContainer!: HTMLElement

    private info!: {name: HTMLElement, kind: HTMLElement};
    private translationInputs!: {x: HTMLInputElement, y: HTMLInputElement, z: HTMLInputElement};
    private rotationInputs!: {x: HTMLInputElement, y: HTMLInputElement, z: HTMLInputElement};
    private scaleInputs!: {x: HTMLInputElement, y: HTMLInputElement, z: HTMLInputElement};

    private translationGroup!: HTMLElement;
    private rotationGroup!: HTMLElement;
    private scaleGroup!: HTMLElement;

    static async create(
        entityEntriesContainer: HTMLElement,
        infoContainer: HTMLElement,
        translationGroup: HTMLElement,
        rotationGroup: HTMLElement,
        scaleGroup: HTMLElement,
        scene: Scene
    ) {
        return await new Config().init([entityEntriesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, scene]);
    }

    async init(args: Array<any>): Promise<Config> {
        let [entityEntriesContainer, infoContainer, translationGroup, rotationGroup, scaleGroup, scene] = args as [HTMLElement, HTMLElement, HTMLElement, HTMLElement, HTMLElement, Scene];
        this.entityEntriesContainer = entityEntriesContainer;
        this.translationGroup = translationGroup;
        this.rotationGroup = rotationGroup;
        this.scaleGroup = scaleGroup;

        // Hierarchy
        this.renderHierarchyLevel(entityEntriesContainer, scene.rootEntity);

        // Info
        this.info = {
            name: infoContainer.querySelector("#name")!,
            kind: infoContainer.querySelector("#kind")!
        };

        // Translation
        this.translationInputs = {
            x: translationGroup.querySelector("#x")!,
            y: translationGroup.querySelector("#y")!,
            z: translationGroup.querySelector("#z")!
        };

        this.translationInputs.x.oninput = (event: InputEvent) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.translation.x = value * Config.translationMultiplier;
        };

        this.translationInputs.y.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.translation.y = value * Config.translationMultiplier;
        };

        this.translationInputs.z.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.translation.z = value * Config.translationMultiplier;
        };

        // Rotation
        this.rotationInputs = {
            x: rotationGroup.querySelector("#x")!,
            y: rotationGroup.querySelector("#y")!,
            z: rotationGroup.querySelector("#z")!
        }

        this.rotationInputs.x.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.rotation.x = value * Config.rotationMultiplier;
        };

        this.rotationInputs.y.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.rotation.y = value * Config.rotationMultiplier;
        };

        this.rotationInputs.z.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.rotation.z = value * Config.rotationMultiplier;
        };

        // Scale
        this.scaleInputs = {
            x: scaleGroup.querySelector("#x")!,
            y: scaleGroup.querySelector("#y")!,
            z: scaleGroup.querySelector("#z")!
        }

        this.scaleInputs.x.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.scale.x = value * Config.scaleMultiplier;
        };

        this.scaleInputs.y.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.scale.y = value * Config.scaleMultiplier
        };

        this.scaleInputs.z.oninput = (event) => {
            let value = +(event.target as HTMLInputElement).value
            this.#selectedEntity!.scale.z = value * Config.scaleMultiplier
        };

        this.selectedEntity = null;

        return this;
    }

    private renderHierarchyLevel(container: HTMLElement, entity: Entity) {
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
        let childrenContainer: HTMLElement;
        if (entity.children.length > 0) {
            // Button for children
            entityEntryButton.classList.add("entities-parrent-button");

            // Children
            childrenContainer = document.createElement("ul");
            childrenContainer.classList.add("entities-group");
            container.appendChild(childrenContainer);
            entity.children.forEach(child => {
                this.renderHierarchyLevel(childrenContainer, child);
            });
        }

        entityEntryButton.onclick = (event) => {
            if (childrenContainer != null) {
                childrenContainer.classList.toggle("entities-group-active");
                (event.target as HTMLElement).classList.toggle("entities-parrent-button-active");
            }
        };

        entityEntry.onclick = (event) => {
            if (this.selectedEntityEntry != null)
                this.selectedEntityEntry.classList.remove("entities-entry-active");

            this.selectedEntityEntry = event.target as HTMLElement;
            this.selectedEntityEntry.classList.add("entities-entry-active");
            this.selectedEntity = entity;
        };
    }

    set selectedEntity(value: Entity | null) {
        this.#selectedEntity = value;

        this.info.name.innerHTML = value?.name ?? "";
        this.info.kind.innerHTML = value?.kind.toString() ?? "";

        this.translationInputs.x.value = "" + (value?.translation.x ?? 0) / Config.translationMultiplier;
        this.translationInputs.y.value = "" + (value?.translation.y ?? 0) / Config.translationMultiplier;
        this.translationInputs.z.value = "" + (value?.translation.z ?? 0) / Config.translationMultiplier;

        this.rotationInputs.x.value = "" + (value?.rotation.x ?? 0) / Config.rotationMultiplier;
        this.rotationInputs.y.value = "" + (value?.rotation.y ?? 0) / Config.rotationMultiplier;
        this.rotationInputs.z.value = "" + (value?.rotation.z ?? 0) / Config.rotationMultiplier;

        this.scaleInputs.x.value = "" + (value?.scale.x ?? 1) / Config.scaleMultiplier;
        this.scaleInputs.y.value = "" + (value?.scale.y ?? 1) / Config.scaleMultiplier;
        this.scaleInputs.z.value = "" + (value?.scale.z ?? 1) / Config.scaleMultiplier;

        switch (value?.kind) {
            case EntityKind.Node:
                this.translationGroup.hidden = false;
                this.rotationGroup.hidden = false;
                this.scaleGroup.hidden = false;
                break;
            case EntityKind.Model:
                this.translationGroup.hidden = false;
                this.rotationGroup.hidden = false;
                this.scaleGroup.hidden = false;
                break;
            case EntityKind.Light:
                this.translationGroup.hidden = true;
                this.rotationGroup.hidden = false;
                this.scaleGroup.hidden = true;
                break;
            case EntityKind.Camera:
                this.translationGroup.hidden = false;
                this.rotationGroup.hidden = false;
                this.scaleGroup.hidden = true;
                break;
            default:
                this.translationGroup.hidden = true;
                this.rotationGroup.hidden = true;
                this.scaleGroup.hidden = true;
        }
    }
}