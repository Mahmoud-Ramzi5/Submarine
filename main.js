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

var listOfBoxes = [];
var listOfSpheres = [];
var submarineControls;
// Load submarine model
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

        //calcPhysics();

    }
}
loadSubmarineModel();

//Load the icebergs
async function loadIcebergModel() {
    // Load a glTF resource
    const iceberg_model1 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model1) {
        iceberg_model1.scale.set(200, 200, 200);
        iceberg_model1.position.set(0, -100, -300);
        iceberg_model1.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model1);
    }
    const iceberg_model2 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model2) {
        iceberg_model2.scale.set(200, 200, 200);
        iceberg_model2.position.set(700, -100, -100);
        iceberg_model2.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model2);
    }
    const iceberg_model3 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model3) {
        iceberg_model3.scale.set(200, 200, 200);
        iceberg_model3.position.set(-700, -100, 0);
        iceberg_model3.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model3);
    }
    const iceberg_model4 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model4) {
        iceberg_model4.scale.set(200, 200, 200);
        iceberg_model4.position.set(0, -100, 500);
        iceberg_model4.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model4);
    }
    const iceberg_model5 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model5) {
        iceberg_model5.scale.set(200, 200, 200);
        iceberg_model5.position.set(600, -100, -1000);
        iceberg_model5.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model5);
    }
    const iceberg_model6 = await modelLoaders.load_GLTF_Model('/resources/models/iceber01/scene.gltf');
    if (iceberg_model6) {
        iceberg_model6.scale.set(200, 200, 200);
        iceberg_model6.position.set(-1000, -100, 500);
        iceberg_model6.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        sceneManager.scene.add(iceberg_model6);
    }
}
loadIcebergModel();


// Make the boxes and spheres for collisions
// 1
const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere1.material.color.setHex(0xff0000);
sphere1.material.transparent = true;
sphere1.material.opacity = 0;
sphere1.position.set(0, -30, -300)
let sphere1bb = new THREE.Sphere(sphere1.position, 100);
sceneManager.scene.add(sphere1);
listOfSpheres.push(sphere1bb)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube1.material.transparent = true;
cube1.material.opacity = 0;
cube1.position.set(0, -175, -300)
let cube1bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1bb.setFromObject(cube1);
sceneManager.scene.add(cube1);
listOfBoxes.push(cube1bb);
// 2
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere2.material.color.setHex(0xff0000);
sphere2.material.transparent = true;
sphere2.material.opacity = 0;
sphere2.position.set(700, -30, -100)
let sphere2bb = new THREE.Sphere(sphere2.position, 100);
sceneManager.scene.add(sphere2);
listOfSpheres.push(sphere2bb)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube2.material.transparent = true;
cube2.material.opacity = 0;
cube2.position.set(700, -175, -100)
let cube2bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube2bb.setFromObject(cube2);
sceneManager.scene.add(cube2);
listOfBoxes.push(cube2bb);
// 3
const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere3.material.color.setHex(0xff0000);
sphere3.material.transparent = true;
sphere3.material.opacity = 0;
sphere3.position.set(-700, -30, 0)
let sphere3bb = new THREE.Sphere(sphere3.position, 100);
sceneManager.scene.add(sphere3);
listOfSpheres.push(sphere3bb)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube3.material.transparent = true;
cube3.material.opacity = 0;
cube3.position.set(-700, -175, 0)
let cube3bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube3bb.setFromObject(cube3);
sceneManager.scene.add(cube3);
listOfBoxes.push(cube3bb);
// 4
const sphere4 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere4.material.color.setHex(0xff0000);
sphere4.material.transparent = true;
sphere4.material.opacity = 0;
sphere4.position.set(0, -30, 500)
let sphere4bb = new THREE.Sphere(sphere4.position, 100);
sceneManager.scene.add(sphere4);
listOfSpheres.push(sphere4bb)

const cube4 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube4.material.transparent = true;
cube4.material.opacity = 0;
cube4.position.set(0, -175, 500)
let cube4bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube4bb.setFromObject(cube4);
sceneManager.scene.add(cube4);
listOfBoxes.push(cube4bb);
// 5
const sphere5 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere5.material.color.setHex(0xff0000);
sphere5.material.transparent = true;
sphere5.material.opacity = 0;
sphere5.position.set(600, -30, -1000)
let sphere5bb = new THREE.Sphere(sphere5.position, 100);
sceneManager.scene.add(sphere5);
listOfSpheres.push(sphere5bb)

const cube5 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube5.material.transparent = true;
cube5.material.opacity = 0;
cube5.position.set(600, -175, -1000)
let cube5bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube5bb.setFromObject(cube5);
sceneManager.scene.add(cube5);
listOfBoxes.push(cube5bb);
// 6
const sphere6 = new THREE.Mesh(
    new THREE.SphereGeometry(100),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
sphere6.material.color.setHex(0xff0000);
sphere6.material.transparent = true;
sphere6.material.opacity = 0;
sphere6.position.set(-1000, -30, 500)
let sphere6bb = new THREE.Sphere(sphere6.position, 100);
sceneManager.scene.add(sphere6);
listOfSpheres.push(sphere6bb)

const cube6 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 175, 150),
    new THREE.MeshPhongMaterial({ color: 0xff0000 }
    )
);
cube6.material.transparent = true;
cube6.material.opacity = 0;
cube6.position.set(-1000, -175, 500)
let cube6bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube6bb.setFromObject(cube6);
sceneManager.scene.add(cube6);
listOfBoxes.push(cube6bb);
console.log(listOfBoxes);

/* Collision */
var cubeCollision = false;
var sphereCollision = false;
function checkCollision() {
    if (submarine.cubebb.intersectsBox(cube1bb) || submarine.cubebb.intersectsBox(cube2bb)
        || submarine.cubebb.intersectsBox(cube3bb) || submarine.cubebb.intersectsBox(cube4bb)
        || submarine.cubebb.intersectsBox(cube5bb) || submarine.cubebb.intersectsBox(cube6bb)) {
        cubeCollision = true
    } else {
        cubeCollision = false;
    };

    if (submarine.cubebb.intersectsSphere(sphere1bb) || submarine.cubebb.intersectsSphere(sphere2bb)
        || submarine.cubebb.intersectsSphere(sphere3bb) || submarine.cubebb.intersectsSphere(sphere4bb)
        || submarine.cubebb.intersectsSphere(sphere5bb) || submarine.cubebb.intersectsSphere(sphere6bb)) {
        sphereCollision = true;
    } else {
        sphereCollision = false;
    }
};

// actions for submarine movement
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
    if (positionCoordinates.y > 0) {
        console.log('submarine cant fly');
        positionCoordinates.y = 0;
    } else if (positionCoordinates.y < -1000) {
        console.log('cant go deeper');
        positionCoordinates.y = -1000;
    } else { }

    console.log(acceleration);
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
                        submarine.setCubePositionX();
                    }
                } else if (sPos.x < x.x) {
                    if (submarine.getPosition().x < x.x) {
                        submarine.setPositionX(submarine.getPosition().x += stepx);
                        submarine.setCubePositionX();
                    }
                } else { }

                if (sPos.z > x.z) {
                    if (submarine.getPosition().z > x.z) {
                        submarine.setPositionZ(submarine.getPosition().z += stepz);
                        submarine.setCubePositionZ();
                    }
                } else if (sPos.z < x.z) {
                    if (submarine.getPosition().z < x.z) {
                        submarine.setPositionZ(submarine.getPosition().z += stepz);
                        submarine.setCubePositionZ();
                    }
                } else { }

                if (submarine.getPosition().y > MaxY) {
                    submarine.setPositionY(MaxY);
                    submarine.setCubePositionY();
                }
                else if (submarine.getPosition().y < MinY) {
                    submarine.setPositionY(MinY);
                    submarine.setCubePositionY();
                }
                else {
                    if (sPos.y > x.y) {
                        if (submarine.getPosition().y > x.y) {
                            submarine.setPositionY(submarine.getPosition().y += stepy);
                            submarine.setCubePositionY();
                            if (i > physics.getTime() * 0.2 && i < physics.getTime() * 0.6) {
                                submarine.rotateX(angleRad2);
                                submarine.rotateX(angleRad2);
                            }
                            else if (i > physics.getTime() * 0.59 & i < physics.getTime() * 0.61) {
                                k = 0;
                            }
                        } else {
                            submarine.setPositionY(submarine.getPosition().y -= stepy);
                            submarine.setCubePositionY();
                        }
                    } else if (sPos.y < x.y) {
                        if (submarine.getPosition().y < x.y) {
                            submarine.setPositionY(submarine.getPosition().y += stepy);
                            submarine.setCubePositionY();
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
        submarine.setCubePositionX();
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
        submarine.setCubePositionY();
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
        submarine.setCubePositionZ();
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
    //moveCube();
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
