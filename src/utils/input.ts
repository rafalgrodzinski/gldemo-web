import { Util } from "utils/util";

export type InputMovement = {forward: number, right: number, up: number};
export type InputActions = {primary: boolean, secondary: boolean};
export type InputLook = {horizontal: number, vertical: number, zoom: number};

export class Input {
    private static forwardKey = "KeyW";
    private static backKey = "KeyS";
    private static rightKey = "KeyD";
    private static leftKey = "KeyA";
    private static upKey = "KeyE";
    private static downKey = "KeyQ";
    private static releaseKey = "Escape";

    private keyboardMovement: InputMovement = {forward: 0, right: 0, up: 0};
    private touchMovement: InputMovement = {forward: 0, right: 0, up: 0};
    private gamepadMovement: InputMovement = {forward: 0, right: 0, up: 0};

    private mouseActions: InputActions = {primary: false, secondary: false};
    private touchActions: InputActions = {primary: false, secondary: false};
    private gamepadActions: InputActions = {primary: false, secondary: false};

    private mouseLook: InputLook = {horizontal: 0, vertical: 0, zoom: 0};
    private gamepadLook: InputLook = {horizontal: 0, vertical: 0, zoom: 0};
    private touchLook: InputLook = {horizontal: 0, vertical: 0, zoom: 0};

    private shouldReleaseOnMouseUp: boolean = false;
    private shouldIgnoreClick: boolean = false;
    private touchesCount: number = 0;
    private lastTouch: {x: number, y: number} | null = null;

    get movement(): InputMovement {
        // Keyboard
        let values: InputMovement = {
            forward: this.keyboardMovement.forward,
            right: this.keyboardMovement.right,
            up: this.keyboardMovement.up
        };

        // Touch
        if (this.touchMovement.forward != 0)
            values.forward = this.touchMovement.forward;
        if (this.touchMovement.right != 0)
            values.right = this.touchMovement.right;
        if (this.touchMovement.up != 0)
            values.up = this.touchMovement.up;

        // Gamepad
        if (this.gamepadMovement.forward != 0)
            values.forward = this.gamepadMovement.forward;
        if (this.gamepadMovement.right != 0)
            values.right = this.gamepadMovement.right;
        if (this.gamepadMovement.up != 0)
            values.up = this.gamepadMovement.up;

        return values;
    }

    get actions(): InputActions {
        let values: InputActions = {
            primary: this.mouseActions.primary || this.touchActions.primary || this.gamepadActions.primary,
            secondary: this.mouseActions.secondary || this.touchActions.secondary || this.gamepadActions.secondary
        };

        return values;
    }

    get look(): InputLook {
        // Mouse
        let values: InputLook = {
            horizontal: this.mouseLook.horizontal,
            vertical: this.mouseLook.vertical,
            zoom: this.mouseLook.zoom
        }

        // Touch
        if (this.touchLook.horizontal != 0)
            values.horizontal = this.touchLook.horizontal;
        if (this.touchLook.vertical != 0)
            values.vertical = this.touchLook.vertical;

        // Gamepad
        if (this.gamepadLook.horizontal != 0)
            values.horizontal = this.gamepadLook.horizontal
        if (this.gamepadLook.vertical != 0)
            values.vertical = this.gamepadLook.vertical
        if (this.gamepadLook.zoom != 0)
            values.zoom = this.gamepadLook.zoom

        return values;
    }

    static async create(container: HTMLElement): Promise<Input> {
        return await new Input().init(container);
    }

    protected async init(container: HTMLElement): Promise<this> {
        // Disable context menu
        container.oncontextmenu = () =>  {
            return false;
        }

        this.initKeyboard();
        this.initMouse(container);
        this.initTouch(container);

        return this;
    }

    private initKeyboard() {
        document.addEventListener("keydown", (event) => {
            if (event.repeat)
                return;

            switch (event.code) {
                case Input.forwardKey:
                    this.keyboardMovement.forward = -1;
                    break;
                case Input.backKey:
                    this.keyboardMovement.forward = 1;
                    break;
                case Input.rightKey:
                    this.keyboardMovement.right = 1;
                    break;
                case Input.leftKey:
                    this.keyboardMovement.right = -1;
                    break;
                case Input.upKey:
                    this.keyboardMovement.up = 1;
                    break;
                case Input.downKey:
                    this.keyboardMovement.up = -1;
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
                    this.keyboardMovement.forward = 0;
                    break;
                case Input.rightKey:
                case Input.leftKey:
                    this.keyboardMovement.right = 0;
                    break;
                case Input.upKey:
                case Input.downKey:
                    this.keyboardMovement.up = 0;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        });
    }

    private initMouse(container: HTMLElement) {
        // Mouse buttons
        container.addEventListener("mousedown", (event) => {
            this.mouseActions.primary = (event.buttons & 1) != 0;
            this.mouseActions.secondary = (event.buttons & 2) != 0;
        });

        container.addEventListener("mouseup", (event) => {
            this.mouseActions.primary = (event.buttons & 1) != 0;
            this.mouseActions.secondary = (event.buttons & 2) != 0;

            if (!this.mouseActions.primary && this.shouldReleaseOnMouseUp) {
                this.shouldReleaseOnMouseUp = false;
                this.shouldIgnoreClick = true;
                document.exitPointerLock();
            }
        });

        // Mouse lock & move
        container.addEventListener("click", () => {
            if (!document.pointerLockElement && !this.shouldIgnoreClick) {
                this.mouseActions.primary = false;
                this.mouseActions.secondary = false;        
                container.requestPointerLock();
            }
            this.shouldIgnoreClick = false;
        });

        container.addEventListener("mousemove", (event) => {
            if (this.mouseActions.primary && !document.pointerLockElement) {
                this.mouseLook.horizontal += event.movementX / 500;
                this.mouseLook.vertical += event.movementY / 500;
                this.shouldReleaseOnMouseUp = true;
                container.requestPointerLock();
            } else if (document.pointerLockElement == container) {
                this.mouseLook.horizontal += event.movementX / 500;
                this.mouseLook.vertical += event.movementY / 500;
            }
        });

        document.addEventListener("pointerlockchange", () => {
            if (!document.pointerLockElement) {
                this.mouseLook.horizontal = 0;
                this.mouseLook.vertical = 0;
            }
        });

        // Mouse wheel
        container.addEventListener("wheel", (event) => {
            if (document.pointerLockElement == container)
                this.mouseLook.zoom = Util.clamp(event.deltaY / 100, -1, 1);
        });
    }

    private initTouch(container: HTMLElement) {
        container.addEventListener("touchstart", (event) => {
                let x = event.touches[0].clientX;
                let y = event.touches[0].clientY;

                this.lastTouch = { x: x, y: y };

                this.touchesCount = event.touches.length;

                event.preventDefault();
        });

        container.addEventListener("touchmove", (event) => {
            let x = event.touches[0].clientX;
            let y = event.touches[0].clientY;

            if (this.touchesCount == 1) {
                this.touchLook.horizontal += (x - this.lastTouch!.x) / 250;
                this.touchLook.vertical += (y - this.lastTouch!.y) / 250;
            } else if (this.touchesCount == 2) {
                this.touchMovement.right += x - this.lastTouch!.x;
                this.touchMovement.up -= y - this.lastTouch!.y;
            } else if (this.touchesCount == 3) {
                this.touchMovement.forward = y - this.lastTouch!.y;
            }

            this.lastTouch = {x: x, y: y};

            event.preventDefault();
        });

        container.addEventListener("touchend", (event) => {
            let x = event.touches[0].clientX;
            let y = event.touches[0].clientY;

            if (this.touchesCount == 1) {
                this.touchLook.horizontal += (x - this.lastTouch!.x) / 250;
                this.touchLook.vertical += (y - this.lastTouch!.y) / 250;
            } else if (this.touchesCount == 2) {
                this.touchMovement.right += x - this.lastTouch!.x;
                this.touchMovement.up += y - this.lastTouch!.y;
            } else if (this.touchesCount == 3) {
                this.touchMovement.forward = y - this.lastTouch!.y;
            }
    
            this.lastTouch = null;
            this.touchesCount = 0;
            this.touchActions.primary = false;
            event.preventDefault();
        });

        container.addEventListener("touchcancel", (event) => {
            let x = event.touches[0].clientX / 250;
            let y = event.touches[0].clientY / 250;

            if (this.touchesCount == 1) {
                this.touchLook.horizontal += x - this.lastTouch!.x;
                this.touchLook.vertical += y - this.lastTouch!.y;
            } else if (this.touchesCount == 2) {
                this.touchMovement.right += x - this.lastTouch!.x;
                this.touchMovement.up += y - this.lastTouch!.y;
            } else if (this.touchesCount == 3) {
                this.touchMovement.forward = y - this.lastTouch!.y;
            }

            this.lastTouch = null;
            this.touchesCount = 0;
            this.touchActions.primary = false;
            event.preventDefault();
        });
    }

    private readGamepad() {
        this.gamepadMovement = {forward: 0, right: 0, up: 0};
        this.gamepadActions = {primary: false, secondary: false};
        this.gamepadLook = {horizontal: 0, vertical: 0, zoom: 0};

        let gamepad = navigator.getGamepads()[0];
        if (gamepad) {
            // Left stick
            this.gamepadMovement.right = Util.deadzone(gamepad.axes[1], 0.01);
            this.gamepadMovement.forward = Util.deadzone(gamepad.axes[2], 0.01);

            // Right stick
            this.gamepadLook.horizontal = Util.deadzone(gamepad.axes[3], 0.01) / 50;
            this.gamepadLook.vertical = Util.deadzone(gamepad.axes[4], 0.01) / 50;

            // Triggers
            this.gamepadMovement.up = Util.deadzone((gamepad.axes[5] + 1) / 2, 0.01); // Right trigger
            this.gamepadMovement.up -= Util.deadzone((gamepad.axes[6] + 1) / 2, 0.01); // Left trigger

            // Actions
            this.gamepadActions.primary = gamepad.buttons[6].pressed;
            this.gamepadActions.secondary = gamepad.buttons[7].pressed;

            // Zoom
            if (this.gamepadActions.primary)
                this.gamepadLook.zoom = this.gamepadMovement.forward / 10;
            else
                this.gamepadLook.zoom = 0;
        }
    }

    resetState() {
        this.mouseLook = {horizontal: 0, vertical: 0, zoom: 0};
        this.touchLook = {horizontal: 0, vertical: 0, zoom: 0};
        this.touchMovement = {forward: 0, right: 0, up: 0};
        this.readGamepad();
    }
}