import {AbstractMesh, ActionManager, Color3, ExecuteCodeAction, Mesh, Scene, SceneLoader, SetValueAction, StandardMaterial, Texture} from '@babylonjs/core'
import {Vector3} from '@babylonjs/core/Maths/math.vector'

import envSettingGlb from '../assets/meshes/gallery_playground_01_cut_through_triggers.glb'
// import envSettingGlb from '../assets/meshes/envSetting.glb'

export class Environment {
    private _scene: Scene
    public collisionMeshes: AbstractMesh[] = []

    constructor(scene: Scene) {
        this._scene = scene
    }

    public async load() {
        const assets = await this._loadAsset();
        
        //Loop through all environment meshes that were imported
        assets.allMeshes.forEach(m => {
            m.receiveShadows = true
            m.checkCollisions = true

            if (m.name == "ground") { //dont check for collisions, dont allow for raycasting to detect it(cant land on it)
                m.checkCollisions = false
                m.isPickable = false
            }

            if (m.name.includes("trigger")) {
                m.isVisible = false
                m.isPickable = false
                m.checkCollisions = false
                this.collisionMeshes.push(m)
            }
        });

        // const ground = Mesh.CreateBox("ground", 24, this._scene)
        // ground.scaling = new Vector3(5, .02, 5)
        // const material = new StandardMaterial('groundMaterial', this._scene)
        // const texture = new Texture('https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/textures/grass.png', this._scene)
        // texture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
        // texture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
        // material.diffuseTexture = texture
        // material.backFaceCulling = false;//Allways show the front and the back of an element
        // // material.diffuseColor = new Color3(.2, .5, .2)
        // material.specularColor = new Color3(.05, .05, .05)
        // ground.material = material


        // //Loop through all environment meshes that were imported
        // assets.allMeshes.forEach((m) => {
        //     m.receiveShadows = true;
        //     m.checkCollisions = true;
        // });


        // return ground

        return assets
    }

    async _loadAsset() {
        //loads game environment
        const result = await SceneLoader.ImportMeshAsync('', '', envSettingGlb, this._scene, undefined, '.glb');
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes,
        }
    }
}
