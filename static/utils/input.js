import { Util } from "/utils/util.js";

export class Input {
    static forwardKey = "KeyW";
    static backKey = "KeyS";
    static rightKey = "KeyD";
    static leftKey = "KeyA";
    static upKey = "KeyE";
    static downKey = "KeyQ";
    static releaseKey = "Escape";

    static async create(container) {
        return await new Input()._init(container);
    }

    async _init(container) {
        this.movement = {forward: 0, right: 0, up: 0};
        this.look = {horizontal: 0, vertical: 0, zoom: 0};
        this.mouse = {isLeft: false, isRight: false};

        // Disable context menu
        container.oncontextmenu = (event) =>  {
            return false;
        }

        // Keyboard
        document.addEventListener("keydown", (event) => {
            if (event.repeat)
                return;

            switch (event.code) {
                case Input.forwardKey:
                    this.movement.forward = -1;
                    break;
                case Input.backKey:
                    this.movement.forward = 1;
                    break;
                case Input.rightKey:
                    this.movement.right = 1;
                    break;
                case Input.leftKey:
                    this.movement.right = -1;
                    break;
                case Input.upKey:
                    this.movement.up = 1;
                    break;
                case Input.downKey:
                    this.movement.up = -1;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        });

        document.addEventListener("keyup", (event) => {
            if (event.repeat)
                return;

            switch (event.code) {
                case Input.forwardKey:
                case Input.backKey:
                    this.movement.forward = 0;
                    break;
                case Input.rightKey:
                case Input.leftKey:
                    this.movement.right = 0;
                    break;
                case Input.upKey:
                case Input.downKey:
                    this.movement.up = 0;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        });

        // Mouse buttons
        container.addEventListener("mousedown", (event) => {
            this.mouse.isLeft = (event.buttons & 1) != 0;
            this.mouse.isRight = (event.buttons & 2) != 0;
        });

        container.addEventListener("mouseup", (event) => {
            this.mouse.isLeft = (event.buttons & 1) != 0;
            this.mouse.isRight = (event.buttons & 2) != 0;
        });

        // Mouse lock & move
        container.addEventListener("click", (event) => {
            this.mouse.isLeft = false;
            this.mouse.isRight = false;

            if (!document.pointerLockElement)
                container.requestPointerLock();
        });

        container.addEventListener("mousemove", (event) => {
            if (document.pointerLockElement == container) {
                this.look.horizontal += event.movementX / 500;
                this.look.vertical += event.movementY / 500;
            }
        });

        document.addEventListener("pointerlockchange", () => {
            if (!document.pointerLockElement) {
                this.look.horizontal = 0;
                this.look.vertical = 0;
            }
        });

        // Mouse wheel
        container.addEventListener("wheel", event => {
            if (document.pointerLockElement == container)
                this.look.zoom = Util.clamp(event.deltaY / 100, -1, 1);
        });

        return this;
    }

    resetState() {
        this.look = {horizontal: 0, vertical: 0, zoom: 0};
    }
}