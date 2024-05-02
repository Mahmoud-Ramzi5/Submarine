import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const mtlLoader = new MTLLoader()
mtlLoader.load('/models/backpack/backpack.mtl', (materials) => {
    materials.preload()
    // loading geometry
    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.load(
        // resource URL
        '/models/backpack/backpack.obj',
        // called when resource is loaded
        function (object) {
            scene.add(object);
            camera.position.z = 5;
            camera.lookAt(0, 0, 0);
        },
        // called when loading is in progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        function (error) {
            console.log('An error happened');
        }
    );
})

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}