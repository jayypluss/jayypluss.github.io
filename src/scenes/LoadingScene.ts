import {Color4, Engine, FreeCamera, Scene, SceneOptions} from "@babylonjs/core"
import {Vector3} from "@babylonjs/core/Maths/math.vector"
import '@babylonjs/inspector'

export class LoadingScene extends Scene {
    constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options)

        this.detachControl()
        this.clearColor = new Color4(0, 0, 0, 1)
        const camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this)
        camera.setTarget(Vector3.Zero())
    }
}
