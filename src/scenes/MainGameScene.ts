import {
    AbstractMesh,
    ActionManager,
    Color3, Color4,
    Engine,
    ExecuteCodeAction,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion,
    Scene,
    SceneLoader,
    SceneOptions, ShadowGenerator, StandardMaterial,
} from "@babylonjs/core"
import {Vector3} from "@babylonjs/core/Maths/math.vector"
import '@babylonjs/inspector'
import {Environment} from '../environment'
import {Player} from '../characterController'
import {PlayerInput} from '../inputController'

import playerGlb from '../../assets/meshes/player.glb'

export class MainGameScene extends Scene {
    private _environment: Environment
    private assets: any
    private _player: Player
    private _input: PlayerInput
    private galleryPlayerIsInside: string = ""

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

        //--START LOADING AND SETTING UP THE GAME DURING THIS SCENE--
        var finishedLoading = false;
        this._setUpGame().then(async (res) => {
            finishedLoading = true;
            await this._initializeGameAsync()
        })
    }

    private async _setUpGame() { //async
        //--CREATE ENVIRONMENT--
        const environment = new Environment(this);
        this._environment = environment;
        //Load environment and character assets
        await this._environment.load(); //environment
        await this._loadCharacterAssets(); //character
        
        this._environment.collisionMeshes.forEach((collisionMesh: AbstractMesh) => {
            collisionMesh.actionManager = new ActionManager(this)
            
            collisionMesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger, 
                        parameter: { 
                            mesh: this.assets.mesh, 
                            usePreciseIntersection: true
                        }
                    }, 
                    () => {
                        // g_003_trigger
                        console.log('Player entered trigger Mesh: ', collisionMesh.name)
                        console.log('Collision Mesh parent: ', collisionMesh.parent.name)

                        if (collisionMesh.name.includes('inside_trigger')) {
                            this.galleryPlayerIsInside = collisionMesh.parent.name
                        }
                        
                        const parent = this.getMeshByName(collisionMesh.parent.name)
                        parent.material = this.getMaterialByName('gallery_material_faded')
                        parent?.getChildMeshes()?.forEach((childMesh: AbstractMesh) => {

                            if (childMesh.name.includes('g_') && !childMesh.name.includes('trigger') && !childMesh.name.includes('title')) {
                                childMesh.isVisible = true
                            }

                        })
                    }
                )
            )

            collisionMesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionExitTrigger, 
                        parameter: { 
                            mesh: this.assets.mesh, 
                            usePreciseIntersection: true
                        }
                    }, 
                    () => {
                        if (collisionMesh.name.includes('inside_trigger')) {
                            this.galleryPlayerIsInside = ''
                        }

                        if (collisionMesh.name.includes('front_trigger') && this.galleryPlayerIsInside == '') {

                            const parent = this.getMeshByName(collisionMesh.parent.name)
                            parent.material = this.getMaterialByName('gallery_material')
                            parent?.getChildMeshes()?.forEach((childMesh: AbstractMesh) => {
    
                                if (childMesh.name.includes('g_') && !childMesh.name.includes('trigger') && !childMesh.name.includes('title')) {
                                    childMesh.isVisible = false
                                }
    
                            })
    
                        }

                        console.log('Player exited trigger: ', collisionMesh.name)
                    }
                )
            )
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
    
    //load the character model
    private async _loadCharacterAssets(): Promise<any> {

        async function loadCharacter() {
            //collision mesh
            const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, this)
            outer.isVisible = false
            outer.isPickable = false
            outer.checkCollisions = true

            //move origin of box collider to the bottom of the mesh (to match player mesh)
            outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
            //for collisions
            outer.ellipsoid = new Vector3(1, 1.5, 1)
            outer.ellipsoidOffset = new Vector3(0, 1.5, 0)

            outer.rotationQuaternion = new Quaternion(0, 1, 0, 0) // rotate the player mesh 180 since we want to see the back of the player
            
            //--IMPORTING MESH--
            return SceneLoader.ImportMeshAsync('', '', playerGlb, this, undefined, '.glb').then((result) =>{
                const root = result.meshes[0]
                //body is our actual player mesh
                const body = root
                body.parent = outer
                body.isPickable = false
                body.getChildMeshes().forEach(m => {
                    m.isPickable = false
                })

                result.animationGroups[1].loopAnimation = true
                result.animationGroups[1].play(true)
                result.animationGroups[4].loopAnimation = false

                //return the mesh and animations
                return {
                    mesh: outer as Mesh,
                    animationGroups: result.animationGroups
                }
            });
        }

        return loadCharacter().then(assets => {
            this.assets = assets
        })
    }
}
