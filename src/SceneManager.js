import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export default class SceneManager {
  constructor(canvasId) {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.fov = 60;
    this.nearPlane = 0.1;
    this.farPlane = 1000;
    this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, this.nearPlane, this.farPlane);

    // Renderer
    this.canvas = document.getElementById(canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Clock, Stats, Controls
    this.clock = new THREE.Clock();
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Ambient light: which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // Directional light: which is illuminating the chart directly
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(75, 175, -100);
    //this.directionalLight.target.position.set(0, 0, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 3);
    this.scene.add(this.directionalLightHelper);

    // Handle window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    this.controls.update();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}