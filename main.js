import * as THREE from 'three';
import { GUI } from 'dat.gui';

import WebGL from 'three/addons/capabilities/WebGL.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import { Water } from 'three/examples/jsm/Addons.js';
import img from './resources/textures/Material.001_baseColor.jpeg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const orthographicCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
scene.add(camera);
scene.add(orthographicCamera);

const canvas = document.getElementById('Web_GL');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new GUI();
const stats = Stats();
document.body.appendChild(stats.dom);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.castShadow = true;
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 100, 0);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);
// light.shadow.bias = -0.001;
// light.shadow.mapSize.width = 2048;
// light.shadow.mapSize.height = 2048;
// light.shadow.camera.near = 0.1;
// light.shadow.camera.far = 500.0;
// light.shadow.camera.near = 0.5;
// light.shadow.camera.far = 500.0;
// light.shadow.camera.left = 100;
// light.shadow.camera.right = -100;
// light.shadow.camera.top = 100;
// light.shadow.camera.bottom = -100;


// addEventListener("DOMContentLoaded", (event) => {
//     controls = new FirstPersonControls(camera, renderer.domElement);
//     controls.lookSpeed = 0.8;
//     controls.movementSpeed = 5;
// });

var waterGeometry = new THREE.PlaneGeometry(1000, 1000, 200, 200);
var water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('/resources/textures/waternormals.jpg', function (texture) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        }),
        alpha: 1.0,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
        side: THREE.DoubleSide
    }
);

water.rotation.x = - Math.PI / 2;

scene.add(water);

const sceneLoader = new THREE.CubeTextureLoader();
const texture = sceneLoader.load([
    './resources/textures/skybox/right.jpg',
    './resources/textures/skybox/left.jpg',
    './resources/textures/skybox/top.jpg',
    './resources/textures/skybox/bottom.jpg',
    './resources/textures/skybox/front.jpg',
    './resources/textures/skybox/back.jpg',
]);
texture.encoding = THREE.sRGBEncoding;
scene.background = texture;

const material = new THREE.MeshBasicMaterial({
    color: '#ff0000'
})

       const GGtexture = new THREE.TextureLoader().load(img);

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
    // resource URL
    '/resources/models/submarine (3)/scene.gltf',
    // called when the resource is loaded
    function (gltf) {
        // gltf.scene.traverse((mesh) => {
        //     // You can also check for id / name / type here.
        //     mesh.material = new THREE.MeshStandardMaterial({ map: GGtexture });
        // });
        //const submarine = new THREE.Mesh( gltf.scene, material );
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);

        camera.position.set(10, 15, 10);
        camera.lookAt(0, 0, 0);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    // called while loading is progressing
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

        console.log('An error happened');

    }
);

// const mtlLoader = new MTLLoader()
// mtlLoader.load('/resources/models/backpack/backpack.mtl', (materials) => {
//     materials.preload()
//     // loading geometry
//     const objLoader = new OBJLoader()
//     objLoader.setMaterials(materials)
//     objLoader.load(
//         // resource URL
//         '/resources/models/backpack/backpack.obj',
//         // called when resource is loaded
//         function (object) {
//             scene.add(object);
//             camera.position.set(0, 5, 10);
//             camera.lookAt(0, 0, 0);
//         },
//         // called when loading is in progresses
//         function (xhr) {
//             console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         },
//         // called when loading has errors
//         function (error) {
//             console.log('An error happened');
//         }
//     );
// })

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    controls.update();
}
if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', () => onWindowResize(), false);