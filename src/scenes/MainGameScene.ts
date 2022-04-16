import {
    Color3, Color4,
    Engine,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion,
    Scene,
    SceneOptions, ShadowGenerator,
    StandardMaterial
} from "@babylonjs/core"
import {Vector3} from "@babylonjs/core/Maths/math.vector"
import '@babylonjs/inspector'
import {Environment} from './environment'
import {Player} from '../characterController'
import {PlayerInput} from '../inputController'

export class MainGameScene extends Scene {
    private _environment: Environment
    private assets: any
    private _player: Player
    private _input: PlayerInput

    constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options)

        // this.activeCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this)
        // this.activeCamera.attachControl(engine.getRenderingCanvas(), true)

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (process.env.NODE_ENV === 'development' && ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73)
                this.debugLayer.isVisible() ? this.debugLayer.hide() : this.debugLayer.show()

        })

        this._environment =  new Environment(this)

        this.loadEnvironment().then(async (ground) => {
            console.log('loaded ground')
            this.assets = this._loadCharacterAssets() //character
            await this._initializeGameAsync()
        })
    }

    private async _initializeGameAsync(): Promise<void> {
        //temporary light to light the entire scene
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this)

        const light = new PointLight("sparklight", new Vector3(0, 0, 0), this)
        light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825)
        light.intensity = 35
        light.radius = 1

        const shadowGenerator = new ShadowGenerator(1024, light)
        shadowGenerator.darkness = 0.4

        //--INPUT--
        this._input = new PlayerInput(this) //detect keyboard/mobile inputs

        //Create the player
        this._player = new Player(this.assets, this, shadowGenerator, this._input) //dont have inputs yet so we dont need to pass it in

        this.activeCamera = this._player.activatePlayerCamera()
    }

    async loadEnvironment() {
        return this._environment.load() //environment
    }

    private _loadCharacterAssets() {
        //collision mesh
        const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, this)
        outer.isVisible = false
        outer.isPickable = false
        outer.checkCollisions = true

        //move origin of box collider to the bottom of the mesh (to match imported player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

        //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1)
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0)

        outer.rotationQuaternion = new Quaternion(0, 1, 0, 0) // rotate the player mesh 180 since we want to see the back of the player

        const box = MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)] }, this)
        box.position.y = 1.5
        box.position.z = 1

        const body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, this)
        const bodymtl = new StandardMaterial("red", this)
        bodymtl.diffuseColor = new Color3(0.8, 0.5, 0.5)
        body.material = bodymtl
        body.isPickable = false
        body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)) // simulates the imported mesh's origin

        //parent the meshes
        box.parent = body
        body.parent = outer

        return {
            mesh: outer as Mesh
        }
    }
}
