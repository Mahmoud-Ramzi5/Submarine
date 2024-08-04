import * as THREE from 'three';

import WebGL from 'three/addons/capabilities/WebGL.js';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import SceneManager from './src/SceneManager';
import ModelLoaders from './src/ModelLoaders';
import Submarine from './src/Submarine';
import Physics from './src/Physics';
import Ocean from './src/ocean';

import SubmarineControls from './src/SubmarineControls';



/* Init gui */
const gui = new GUI({ width: 350 });

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

/* OrbitControls */
const orbitControls = new OrbitControls(sceneManager.camera, sceneManager.getRendererDom());
orbitControls.enableDamping = true;
// orbitControls.minDistance = 5;
// orbitControls.maxDistance = 15;
orbitControls.enablePan = true;
orbitControls.enableZoom = false;
// orbitControls.maxPolarAngle = (Math.PI / 2) - 0.05;
orbitControls.update();
// orbitControls.mouseButtons = {
//     LEFT: '', MIDDLE: '', RIGHT: '',
// };


/* Submarine */
const SpeedVec = new THREE.Vector3(0, 0, 0);
const submarine = new Submarine(2500000, 2800000, 73, 13, 5, 10.27, 0.04);

var submarineControls;
// Load submarine model
async function loadSubmarineModel() {
    // Load a glTF resource
    const submarine_model = await modelLoaders.load_GLTF_Model('/resources/models/Submarine.glb');
    if (submarine_model) {
        submarine_model.scale.set(10, 10, 10);
        submarine_model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        submarine.setModel(submarine_model);

        sceneManager.scene.add(submarine.model);
        sceneManager.scene.add(submarine.cube);
        //submarine.model.add(sceneManager.camera);
        sceneManager.directionalLight.target = submarine.model;

        orbitControls.target.set(
            submarine.getPosition().x,
            submarine.getPosition().y,
            submarine.getPosition().z
        );
        sceneManager.camera.position.set(
            submarine.getPosition().x - 10,
            submarine.getPosition().y + 25,
            submarine.getPosition().z + 100
        );
        // sceneManager.camera.lookAt(
        //     submarine.getPosition().x,
        //     submarine.getPosition().y,
        //     submarine.getPosition().z
        // );

        submarineControls = new SubmarineControls(submarine, 'mixer', 'animationsMap', orbitControls, sceneManager.camera, 'Idle')
    }
}
loadSubmarineModel();

// Load iceberg model
async function loadIcebergModel() {
    // Load a glTF resource
    const iceberg_model = await modelLoaders.load_GLTF_Model('/resources/models/iceberg/scene.gltf');
    if (iceberg_model) {
        iceberg_model.scale.set(200, 200, 200);
        iceberg_model.position.set(0, -100, -300);
        iceberg_model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model);
    }
}
loadIcebergModel();

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
);
sphere1.position.set(0, -30, -300)
let spherebb = new THREE.Sphere(sphere1.position, 100);
sceneManager.scene.add(sphere1);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
);
cube1.position.set(0, -175, -300)
let cube1bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1bb.setFromObject(cube1);
sceneManager.scene.add(cube1);


/* Collision */
var cubeCollision = false;
var sphereCollision = false;
function checkCollision() {
    if (submarine.cubebb.intersectsBox(cube1bb)) {
        cubeCollision = true
    } else {
        cube1.material.transparent = true;
        cube1.material.opacity = 0;
        cubeCollision = false;
    }
    if (submarine.cubebb.intersectsSphere(spherebb)) {
        sphereCollision = true;
    } else {
        sphere1.material.color.setHex(0xff0000);
        sphere1.material.transparent = true;
        sphere1.material.opacity = 0;
        sphereCollision = false;
    }
}

// Actions for submarine movement
const actions = {
    dive: false,
    float: false,
    stay: true
}

/* Physics */
const physics = new Physics();
function calcPhysics() {
    const submarine_weight = physics.Weight(submarine.mass);
    const submarine_submerged_weight = physics.Weight(submarine.mass_submerged);
    const submarine_buoyancy = physics.Buoyancy(submarine.calcVolume());

    const submarine_drag = physics.Drag(submarine.calcArea(), submarine.Cd,
        SpeedVec.clone().normalize().multiplyScalar(submarine.max_speed));

    const submarine_thrust = physics.Thrust(4 * Math.PI,
        SpeedVec.clone().normalize().multiplyScalar(submarine.max_speed),
        SpeedVec.clone().normalize().multiplyScalar(submarine.max_speed + 20));

    // const submarine_drag = physics.Drag(submarine.calcArea(), 
    //     new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed), submarine.Cd);

    // const submarine_thrust = physics.Thrust(4*Math.PI, 
    //     new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed), 
    //     new THREE.Vector3(0, 0, 1).normalize().multiplyScalar(submarine.max_speed+20));

    // const acceleration = physics.NewtonSecondLaw(
    //     submarine.mass,
    //     submarine_submerged_weight,
    //     submarine_weight.clone().negate(),
    //     submarine_drag,
    //     submarine_drag.clone().negate()
    // );
    // const acceleration = physics.NewtonSecondLaw(
    //     submarine.mass,
    //     submarine_weight,
    //     submarine_submerged_weight.clone().negate(),
    //     submarine_drag,
    //     submarine_thrust
    // );

    const startPosition = new THREE.Vector3(0, 0, 0);
    const startVelocity = new THREE.Vector3(0, 0, -1);
    startPosition.set(submarine.getPosition().x, submarine.getPosition().y, submarine.getPosition().z);

    var acceleration;
    // Action is dive
    if (actions['dive']) {
        if (submarine.getPosition().y > -1000) {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_submerged_weight,
                submarine_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        } else {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_submerged_weight,
                submarine_submerged_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        }
    }
    // Action is float
    else if (actions['float']) {
        if (submarine.getPosition().y < 0) {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_weight,
                submarine_submerged_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        }
        else {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_weight,
                submarine_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        }
    }
    // Action is stay
    else {
        if (submarine.getPosition().y < 0) {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_submerged_weight,
                submarine_submerged_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        } else {
            acceleration = physics.NewtonSecondLaw(
                submarine.mass,
                submarine_weight,
                submarine_weight.clone().negate(),
                submarine_drag,
                submarine_thrust
            );
        }
    }

    const velocity = physics.getAccerlationVelocity(startVelocity, acceleration);
    const positionCoordinates = physics.getPosition(startPosition, velocity);

    // Check Coordinates
    if (positionCoordinates.y > 0) {
        console.log('Submarine can not fly');
        positionCoordinates.y = 0;
    } else if (positionCoordinates.y < -1000) {
        console.log('Submarine can not go deeper');
        positionCoordinates.y = -1000;
    } else { }

    console.log(acceleration);
    console.log(velocity);
    console.log(positionCoordinates);
    console.log(sceneManager.camera.position);

    moveSubmarine(startPosition, startVelocity, acceleration, velocity, positionCoordinates);
}

// var startTime;
// var duration = 2000;              // milliseconds

// function loop(currentTime) {
//     if (!startTime) startTime = currentTime;
//     var t = (currentTime - startTime) / duration;
//     // use t here, optionally clamp and/or add conditions
//     requestAnimationFrame(loop);    // provides current high-res time as argument
// }

function moveSubmarine(sPos, sV, a, v, x) {
    const MinY = -1000;
    const MaxY = 0;

    var sV2 = sV.clone();
    var v2 = v.clone();

    var startRadXZ0 = Math.atan2(sV2.x, sV2.z);
    var startRadXZ1 = Math.atan2(v2.x, v2.z);

    // var startRadXZ = Math.atan(sPos.x / sPos.z) - Math.PI;
    // var angleRadXZ = Math.atan(x.x / x.z);
    // if (angleRadXZ > 0) {
    //     angleRadXZ = Math.atan(x.x / x.z) - Math.PI;
    // } else {
    //     angleRadXZ = Math.atan(x.x / x.z) + Math.PI;
    // }

    var angleRad, angleRadXZ = startRadXZ1 - startRadXZ0;
    if (angleRadXZ > 3.14) {
        angleRadXZ = Math.atan(x.x / x.z) - Math.PI;
    } else if (angleRadXZ < -3.14) {
        angleRadXZ = Math.atan(x.x / x.z) + Math.PI;
    } else { }

    if (angleRadXZ < -1.5 || angleRadXZ > 1.5) {
        angleRad = angleRadXZ / 1000;
    } else {
        angleRad = angleRadXZ / 1000;
    }

    var angleRadYZ = Math.atan(x.y / x.z);
    var angleRad2 = angleRadYZ / 2000;

    var stepx = v.x / 100;
    var stepy = v.y / 100;
    var stepz = v.z / 100;

    let j = 0;
    let i = physics.getTime();
    let k = physics.getTime();

    function rotate() {
        requestAnimationFrame(rotate);
        if (!cubeCollision && !sphereCollision) {
            if (angleRadXZ < -1.5 || angleRadXZ > 1.5) {
                if (j < 10) {
                    if (!isNaN(angleRadXZ)) {
                        if (Math.ceil(startRadXZ0) != Math.ceil(startRadXZ1)) {
                            submarine.rotateY(angleRad);
                            j += 0.01;
                            if (j >= 10 - 0.01) {
                                i = 0;
                            }
                        } else {
                            j = 10;
                            i = 0;
                        }
                    } else {
                        j = 10;
                        i = 0;
                    }
                }
            } else {
                if (j < 10) {
                    if (!isNaN(angleRadXZ)) {
                        if (Math.ceil(startRadXZ0) != Math.ceil(startRadXZ1)) {
                            submarine.rotateY(angleRad);
                            j += 0.01;
                            if (j >= 10 - 0.01) {
                                i = 0;
                            }
                        } else {
                            j = 10;
                            i = 0;
                        }
                    } else {
                        j = 10;
                        i = 0;
                    }
                }
            }
        } else {
            j = 11;
        }
    }
    rotate();

    function move() {
        if (a.x == 0 && a.y == 0 && a.z == 0) {
            return;
        }
        requestAnimationFrame(move);
        if (!cubeCollision && !sphereCollision) {
            if (i < physics.getTime()) {
                if (sPos.x > x.x) {
                    if (submarine.getPosition().x > x.x) {
                        submarine.setPositionX(submarine.getPosition().x += stepx);
                    }
                } else if (sPos.x < x.x) {
                    if (submarine.getPosition().x < x.x) {
                        submarine.setPositionX(submarine.getPosition().x += stepx);
                    }
                } else { }

                if (sPos.z > x.z) {
                    if (submarine.getPosition().z > x.z) {
                        submarine.setPositionZ(submarine.getPosition().z += stepz);
                    }
                } else if (sPos.z < x.z) {
                    if (submarine.getPosition().z < x.z) {
                        submarine.setPositionZ(submarine.getPosition().z += stepz);
                    }
                } else { }

                if (submarine.getPosition().y > MaxY) {
                    submarine.setPositionY(MaxY);
                }
                else if (submarine.getPosition().y < MinY) {
                    submarine.setPositionY(MinY);
                }
                else {
                    if (sPos.y > x.y) {
                        if (submarine.getPosition().y > x.y) {
                            submarine.setPositionY(submarine.getPosition().y += stepy);
                            if (i > physics.getTime() * 0.2 && i < physics.getTime() * 0.6) {
                                submarine.rotateX(angleRad2);
                                submarine.rotateX(angleRad2);
                            }
                            else if (i > physics.getTime() * 0.59 & i < physics.getTime() * 0.61) {
                                k = 0;
                            }
                        } else {
                            submarine.setPositionY(submarine.getPosition().y -= stepy);
                        }
                    } else if (sPos.y < x.y) {
                        if (submarine.getPosition().y < x.y) {
                            submarine.setPositionY(submarine.getPosition().y += stepy);
                            if (i > 0 && i < physics.getTime() * 0.4) {
                                submarine.rotateX(angleRad2);
                                submarine.rotateX(angleRad2);
                            }
                            else if (i > physics.getTime() * 0.39 & i < physics.getTime() * 0.41) {
                                k = 0;
                            }
                        }
                    } else { }
                }
                i += 0.01;

                orbitControls.target.set(
                    submarine.getPosition().x,
                    submarine.getPosition().y,
                    submarine.getPosition().z
                );
                // sceneManager.camera.position.set(
                //     submarine.getPosition().x - 10,
                //     submarine.getPosition().y + 25,
                //     submarine.getPosition().z + 100
                // );
                // sceneManager.camera.lookAt(
                //     submarine.getPosition().x,
                //     submarine.getPosition().y,
                //     submarine.getPosition().z
                // );
            }

            if (k < physics.getTime() * 0.4) {
                submarine.rotateX(-angleRad2);
                submarine.rotateX(-angleRad2);
                k += 0.01;
            }
        } else {
            i = physics.getTime();
            k = physics.getTime();
        }
    }
    move();
}


// CONTROL KEYS
const keysPressed = {}
document.addEventListener('keydown', (event) => {
    // if (event.shiftKey && characterControls) {
    //     characterControls.switchRunToggle()
    // } else {
    (keysPressed)[event.key.toLowerCase()] = true
    // }
}, false);

document.addEventListener('keyup', (event) => {
    (keysPressed)[event.key.toLowerCase()] = false
}, false);


/* Ocean */
const ocean = new Ocean(sceneManager.clock);
ocean.initlize(sceneManager.scene);
console.log(ocean);
ocean.animate();

/* GUI */
const SubmarineFolder = gui.addFolder('Submarine');
SubmarineFolder.add(submarine, 'mass', 0, 100000000, 1000)
    .name('Surfaced mass').onChange((value) => submarine.setMass(value));

SubmarineFolder.add(submarine, 'mass_submerged', 0, 100000000, 1000)
    .name('Submerged mass').onChange((value) => submarine.setSubmergedMass(value));

SubmarineFolder.add(submarine, 'length', 0, 200, 1)
    .name('Length').onChange((value) => submarine.setLength(value));

SubmarineFolder.add(submarine, 'height', 0, 20, 1)
    .name('Height').onChange((value) => submarine.setHeight(value));

SubmarineFolder.add(submarine, 'radius', 0, 20, 0.5)
    .name('Radius').onChange((value) => submarine.setRadius(value));

SubmarineFolder.add(submarine, 'max_speed', 0, 20, 0.5)
    .name('Max Speed').onChange((value) => submarine.setMaxSpeed(value));

SubmarineFolder.add(submarine, 'Cd', 0, 2, 0.01)
    .name('Drag Coefficient').onChange((value) => submarine.setCd(value));

const PhysicsFolder = gui.addFolder('Physics');
PhysicsFolder.add(physics, 'Gravity', 0, 20, 0.01)
    .name('Gravity').onChange((value) => physics.setGravity(value));

PhysicsFolder.add(physics, 'WaterDensity', 0, 2000, 10)
    .name('WaterDensity').onChange((value) => physics.setWaterDensity(value));

PhysicsFolder.add(physics, 'AirDensity', 0, 2, 0.01)
    .name('AirDensity').onChange((value) => physics.setAirDensity(value));

// PhysicsFolder.add(physics, 'Temperature', -100, 100)
//     .name('Temperature').onChange((value) => physics.setTemperature(value));


const MovementFolder = gui.addFolder('Movement Folder');
MovementFolder.add(physics, 'Time', 0, 86400, 1)
    .name('Time').onChange((value) => physics.setTime(value));

MovementFolder.add(submarine.getPosition(), 'x')
    .name('Submarine start X coords').onChange((value) => {
        submarine.setPositionX(value);
        orbitControls.target.set(
            submarine.getPosition().x,
            submarine.getPosition().y,
            submarine.getPosition().z
        );
        sceneManager.camera.position.set(
            submarine.getPosition().x - 10,
            submarine.getPosition().y + 25,
            submarine.getPosition().z + 100
        );
    });

MovementFolder.add(submarine.getPosition(), 'y', -1000, 0)
    .name('Submarine start Y coords').onChange((value) => {
        submarine.setPositionY(value);
        orbitControls.target.set(
            submarine.getPosition().x,
            submarine.getPosition().y,
            submarine.getPosition().z
        );
        sceneManager.camera.position.set(
            submarine.getPosition().x - 10,
            submarine.getPosition().y + 25,
            submarine.getPosition().z + 100
        );
    });

MovementFolder.add(submarine.getPosition(), 'z')
    .name('Submarine start Z coords').onChange((value) => {
        submarine.setPositionZ(value);
        orbitControls.target.set(
            submarine.getPosition().x,
            submarine.getPosition().y,
            submarine.getPosition().z
        );
        sceneManager.camera.position.set(
            submarine.getPosition().x - 10,
            submarine.getPosition().y + 25,
            submarine.getPosition().z + 100
        );
    });

MovementFolder.add(SpeedVec, 'x', -1, 1, 0.01)
    .name('Speed Vector X coords').onChange((value) => SpeedVec.setX(value));

// MovementFolder.add(SpeedVec, 'y', -1, 1, 0.01)
//     .name('Speed Vector Y coords').onChange((value) => SpeedVec.setY(value));

MovementFolder.add(SpeedVec, 'z', -1, 1, 0.01)
    .name('Speed Vector Z coords').onChange((value) => SpeedVec.setZ(value));

// Actions for submarine movement
const ActionsFolder = MovementFolder.addFolder("Action");
ActionsFolder.add(actions, 'dive').name('Dive').listen().onChange(function () { setChecked("dive") });
ActionsFolder.add(actions, 'float').name('Float').listen().onChange(function () { setChecked("float") });
ActionsFolder.add(actions, 'stay').name('Stay').listen().onChange(function () { setChecked("stay") });

function setChecked(prop) {
    for (let param in actions) {
        actions[param] = false;
    }
    actions[prop] = true;
}

// var GG = new function () {
//     this.steer_angle = submarine.getSteerAngleXZ();
// }

// MovementFolder.add(GG, 'steer_angle', -180, 180, 1)
//     .name('Steering Angle').onChange((value) => {
//         GG.steer_angle = value;
//         submarine.setSteerAngleXZ(degToRad(GG.steer_angle));
//         submarine.rotateY(submarine.getSteerAngleXZ());
//     });


var obj = { calcPhysics };
MovementFolder.add(obj, 'calcPhysics').name('Start Movement');


/* Text */
const textDiv = document.getElementById('text');

const clock = new THREE.Clock();

/* Render */
function render() {
    requestAnimationFrame(render);
    if (submarine.position.y < 0) {
        sceneManager.scene.background = sceneTexture2;
    } else {
        sceneManager.scene.background = sceneTexture;
    }

    let mixerUpdateDelta = clock.getDelta();
    if (submarineControls) {
        submarineControls.update(mixerUpdateDelta, keysPressed, cubeCollision, sphereCollision);
    }
    orbitControls.update();

    submarine.rebindCubebb();
    checkCollision();

    //water.material.uniforms['time'].value += 0.01;
    textDiv.innerHTML = `X = ${submarine.position.x.toFixed(3)}, 
Y = ${submarine.position.y.toFixed(3)}, Z = ${submarine.position.z.toFixed(3)}`
}
render();

/* Compatibility */
if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    sceneManager.animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
