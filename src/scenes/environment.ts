import {Mesh, Scene} from '@babylonjs/core'
import {Vector3} from '@babylonjs/core/Maths/math.vector'

export class Environment {
    private _scene: Scene

    constructor(scene: Scene) {
        this._scene = scene
    }

    public async load() {
        const ground = Mesh.CreateBox("ground", 24, this._scene)
        ground.scaling = new Vector3(1,.02,1)
        return ground
    }
}
