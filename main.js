import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import SceneManager from './src/SceneManager';
import Ocean from './src/ocean';
import { GUI } from 'dat.gui';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import Physics from './src/Physics';
import Submarine from './src/Submarine';

import { Water } from 'three/examples/jsm/Addons.js';
import img from './resources/textures/Material.001_baseColor.jpeg';

/* Init scene */
const sceneManager = new SceneManager('Web_GL');

/* Scene camera position */
sceneManager.camera.position.set(0, 100, 100);

/* Load scene textures */

const sceneLoader = new THREE.CubeTextureLoader();
const sceneTexture = sceneLoader.load([
'../resources/textures/skybox/right.jpg',
'../resources/textures/skybox/left.jpg',
'../resources/textures/skybox/top.jpg',
'../resources/textures/skybox/bottom.jpg',
'../resources/textures/skybox/front.jpg',
'../resources/textures/skybox/back.jpg',
]);
sceneTexture.encoding = THREE.sRGBEncoding;
const sceneLoader2 = new THREE.CubeTextureLoader();
const sceneTexture2 = sceneLoader2.load([
'../resources/textures/underwater_skybox/side.jpg',
'../resources/textures/underwater_skybox/side.jpg',
'../resources/textures/underwater_skybox/top2.jpg',
'../resources/textures/underwater_skybox/floor.jpg',
'../resources/textures/underwater_skybox/side.jpg',
'../resources/textures/underwater_skybox/side.jpg',
]);
sceneTexture2.encoding = THREE.sRGBEncoding;
if (sceneManager.camera.position.y<0){
    sceneManager.scene.background = sceneTexture;
}else{
    sceneManager.scene.background = sceneTexture2;
}


/* Init gui */
const gui = new GUI();

/* Load submarine model */
const gltfLoader = new GLTFLoader();
// Load a glTF resource
gltfLoader.load(
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
        /* fixing the submarine angle */
        gltf.scene.rotateY(1.6);
        /* trying to make the controls*/
        document.addEventListener("keydown", onDocumentKeyDown, false);
        function onDocumentKeyDown(event) {
            var keyCode = event.which;
            if (keyCode == 87) {
                gltf.scene.position.set(gltf.scene.position.x,gltf.scene.position.y,gltf.scene.position.z-= 2);
            } else if (keyCode == 83) {
                gltf.scene.position.set(gltf.scene.position.x,gltf.scene.position.y,gltf.scene.position.z+= 2);
            } else if (keyCode == 65) {
                gltf.scene.position.set(gltf.scene.position.x-= 2,gltf.scene.position.y,gltf.scene.position.z);
            } else if (keyCode == 68) {
                gltf.scene.position.set(gltf.scene.position.x+= 2,gltf.scene.position.y,gltf.scene.position.z);
            }else if (keyCode == 49){
                gltf.scene.position.set(gltf.scene.position.x,gltf.scene.position.y+=2,gltf.scene.position.z);
            } else if (keyCode == 50){
                gltf.scene.position.set(gltf.scene.position.x,gltf.scene.position.y-=2,gltf.scene.position.z);
            }else if (keyCode == 82) {
                gltf.scene.position.set(0, 0, 0);
            }
        };
        sceneManager.scene.add(gltf.scene);
        sceneManager.camera.lookAt(0, 0, 0);
        
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
        console.log(error);
    }
);

/* Submarine + Physics */
const S = new Submarine(2500000, 2800000, 73, 13, 5, 10.27, 0.04);
console.log(S);
const P = new Physics();
console.log(P);
console.log(P.Weight(S.mass));


/* Ocean */
const ocean = new Ocean(sceneManager.clock);
console.log(ocean);
ocean.initlize(sceneManager.scene);
ocean.animate();

// const box = new THREE.BoxGeometry(5000, 1000, 5000, 200, 100, 200);
// const boxMaterial = new THREE.MeshStandardMaterial({
//     color: 0x0000ff,
//     opacity: 0.5,
//     transparent: true,
//     side: THREE.DoubleSide
// });

// const boxMesh = new THREE.Mesh(box, boxMaterial);
// boxMesh.position.set(0, -500, 0);

// sceneManager.scene.add(boxMesh);

// /* Scene water */
// const waterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
// const waterTexture = new THREE.TextureLoader().load('/resources/textures/waternormals.jpg', function (texture) {
//     texture.format = THREE.RGBAFormat;
//     texture.magFilter = THREE.LinearFilter;
//     texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.generateMipmaps = true;
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     texture.offset.set(0, 0);
//     texture.needsUpdate = true
// });
// const water = new Water(
//     waterGeometry,
//     {
//         textureWidth: 512,
//         textureHeight: 512,
//         waterNormals: waterTexture,
//         alpha: 1.0,
//         sunDirection: sceneManager.directionalLight.position.clone().normalize(),
//         sunColor: 0xffffff,
//         waterColor: 0x001e0f,
//         distortionScale: 3.7,
//         fog: sceneManager.scene.fog !== undefined,
//         side: THREE.DoubleSide
//     }
// );

// /* Define uniform data */
// const uniformData = {
//     u_time: {
//         type: 'f',
//         value: sceneManager.clock.getElapsedTime(),
//     },
//     texture1: {
//         type: "t",
//         value: new THREE.TextureLoader().load('/resources/textures/waternormals.jpg', function (texture) {
//             texture.format = THREE.RGBAFormat;
//             texture.magFilter = THREE.LinearFilter;
//             texture.minFilter = THREE.LinearMipMapLinearFilter;
//             texture.generateMipmaps = true;
//             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//             texture.offset.set(0, 0);
//             texture.needsUpdate = true
//         })
//     }
// };

// const GGmaterial = new THREE.ShaderMaterial({
//     wireframe: false,
//     uniforms: uniformData,
//     vertexShader: `
//     varying vec2 vUv;
//     varying vec3 pos;
//     uniform float u_time;

//     void main()	{
//     vUv = uv;

//       vec4 result;
//       pos = position;

//       result = vec4(
//         position.x,
//         4.0*sin(position.z/4.0 + u_time) + position.y,
//         position.z,
//         1.0
//       );

//       gl_Position = projectionMatrix
//         * modelViewMatrix
//         * result;
//     }
//     `,
//     fragmentShader: `
//     uniform sampler2D texture1;
//     varying vec2 vUv;

//     varying vec3 pos;
//     uniform float u_time;
//     void main() {
//       if (pos.x >= 0.0) {
//         // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//         gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
//       } else {
//         // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
//         //gl_FragColor = vec4(0.0, abs(cos(u_time)), 0.0, 1.0);
//         gl_FragColor = texture2D(texture1, vUv);
//       }
//     }
//     `,
// });

// water.rotation.x = - Math.PI / 2;
// water.material = GGmaterial;
// sceneManager.scene.add(water);

//const orthographicCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
//scene.add(orthographicCamera);

//controls.target.set(0, 0, 0);

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

// const render = () => {
//     uniformData.u_time.value = sceneManager.clock.getElapsedTime();
//     window.requestAnimationFrame(render);
// };
// render();

const GGtexture = new THREE.TextureLoader().load(img);

/* MTL Loader */
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

if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    sceneManager.animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}