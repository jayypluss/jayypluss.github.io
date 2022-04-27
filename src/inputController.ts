import {ActionManager, ExecuteCodeAction, Scalar, Scene} from "@babylonjs/core";

export class PlayerInput {
    private inputMap: any = {}
    private vertical: number
    private verticalAxis: number
    private horizontal: number
    private horizontalAxis: number

    
    //jumping and dashing
    public jumpKeyDown: boolean = false;
    public dashing: boolean = false;

    constructor(scene: Scene) {
        scene.actionManager = new ActionManager(scene)

        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown"
            // console.log('keydown: ', evt.sourceEvent.key)
        }))

        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown"
            // console.log('keyup: ', evt.sourceEvent.key)
        }))

        scene.onBeforeRenderObservable.add(() => {
            this._updateFromKeyboard()
        })
    }

    private _updateFromKeyboard(): void {
        //dash
        if (this.inputMap["Shift"]) {
            this.dashing = true;
        } else {
            this.dashing = false;
        }

        //Jump Checks (SPACE)
        if (this.inputMap[" "]) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }

        if (this.inputMap["ArrowUp"] || this.inputMap["w"] || this.inputMap["W"]) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2)
            this.verticalAxis = 1

        } else if (this.inputMap["ArrowDown"] || this.inputMap["s"] || this.inputMap["S"]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2)
            this.verticalAxis = -1
        } else {
            this.vertical = 0
            this.verticalAxis = 0
        }

        if (this.inputMap["ArrowLeft"] || this.inputMap["a"] || this.inputMap["A"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2)
            this.horizontalAxis = -1

        } else if (this.inputMap["ArrowRight"] || this.inputMap["d"] || this.inputMap["D"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2)
            this.horizontalAxis = 1
        }
        else {
            this.horizontal = 0
            this.horizontalAxis = 0
        }
    }
}
