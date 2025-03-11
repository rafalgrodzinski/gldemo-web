import { Util } from "/utils/util.js";

export class Input {
    static forwardKey = "KeyW";
    static backKey = "KeyS";
    static rightKey = "KeyD";
    static leftKey = "KeyA";
    static upKey = "KeyE";
    static downKey = "KeyQ";
    static releaseKey = "Escape";

    #keyboardMovement = {forward: 0, right: 0, up: 0};
    #gamepadMovement = {forward: 0, right: 0, up: 0};

    #mouseActions = {primary: false, secondary: false};
    #gamepadActions = {primary: false, secondary: false};

    #mouseLook = {horizontal: 0, vertical: 0, zoom: 0};
    #gamepadLook = {horizontal: 0, vertical: 0, zoom: 0};

    #shouldReleaseOnMouseUp = false;
    #shouldIgnoreClick = false;

    get movement() {
        let values = {
            forward: this.#keyboardMovement.forward,
            right: this.#keyboardMovement.right,
            up: this.#keyboardMovement.up
        };

        if (this.#gamepadMovement.forward != 0)
            values.forward = this.#gamepadMovement.forward;
        if (this.#gamepadMovement.right != 0)
            values.right = this.#gamepadMovement.right;
        if (this.#gamepadMovement.up != 0)
            values.up = this.#gamepadMovement.up;

        return values;
    }

    get actions() {
        let values = {
            primary: this.#mouseActions.primary || this.#gamepadActions.primary,
            secondary: this.#mouseActions.secondary || this.#gamepadActions.secondary
        };

        return values;
    }

    get look() {
        let values = {
            horizontal: this.#mouseLook.horizontal,
            vertical: this.#mouseLook.vertical,
            zoom: this.#mouseLook.zoom
        }
        if (this.#gamepadLook.horizontal != 0)
            values.horizontal = this.#gamepadLook.horizontal
        if (this.#gamepadLook.vertical != 0)
            values.vertical = this.#gamepadLook.vertical
        if (this.#gamepadLook.zoom != 0)
            values.zoom = this.#gamepadLook.zoom

        return values;
    }

    static async create(container) {
        return await new Input()._init(container);
    }

    async _init(container) {
        // Disable context menu
        container.oncontextmenu = (event) =>  {
            return false;
        }

        this.#initKeyboard();
        this.#initMouse(container);

        return this;
    }

    #initKeyboard() {
        document.addEventListener("keydown", (event) => {
            if (event.repeat)
                return;

            switch (event.code) {
                case Input.forwardKey:
                    this.#keyboardMovement.forward = -1;
                    break;
                case Input.backKey:
                    this.#keyboardMovement.forward = 1;
                    break;
                case Input.rightKey:
                    this.#keyboardMovement.right = 1;
                    break;
                case Input.leftKey:
                    this.#keyboardMovement.right = -1;
                    break;
                case Input.upKey:
                    this.#keyboardMovement.up = 1;
                    break;
                case Input.downKey:
                    this.#keyboardMovement.up = -1;
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
                    this.#keyboardMovement.forward = 0;
                    break;
                case Input.rightKey:
                case Input.leftKey:
                    this.#keyboardMovement.right = 0;
                    break;
                case Input.upKey:
                case Input.downKey:
                    this.#keyboardMovement.up = 0;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        });
    }

    #initMouse(container) {
        // Mouse buttons
        container.addEventListener("mousedown", (event) => {
            this.#mouseActions.primary = (event.buttons & 1) != 0;
            this.#mouseActions.secondary = (event.buttons & 2) != 0;
        });

        container.addEventListener("mouseup", (event) => {
            this.#mouseActions.primary = (event.buttons & 1) != 0;
            this.#mouseActions.secondary = (event.buttons & 2) != 0;

            if (!this.#mouseActions.primary && this.#shouldReleaseOnMouseUp) {
                this.#shouldReleaseOnMouseUp = false;
                this.#shouldIgnoreClick = true;
                document.exitPointerLock();
            }
        });

        // Mouse lock & move
        container.addEventListener("click", (event) => {
            console.log("click")
            if (!document.pointerLockElement && !this.#shouldIgnoreClick) {
                this.#mouseActions.primary = false;
                this.#mouseActions.secondary = false;        
                container.requestPointerLock();
            }
            this.#shouldIgnoreClick = false;
        });

        container.addEventListener("mousemove", (event) => {
            if (this.#mouseActions.primary && !document.pointerLockElement) {
                this.#mouseLook.horizontal += event.movementX / 500;
                this.#mouseLook.vertical += event.movementY / 500;
                this.#shouldReleaseOnMouseUp = true;
                container.requestPointerLock();
            } else if (document.pointerLockElement == container) {
                this.#mouseLook.horizontal += event.movementX / 500;
                this.#mouseLook.vertical += event.movementY / 500;
            }
        });

        document.addEventListener("pointerlockchange", () => {
            if (!document.pointerLockElement) {
                this.#mouseLook.horizontal = 0;
                this.#mouseLook.vertical = 0;
            }
        });

        // Mouse wheel
        container.addEventListener("wheel", event => {
            if (document.pointerLockElement == container)
                this.#mouseLook.zoom = Util.clamp(event.deltaY / 100, -1, 1);
        });
    }

    #readGamepad() {
        this.#gamepadMovement = {forward: 0, right: 0, up: 0};
        this.#gamepadActions = {primary: false, secondary: false};
        this.#gamepadLook = {horizontal: 0, vertical: 0, zoom: 0};

        let gamepad = navigator.getGamepads()[0];
        if (gamepad) {
            // Left stick
            this.#gamepadMovement.right = Util.deadzone(gamepad.axes[1], 0.01);
            this.#gamepadMovement.forward = Util.deadzone(gamepad.axes[2], 0.01);

            // Right stick
            this.#gamepadLook.horizontal = Util.deadzone(gamepad.axes[3], 0.01) / 50;
            this.#gamepadLook.vertical = Util.deadzone(gamepad.axes[4], 0.01) / 50;

            // Triggers
            this.#gamepadMovement.up = Util.deadzone((gamepad.axes[5] + 1) / 2, 0.01); // Right trigger
            this.#gamepadMovement.up -= Util.deadzone((gamepad.axes[6] + 1) / 2, 0.01); // Left trigger

            // Actions
            this.#gamepadActions.primary = gamepad.buttons[6].pressed;
            this.#gamepadActions.secondary = gamepad.buttons[7].pressed;

            // Zoom
            if (this.#gamepadActions.primary)
                this.#gamepadLook.zoom = this.#gamepadMovement.forward / 10;
            else
                this.#gamepadLook.zoom = 0;
        }
    }

    resetState() {
        this.#mouseLook = {horizontal: 0, vertical: 0, zoom: 0};
        this.#readGamepad();
    }
}