import {Engine, Scene} from "@babylonjs/core"
import {MainGameScene} from "./scenes/MainGameScene"
import '../assets/css/global.css'
import {LoadingScene} from "./scenes/LoadingScene";

enum GameState { FIRST_LOAD = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

export class App {    // General Entire Application
    private _scene: Scene
    private _canvas: HTMLCanvasElement
    private _engine: Engine

    //Scene - related
    private _state = 0

    constructor() {
        this._canvas = App._createCanvas()
        document.body.appendChild(this._canvas)

        this._engine = new Engine(this._canvas, true)

        // this._engine.loadingScreen = new LoadingScreen("I'm loading!!")

        this._scene = new LoadingScene(this._engine)
        this._state = GameState.FIRST_LOAD

        this._engine.displayLoadingUI()

        const mainGameScene = new MainGameScene(this._engine)

        mainGameScene.whenReadyAsync().then(() => {
            this._engine.hideLoadingUI()
            //lastly set the current state to the start state and set the scene to the start scene
            this._scene.dispose()
            this._scene = mainGameScene
            this._state = GameState.GAME
        })

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render()
        })

        // new MainScene().createScene().then((mainScene) => {
        //     this.currentScene = mainScene
        // })
    }

    private static _createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.cursor = 'crosshair'
        canvas.style.position = 'fixed'
        canvas.id = "renderCanvas"
        return canvas
    }
}
