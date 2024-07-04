import * as THREE from 'three';


export default class Physics {
    constructor(Gravity=9.81, WaterDensity=1028, AirDensity=1.293, Temperature=0) {
        this.Gravity = Gravity;
        this.WaterDensity = WaterDensity;
        this.AirDensity = AirDensity;

        this.Time = 0;
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


    getTime() {
        return this.Time;
    }

    setTime(Time) {
        this.Time = Time;
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
    Drag(area, Cd, speed) {
        const velocity = speed.length();
        const direction = speed.clone().normalize().negate();
        const intensity = 0.5 * this.WaterDensity * (velocity**2) * Cd * area;
        return direction.multiplyScalar(intensity);
    }

    Thrust(area, submarine_speed, water_exit_speed) {
        const submarine_velocity = submarine_speed.length();
        const water_exit_velocity = water_exit_speed.length();
        const direction = water_exit_speed.clone().normalize();
        const intensity = this.WaterDensity * area * water_exit_velocity * (water_exit_velocity - submarine_velocity);
        return direction.multiplyScalar(intensity);
    }

    NewtonSecondLaw(mass, weight, buoyancy, drag, thrust) {
        const total = new THREE.Vector3(0, 0, 0);
        total.add(weight);
        console.log(weight);
        total.add(buoyancy);
        console.log(buoyancy);
        total.add(drag);
        console.log(drag);
        total.add(thrust);
        console.log(thrust);


        const accerlration = total.divideScalar(mass);
        return accerlration;
    }

    getAccerlationVelocity(start_velocity, accerlration) {
        return accerlration.clone().multiplyScalar(this.Time).add(start_velocity);
    }

    getPosition(start_position, velocity) {
        return velocity.clone().multiplyScalar(this.Time).add(start_position);
    }

    getDistance(start_position, end_position) {
        return end_position.sub(start_position).length();
    }
}
