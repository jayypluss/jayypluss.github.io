import {Engine, HemisphericLight, Mesh, MeshBuilder, Scene, SceneOptions} from "@babylonjs/core"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera"
import {Vector3} from "@babylonjs/core/Maths/math.vector"
import '@babylonjs/inspector'

export class MainGameScene extends Scene {
    constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options)

        this.activeCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this)
        this.activeCamera.attachControl(engine.getRenderingCanvas(), true)
        const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this)
        const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this)

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (process.env.NODE_ENV === 'development' && ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73)
                this.debugLayer.isVisible() ? this.debugLayer.hide() : this.debugLayer.show()

        })
    }
}
