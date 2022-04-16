import MainScene from "./scenes/MainScene"
import {Scene} from "@babylonjs/core"

export class App {
    currentScene: Scene

    constructor() {
        new MainScene().createScene().then((mainScene) => {
            this.currentScene = mainScene
        })
    }
}
