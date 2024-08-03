import * as THREE from 'three';

export default class Submarine {
    constructor(mass, mass_submerged, length, height, radius, max_speed, Cd) {
        this.mass = mass;
        this.mass_submerged = mass_submerged;
        this.length = length;
        this.height = height;
        this.radius = radius;
        this.max_speed = max_speed;
        this.Cd = Cd;

        this.position = new THREE.Vector3(0, 0, 0);
        this.model = null;
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 50),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        this.cube.material.opacity = 0;
        this.cube.material.transparent = true;
        this.cube.position.x = this.position.x;
        this.cube.position.z = this.position.z;
        this.cubebb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.cubebb.setFromObject(this.cube);

        this.steer_angle_X_Z = 0;
        this.steer_angle_XZ_Y = 0;
    }

    getAttributes() {
        return {
            mass: this.mass,
            mass_submerged: this.mass_submerged,
            length: this.length,
            height: this.height,
            radius: this.radius,
            max_speed: this.max_speed,
            Cd: this.Cd
        };
    }

    setMass(mass) {
        this.mass = mass;
    }

    setSubmergedMass(mass_submerged) {
        this.mass_submerged = mass_submerged;
    }

    setLength(length) {
        this.length = length;
    }

    setHeight(height) {
        this.height = height;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    setMaxSpeed(max_speed) {
        this.max_speed = max_speed;
    }

    setCd(Cd) {
        this.Cd = Cd;
    }


    getPosition() {
        return this.position;
    }

    setPosition(x, y, z) {
        this.model.position.set(x, y, z);
        this.position.set(x, y, z);
    }

    setPositionX(x) {
        this.model.position.x = x;
        this.position.x = x;
    }

    setPositionY(y) {
        this.model.position.y = y;
        this.position.y = y;
    }

    setPositionZ(z) {
        this.model.position.z = z;
        this.position.z = z;
    }


    rotateX(angle) {
        this.model.rotateX(angle);
        this.cube.rotateX(angle);
    };

    rotateY(angle) {
        this.model.rotateY(angle);
        this.cube.rotateY(angle);
    };

    rotateZ(angle) {
        this.model.rotateZ(angle);
        this.cube.rotateZ(angle);
    };


    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
    }


    getSteerAngleXZ() {
        return this.steer_angle_X_Z;
    }

    setSteerAngleXZ(angle) {
        this.steer_angle_X_Z = angle;
    }

    getSteerAngleXZY() {
        return this.steer_angle_XZ_Y;
    }

    setSteerAngleXZY(angle) {
        this.steer_angle_XZ_Y = angle;
    }


    calcArea() {
        return ((2 * Math.PI * this.radius * this.length) + (2 * Math.PI * (this.radius ** 2)));
    }

    calcVolume() {
        return (Math.PI * (this.radius ** 2) * this.length);
    }

    rebindCubebb() {
        this.cubebb.copy(this.cube.geometry.boundingBox).applyMatrix4(this.cube.matrixWorld);
    }

    setCubePositionX() {
        this.cube.position.x = this.position.x;
    }

    setCubePositionY() {
        this.cube.position.y = this.position.y;
    }

    setCubePositionZ() {
        this.cube.position.z = this.position.z;
    }
}