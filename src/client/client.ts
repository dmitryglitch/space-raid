import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Color} from "three";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const loader = new THREE.TextureLoader();

scene.background = loader.load("/textures/sky.jpg")

let jewel = new THREE.Object3D()
const jewelTexture = loader.load("/textures/strike_red.png");
const objLoader = new OBJLoader()

objLoader.load(
    'models/strike_red.obj',
    (object: THREE.Group) => {
        object.traverse( (child) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material =
                    new THREE.MeshMatcapMaterial({
                        map: jewelTexture,
                    })
            }
        })
        jewel = object
        scene.add(jewel)
    },
    (pe) => {
        console.log((pe.loaded / pe.total) * 100 + '% loaded')
    },
    (e) => {
        console.log(e)
    }
)

// movement - please calibrate these values
const xSpeed = 0.5;
const ySpeed = 0.5;

const onDocumentKeyDown = (e: KeyboardEvent) => {
    const keyCode = e.keyCode;

    console.log("keyCode", keyCode)

    if (keyCode == 87) {
        jewel.position.y += ySpeed;
    } else if (keyCode == 83) {
        jewel.position.y -= ySpeed;
    } else if (keyCode == 65) {
        jewel.position.x += xSpeed;
    } else if (keyCode == 68) {
        jewel.position.x -= xSpeed;
    } else if (keyCode == 32) {
        jewel.position.set(0, 0, 0);
    }
};
document.addEventListener("keydown", onDocumentKeyDown, false);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = jewel.position.x
camera.position.y = jewel.position.y + 20
camera.position.z = jewel.position.z - 30

const controls = new OrbitControls(camera, renderer.domElement)
// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({map: texture})
//
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    //
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
