import * as THREE from 'three';

export default class Physics {
    constructor(Gravity=9.81, WaterDensity=1028, AirDensity=1.293, Temperature=0) {
        this.Gravity = Gravity;
        this.WaterDensity = WaterDensity;
        this.AirDensity = AirDensity;
    };
    
    setGravity(Gravity=9.81) {
        this.Gravity = Gravity;
    }

    setWaterDensity(WaterDensity=1028) {
        this.WaterDensity = WaterDensity;
    }

    setAirDensity(AirDensity=1.293) {
        this.AirDensity = AirDensity;
    }

    getGravity() {
        return this.Gravity;
    }

    getWaterDensity() {
        return this.WaterDensity;
    }

    getAirDensity() {
        return this.AirDensity;
    }

    Weight(mass) {
        const dir = new THREE.Vector3(0, -1, 0).normalize();
        const int = mass * this.Gravity;
        return dir.multiplyScalar(int);
    }

    Buoyancy(volume) {
        const dir = new THREE.Vector3(0, 1, 0).normalize();
        const int = this.WaterDensity * this.Gravity * volume;
        return dir.multiplyScalar(int);
    }

    Drag(area, speed, Cd) {
        return (0.5 * this.WaterDensity * (speed**2) * Cd * area);
    }

    Thrust(area, start_speed, end_speed) {
        return (this.WaterDensity * area * end_speed * (end_speed - start_speed));
    }
}