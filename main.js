import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import SceneManager from './src/SceneManager';
import ModelLoaders from './src/ModelLoaders';
import Ocean from './src/ocean';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Physics from './src/Physics';
import Submarine from './src/Submarine';

import { Water } from 'three/examples/jsm/Addons.js';
import img from './resources/textures/Material.001_baseColor.jpeg';

/* Init scene */
const sceneManager = new SceneManager('Web_GL');

/* Init model loaders */
const modelLoaders = new ModelLoaders();

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
const submarine = new Submarine(2500000, 2800000, 73, 13, 5, 10.27, 0.04);
console.log('Submarine');
console.log(submarine);

const P = new Physics();
const first_position = new THREE.Vector3(0, 0, 0);
const last_position = new THREE.Vector3(16, 25, 60);

const submarine_weight = P.Weight(submarine.mass);
const submarine_submerged_weight = P.Weight(submarine.mass_submerged);
const submarine_buoyancy = P.Buoyancy(submarine.calcVolume());
console.log(submarine_weight)
console.log(submarine_buoyancy)
// const submarine_drag = P.Drag(submarine.calcArea(), new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed), submarine.Cd);
// const submarine_thrust = P.Thrust(4*Math.PI, new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed), new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed+20));

const submarine_drag = P.Drag(submarine.calcArea(), new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(submarine.max_speed), submarine.Cd);
const submarine_thrust = P.Thrust(4 * Math.PI, new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(submarine.max_speed), new THREE.Vector3(0.5, 0, 0.25).normalize().multiplyScalar(submarine.max_speed + 20));


const a = P.NewtonSecondLaw(submarine.mass, submarine_submerged_weight, submarine_weight.clone().negate(), submarine_drag, submarine_drag.clone().negate());
//const a = P.NewtonSecondLaw(submarine.mass, submarine_weight, submarine_submerged_weight.clone().negate(), submarine_drag, submarine_thrust);
//const a = P.NewtonSecondLaw(submarine.mass, submarine_submerged_weight, submarine_weight.clone().negate(), submarine_drag, submarine_thrust);
const v = P.getAccerlationVelocity(new THREE.Vector3(0, 0, 0), a, 10);
const x = P.getPosition(new THREE.Vector3(0, 0, 0), v, 10);

console.log(a);
console.log(v);
console.log(x);

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
async function loadSubmarineModel() {
    // Load a glTF resource
    const submarine_model = await modelLoaders.load_GLTF_Model('/resources/models/edited.glb');
    if (submarine_model) {
        submarine_model.scale.set(10, 10, 10);
        submarine_model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        submarine.setModel(submarine_model);

        sceneManager.scene.add(submarine.model);
        submarine.model.add(sceneManager.camera);
        sceneManager.directionalLight.target = submarine.model;
        sceneManager.camera.position.set(0, 5, 10);
        sceneManager.camera.lookAt(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);
        moveSubmarine()
    }
}
loadSubmarineModel();


// var startTime;
// var duration = 2000;              // milliseconds

// function loop(currentTime) {
//     if (!startTime) startTime = currentTime;
//     var t = (currentTime - startTime) / duration;
//     // use t here, optionally clamp and/or add conditions
//     requestAnimationFrame(loop);    // provides current high-res time as argument
// }

function moveSubmarine() {
    var angleRadXZ = Math.atan(x.x / x.z);
    var angleRad = angleRadXZ / 500;
    var angleRadYZ = Math.atan(x.y / x.z);
    console.log(angleRadYZ);
    var angleRad2 = angleRadYZ / 1000;
    // const stepx = (v.x) * Math.sin(angleRad);
    // const stepz = (v.z) * Math.cos(angleRad);
    // const stepy = (v.y) * Math.sin(angleRad2);

    let GG = 0;
    var stepx = v.x / 50;
    var stepy = v.y / 50;
    var stepz = v.z / 50;

    let j = 0;
    let i = 10;
    let k = 10;
    function gg() {
        if (a.x == 0 && a.y == 0 && a.z == 0) {
            return;
        }
        requestAnimationFrame(gg);
        console.log(j);
        if (j < 10) {
            if (!isNaN(angleRadXZ)) {
                submarine.rotateY(angleRad);
                j += 0.02;
                if (j >= 9.98) {
                    i = 0;
                }
            } else {
                j = 10;
                i = 0;
            }

        }

        if (i < 10) {
            if (submarine.getPosition().z < x.z) {
                submarine.setPositionZ(submarine.getPosition().z += stepz);
                //submarine_model.position.z += stepz;
            }
            if (submarine.getPosition().x < x.x) {
                submarine.setPositionX(submarine.getPosition().x += stepx);
                //submarine_model.position.x += stepx;
            }
            if (submarine.getPosition().z > x.z) {
                submarine.setPositionZ(submarine.getPosition().z += stepz);
                //submarine_model.position.z += stepz;
            }
            if (submarine.getPosition().x > x.x) {
                submarine.setPositionX(submarine.getPosition().x += stepx);
                //submarine_model.position.x += stepx;
            }

            if (submarine.getPosition().y > x.y) {
                submarine.setPositionY(submarine.getPosition().y += stepy);
                if (i > 2 && i < 6) {

                    submarine.rotateX(angleRad2);
                    submarine.rotateX(angleRad2);
                }
                else if (i > 5.9 & i < 6.1) {
                    k = 0;
                }


                //submarine_model.position.y += stepy;
                console.log(submarine.getPosition().y);
                console.log('GG');
                GG += angleRad2;
                //console.log(angleRadYZ);
                //console.log(GG);
                // gltf.scene.position.set(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);
                // sceneManager.camera.lookAt(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);
            }
            if (submarine.getPosition().y < x.y) {
                submarine.setPositionY(submarine.getPosition().y += stepy);
                if (i > 0 && i < 4) {

                    submarine.rotateX(angleRad2);
                    submarine.rotateX(angleRad2);
                }
                else if (i > 3.9 & i < 4.1) {
                    k = 0;
                }


                //submarine_model.position.y += stepy;
                console.log(submarine.position.y);
                GG += angleRad2;
                //console.log(angleRadYZ);
                //console.log(GG);
                // gltf.scene.position.set(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);
                // sceneManager.camera.lookAt(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);
            }
            i += 0.02;
        }

        if (k < 4) {
            submarine.rotateX(-angleRad2);
            submarine.rotateX(-angleRad2);
            k += 0.02;
        }
    }
    gg();
}

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

/* GUI */
const PositionFolder = gui.addFolder('Position');
PositionFolder.add(submarine.getPosition(), 'x')
    .name('Submarine X coords').onChange((value) => submarine.setPositionX(value));
PositionFolder.add(submarine.getPosition(), 'y')
    .name('Submarine Y coords').onChange((value) => submarine.setPositionY(value));
PositionFolder.add(submarine.getPosition(), 'z')
    .name('Submarine Z coords').onChange((value) => submarine.setPositionZ(value));
PositionFolder.open();

const SubmarineFolder = gui.addFolder('Submarine');
SubmarineFolder.add(submarine, 'mass', 0, 100000000)
    .name('Surfaced mass').onChange((value) => submarine.setMass(value));

SubmarineFolder.add(submarine, 'mass_submerged', 0, 100000000)
    .name('Submerged mass').onChange((value) => submarine.setSubmergedMass(value));

SubmarineFolder.add(submarine, 'length', 0, 200)
    .name('Length').onChange((value) => submarine.setLength(value));

SubmarineFolder.add(submarine, 'height', 0, 20)
    .name('Height').onChange((value) => submarine.setHeight(value));

SubmarineFolder.add(submarine, 'radius', 0, 20)
    .name('Radius').onChange((value) => submarine.setRadius(value));

SubmarineFolder.add(submarine, 'max_speed', 0, 20)
    .name('Max Speed').onChange((value) => submarine.setMaxSpeed(value));

SubmarineFolder.add(submarine, 'Cd', 0, 2)
    .name('Drag Coefficient').onChange((value) => submarine.setCd(value));


/* Text */
const textDiv = document.getElementById('text');


function render() {
    requestAnimationFrame(render);
    if (submarine.position.y < 0) {
        sceneManager.scene.background = sceneTexture2;
    } else {
        sceneManager.scene.background = sceneTexture;
    }
    //water.material.uniforms['time'].value += 0.01;
    textDiv.innerHTML = `X = ${submarine.position.x}, 
Y = ${submarine.position.y}, Z = ${submarine.position.z}`
    console.log(submarine.mass)

}
render();

if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    sceneManager.animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
