import {Color3, Mesh, Scene, StandardMaterial, Texture} from '@babylonjs/core'
import {Vector3} from '@babylonjs/core/Maths/math.vector'

export class Environment {
    private _scene: Scene

    constructor(scene: Scene) {
        this._scene = scene
    }

    public async load() {
        const ground = Mesh.CreateBox("ground", 24, this._scene)
        ground.scaling = new Vector3(5, .02, 5)
        const material = new StandardMaterial('groundMaterial', this._scene)
        const texture = new Texture('https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/textures/grass.png', this._scene)
        texture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
        texture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
        material.diffuseTexture = texture
        material.backFaceCulling = false;//Allways show the front and the back of an element
        // material.diffuseColor = new Color3(.2, .5, .2)
        material.specularColor = new Color3(.05, .05, .05)
        ground.material = material
        return ground
    }
}
