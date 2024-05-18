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
    setMass(mass_submerged) {
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
        return this.position.set(x, y, z);
    }

    calcArea() {
        return ((2 * Math.PI * this.radius * this.length) + (2 * Math.PI * (this.radius**2)));
    }

    calcVolume() {
        return (Math.PI * (this.radius**2) * this.length);
    }
}