import {AbstractMesh, ActionManager, Color3, ExecuteCodeAction, Material, Mesh, PBRMaterial, Scene, SceneLoader, SetValueAction, StandardMaterial, Texture} from '@babylonjs/core'
import {Vector3} from '@babylonjs/core/Maths/math.vector'

import envSettingGlb from '../assets/meshes/gallery_playground_triggers.glb'
// import envSettingGlb from '../assets/meshes/envSetting.glb'

export class Environment {
    private _scene: Scene
    public collisionMeshes: AbstractMesh[] = []
    public galleries: AbstractMesh[] = []

    constructor(scene: Scene) {
        this._scene = scene
    }

    public async load() {
        const assets = await this._loadAsset();
        
        const galleryMaterial = new StandardMaterial('gallery_material', this._scene)
        galleryMaterial.alpha = 0.4

        
        const galleryMaterialFaded = new StandardMaterial('gallery_material_faded', this._scene)
        galleryMaterialFaded.alpha = 0.2

        
        const groundMaterial = new StandardMaterial('ground_material', this._scene)
        groundMaterial.emissiveColor = new Color3(0.224, 0.404, 0.231)
        groundMaterial.diffuseColor = new Color3(0, 0, 0)
        groundMaterial.specularColor = new Color3(0, 0, 0)
        // groundMaterial.ambientColor = new Color3(.98,.56, .37)
        
        //Loop through all environment meshes that were imported
        assets.allMeshes.forEach(m => {
            m.receiveShadows = true
            m.checkCollisions = true

            if (m.name == "floor") {
                m.material = groundMaterial
            }

            if (m.name.includes("gallery")) {
                m.material = galleryMaterial
                this.galleries.push(m)
            }

            if (m.name.includes("trigger")) {
                m.isVisible = false
                m.isPickable = false
                m.checkCollisions = false

                this.collisionMeshes.push(m)
            }

            if (m.name.includes('g_') && !m.name.includes('trigger') && !m.name.includes('title')) {
                m.isVisible = false
                m.isPickable = true
                m.checkCollisions = false
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
