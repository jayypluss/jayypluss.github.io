import {DeviceOrientationCamera} from '@babylonjs/core/Cameras/deviceOrientationCamera'
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera'
import {
  Camera,
  Engine,
  FreeCamera,
  HemisphericLight, Mesh,
  PointerEventTypes,
  Scene, StandardMaterial, Texture,
  UniversalCamera, Vector4
} from "@babylonjs/core"
import {Vector3} from '@babylonjs/core/Maths/math.vector'
import '@babylonjs/inspector'
import '@babylonjs/loaders/glTF'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/loaders'

const loaderGif = require('../../assets/images/loader.gif')

import dodecahedronImage from '../../assets/images/textures/jayypluss_dodecaedron_flipped.png'

export default class MainScene {
  private canvas: HTMLCanvasElement
  private engine: Engine
  private scene: Scene
  private universalCam: UniversalCamera
  private freeCam: FreeCamera
  private arcRotateCam: ArcRotateCamera
  private deviceOrientationCam: DeviceOrientationCamera

  constructor() {
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    this.engine = new Engine(this.canvas, true, {
      stencil: true,
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    })

    this.scene = new Scene(this.engine)
    if (process.env.NODE_ENV === 'development') this.scene.debugLayer.show()
  }

  createCameras() {
    this.freeCam = new FreeCamera('freeCam', Vector3.Zero(), this.scene)

    this.universalCam = new UniversalCamera('universalCam', new Vector3(0, 5, 0), this.scene)
    this.universalCam.speed = 1
    this.universalCam.keysUp.push(87)
    this.universalCam.keysLeft.push(65)
    this.universalCam.keysDown.push(83)
    this.universalCam.keysRight.push(68)
    this.universalCam.keysUpward.push(81)
    this.universalCam.keysDownward.push(69)

    this.arcRotateCam = new ArcRotateCamera(
        'arcRotateCam',
        -Math.PI / 2,
        Math.PI / 2,
        5,
        Vector3.Zero(),
        this.scene,
    )
    // this.arcRotateCam.fov = 0.1

    this.deviceOrientationCam = new DeviceOrientationCamera(
        'deviceOrientationCam',
        new Vector3(0, 0, 1),
        this.scene,
    )
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.engine.resize()
    })

    this.scene.onPointerObservable.add((pointerWheelEvent: any) => {
      console.log('Pointer Wheel Event: ', pointerWheelEvent)
    }, PointerEventTypes.POINTERWHEEL)


    // Page Loaded
    window.addEventListener(
        'load',
        (loadEvent) => {
          console.log('Page loaded: ', loadEvent)
        },
        false,
    )

    window.addEventListener('click', (clickEvent) => {
        const pickResult = this.scene.pick(clickEvent.clientX, clickEvent.clientY)
        if (pickResult.hit) {
          const pickedMesh = pickResult.pickedMesh
          const pickedPoint = pickResult.pickedPoint
          const faceId = pickResult.faceId
          // if (this.scene.activeCamera instanceof ArcRotateCamera) this.scene.activeCamera.setTarget(faceId)
          console.log('Picked mesh: ', pickedMesh, ' at point: ', pickedPoint)
        }
    })

  }

  private mountScene() {
    const mat = new StandardMaterial('mat', this.scene)
    // mat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/spriteAtlas.png', this.scene)

    // const url = new URL(
    //         'public/dodecaedron.png',
    //     document.baseURI || self.location.href)

    console.log(dodecahedronImage)

    mat.diffuseTexture = new Texture(dodecahedronImage, this.scene)
    mat.diffuseTexture.coordinatesMode = 6

    const columns = 6
    const rows = 4

    //Face UVs
    const faceUV = []
    for (let i = 0; i < 12; i++) {
      const vector = new Vector4((i % 6) / columns, Math.floor(i / 6) / rows, (1 + i % 6) / columns, 1 / rows + Math.floor(i / 6) / rows)
      console.log('vector ', i, ': ', vector)
      faceUV[i] = vector
    }

    const dodecahedron = Mesh.CreatePolyhedron('dodecahedron', {type: 2, faceUV: faceUV}, this.scene)
    dodecahedron.material = mat

    if (this.scene.activeCamera instanceof UniversalCamera) this.scene.activeCamera.target = dodecahedron.position
  }

  // Runs Engine's Render Loop
  runRenderLoop() {
    this.engine.runRenderLoop(() => {
      this.scene.render()
      toggleLoader(false)
    })
  }

  async createScene() {
    console.log('Creating Scene')
    addLoader(createLoader())
    toggleLoader(true)
    this.createHemisphericLight()
    this.createCameras()
    this.activateCamera(this.arcRotateCam)

    this.mountScene()

    this.runRenderLoop()
    this.addEventListeners()
  }

  private createHemisphericLight(): HemisphericLight {
    const light = new HemisphericLight('HemisphericLight', new Vector3(500, 500, 500), this.scene)

    light.range = 1000
    light.intensity = 1

    return light
  }

  private activateCamera(camera: Camera): Camera {
    // if (camera instanceof ArcRotateCamera) {
    //   camera.lowerRadiusLimit = 50
    //   camera.upperRadiusLimit = 200
    //   camera.inputs.attached.mousewheel.detachControl()
    // }

    this.scene.activeCamera = camera
    this.scene.activeCamera.attachControl(this.canvas, true)

    return camera
  }

}

function addLoader(htmlImageElement: HTMLImageElement) {
  document.getElementsByTagName('body')[0].appendChild(htmlImageElement)
}

function createLoader() {
  const loader = document.createElement('img')

  loader.id = 'loader'
  loader.alt = 'Loading'
  loader.src = String(loaderGif)
  loader.style.width = '32px'
  loader.style.height = '32px'
  loader.style.position = 'fixed'
  loader.style.top = '50%'
  loader.style.left = '50%'
  loader.style.zIndex = '100'

  return loader
}

function toggleLoader(shouldShow: boolean) {
  document.getElementById('loader').style.display = shouldShow ? 'block' : 'none'
}
