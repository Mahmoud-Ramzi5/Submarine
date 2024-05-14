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

    /* area = area of submarine, speed = speed of submarine and it is a vec3 */
    Drag(area, speed, Cd) {
        const velocity = speed.length();
        const direction = speed.clone().normalize().negate();
        const intensity = 0.5 * this.WaterDensity * (velocity**2) * Cd * area;
        return direction.multiplyScalar(intensity);
    }

    Thrust(area, start_speed, end_speed) {
        const start_velocity = start_speed.length();
        const end_velocity = end_speed.length();
        const direction = end_speed.clone().normalize();
        const intensity = this.WaterDensity * area * end_velocity * (end_velocity - start_velocity);
        return direction.multiplyScalar(intensity);
    }

    newtonFirstLaw(){
        
    }
}
