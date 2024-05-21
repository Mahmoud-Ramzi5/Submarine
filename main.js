import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import SceneManager from './src/SceneManager';
import Ocean from './src/ocean';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import Physics from './src/Physics';
import Submarine from './src/Submarine';

import { Water } from 'three/examples/jsm/Addons.js';
import img from './resources/textures/Material.001_baseColor.jpeg';

/* Init scene */
const sceneManager = new SceneManager('Web_GL');



/* Load scene textures */

const sceneLoader = new THREE.CubeTextureLoader();
const sceneTexture = sceneLoader.load([
    './resources/textures/skybox/right.jpg',
    './resources/textures/skybox/left.jpg',
    './resources/textures/skybox/top.jpg',
    './resources/textures/skybox/bottom.jpg',
    './resources/textures/skybox/front.jpg',
    './resources/textures/skybox/back.jpg',
]);
sceneTexture.encoding = THREE.sRGBEncoding;
const sceneLoader2 = new THREE.CubeTextureLoader();
const sceneTexture2 = sceneLoader2.load([
    './resources/textures/underwater_skybox/side.jpg',
    './resources/textures/underwater_skybox/side.jpg',
    './resources/textures/underwater_skybox/top2.jpg',
    './resources/textures/underwater_skybox/floor.jpg',
    './resources/textures/underwater_skybox/side.jpg',
    './resources/textures/underwater_skybox/side.jpg',
]);
sceneTexture2.encoding = THREE.sRGBEncoding;

/* Init gui */
const gui = new GUI();


/* Submarine + Physics */
const S = new Submarine(2500000, 2800000, 73, 13, 5, 10.27, 0.04);
console.log(S);
const P = new Physics();
const first_position = new THREE.Vector3(0, 0, 0);
const last_position = new THREE.Vector3(16, 25, 60);
const submarine_weight = P.Weight(S.mass);
const submarine_buoyancy = P.Buoyancy(S.calcVolume());
// const submarine_drag = P.Drag(S.calcArea(), new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(S.max_speed), S.Cd);
// const submarine_thrust = P.Thrust(4*Math.PI, new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(S.max_speed), new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(S.max_speed+20));

const submarine_drag = P.Drag(S.calcArea(), new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(S.max_speed), S.Cd);
const submarine_thrust = P.Thrust(4 * Math.PI, new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(S.max_speed), new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(S.max_speed + 20));

// const a = P.NewtonSecondLaw(S.mass, submarine_weight, submarine_weight.clone().negate(), submarine_drag, submarine_thrust);
// const v = P.getAccerlationVelocity(new THREE.Vector3(0, 0, 0), a, 10);
// const x = P.getPosition(new THREE.Vector3(0, 0, 0), v, 10);

// console.log(a);
// console.log(v);
// console.log(x);

const a = P.NewtonSecondLaw(S.mass, submarine_weight, submarine_weight.clone().negate(), submarine_drag, submarine_thrust);
const v = P.getAccerlationVelocity(new THREE.Vector3(0, 0, 0), a, 10);
const x = P.getPosition(new THREE.Vector3(0, 0, 0), v, 10);

console.log(a);
console.log(v);
console.log(x);



console.log(P);
console.log(P.Weight(S.mass));
console.log(sceneManager.camera.position);

let controls = new OrbitControls(sceneManager.camera, sceneManager.getCanvas());
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 15;
controls.enablePan = false;
controls.maxPolarAngle = (Math.PI / 2) - 0.05;
controls.mouseButtons = {
    LEFT: '', MIDDLE: '', RIGHT: '',
};
controls.enableZoom = false;

controls.update();
/* Load submarine model */
const gltfLoader = new GLTFLoader();
// Load a glTF resource
let submarine_model = null;
gltfLoader.load(
    // resource URL
    '/resources/models/edited.glb',
    // called when the resource is loaded
    function (gltf) {
        // gltf.scene.traverse((mesh) => {
        //     // You can also check for id / name / type here.
        //     mesh.material = new THREE.MeshStandardMaterial({ map: GGtexture });
        // });
        //const submarine = new THREE.Mesh( gltf.scene, material );
        gltf.scene.scale.set(10, 10, 10);
        /* fixing the submarine angle */
        submarine_model = gltf.scene;
        submarine_model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        submarine_model.position.set(S.getPosition().x, S.getPosition().y, S.getPosition().z);
        sceneManager.scene.add(submarine_model);
        submarine_model.add(sceneManager.camera);
        sceneManager.directionalLight.target = submarine_model;
        sceneManager.camera.position.set(0, 5, 10);
        sceneManager.camera.lookAt(submarine_model.position.x, submarine_model.position.y, submarine_model.position.z);
        // function gg() {
        //     let i = 0;
        //     requestAnimationFrame(gg);
        //     if(i < 10) {
        //         const step = v.z/20;
        //         if (S.getPosition().z < x.z) {
        //             console.log(S.getPosition().z < x.z)

        //             S.setPosition(S.getPosition().x, S.getPosition().y, S.getPosition().z += step);
        //             submarine_model.position.set(S.getPosition().x, S.getPosition().y, S.getPosition().z);
        //             sceneManager.camera.position.z += step;
        //             sceneManager.camera.lookAt(S.getPosition().x, S.getPosition().y, S.getPosition().z);
        //         }
        //         i += 0.05;
        //     }
        // }
        // gg();
        let k = true;

        var startTime;
        var duration = 2000;              // milliseconds

        function loop(currentTime) {
            if (!startTime) startTime = currentTime;
            var t = (currentTime - startTime) / duration;
            // use t here, optionally clamp and/or add conditions
            requestAnimationFrame(loop);    // provides current high-res time as argument
        }
        var angleRad = Math.atan(x.x / x.z);
        const stepx = (v.x ) * Math.cos(angleRad);
        const stepz = (v.z ) * Math.cos(angleRad);
        let i = 0;
        function gg() {
            requestAnimationFrame(gg);
            if (i < 10) {
                if (k) {
                    //     submarine_model.rotateY(-angleRad);
                    console.log(angleRad);
                    console.log(stepx);
                    console.log(stepz);
                    k = false;
                }
                if (S.getPosition().z < x.z) {
                    S.setPosition(S.getPosition().x, S.getPosition().y, S.getPosition().z += stepz);
                    submarine_model.position.set(S.getPosition().x, S.getPosition().y, S.getPosition().z);
                    //sceneManager.camera.lookAt(S.getPosition().x, S.getPosition().y, S.getPosition().z);
                }
                if (S.getPosition().x < x.x) {
                    S.setPosition(S.getPosition().x += stepx, S.getPosition().y, S.getPosition().z);
                    submarine_model.position.x += stepx;
                    // gltf.scene.position.set(S.getPosition().x, S.getPosition().y, S.getPosition().z);
                    // sceneManager.camera.lookAt(S.getPosition().x, S.getPosition().y, S.getPosition().z);
                }
                i += 0.05;
            }
        }
        gg();

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

let submarine_control_speed = 2;
let rotationRad = (Math.PI / 180) * 4;
let rotationAxis = new THREE.Vector3(0, 1, 0);
/* trying to make the controls*/
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    console.log(P.getDistance(first_position, last_position));
    console.log(submarine_model.position);
    console.log(sceneManager.scene.position);
    var keyCode = event.which;
    if (keyCode == 87 /* W */) {
        submarine_model.translateZ(-submarine_control_speed);
        // const step = 2;
        // S.setPosition(S.getPosition().x, S.getPosition().y, S.getPosition().z -= step);
        // gltf.scene.position.set(S.getPosition().x, S.getPosition().y, S.getPosition().z);
        // sceneManager.camera.position.z -= step;
        // sceneManager.camera.lookAt(S.getPosition().x, S.getPosition().y, S.getPosition().z);
    } else if (keyCode == 83) {
        submarine_model.translateZ(submarine_control_speed);
    }
    else if (keyCode == 65) {
        submarine_model.position.x -= submarine_control_speed;
        submarine_model.rotateOnAxis(rotationAxis, rotationRad);
    } else if (keyCode == 68) {
        submarine_model.position.x += submarine_control_speed;
        submarine_model.rotateOnAxis(rotationAxis, -rotationRad);
    } else if (keyCode == 49) {
        submarine_model.position.y += submarine_control_speed;
    } else if (keyCode == 50) {
        submarine_model.position.y -= submarine_control_speed;
    } else if (keyCode == 82) {
        submarine_model.position.set(0, 0, 0);
    }
};

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
function render() {
    requestAnimationFrame(render);
    if (sceneManager.camera.position.y < 0) {
        sceneManager.scene.background = sceneTexture2;
    } else {
        sceneManager.scene.background = sceneTexture;
    }
}
render();

if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    sceneManager.animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
