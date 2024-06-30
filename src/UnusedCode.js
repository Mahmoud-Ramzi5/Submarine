import * as THREE from 'three';

import { Water } from 'three/examples/jsm/Addons.js';
import img from './resources/textures/Material.001_baseColor.jpeg';

/* Scene water */
const waterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const waterTexture = new THREE.TextureLoader().load('/resources/textures/waternormals.jpg', function (texture) {
    texture.format = THREE.RGBAFormat;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.needsUpdate = true
});
const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterTexture,
        alpha: 1.0,
        sunDirection: sceneManager.directionalLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: sceneManager.scene.fog !== undefined,
        side: THREE.DoubleSide
    }
);
// Set the rotation of the water
water.rotation.x = - Math.PI / 2;
sceneManager.scene.add(water);

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

//const orthographicCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
//scene.add(orthographicCamera);

//controls.target.set(0, 0, 0);