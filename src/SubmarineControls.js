import * as THREE from 'three'

const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'
const C = 'c'
const V = 'v'
const R = 'r'

const DIRECTIONS = [W, A, S, D, C, V, R]

export default class SubmarineControls {
    // Temporary Data
    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0, 1, 0);
    rotateQuarternion = new THREE.Quaternion();

    constructor(submarine, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.submarine = submarine;
        // this.mixer = mixer;
        // this.animationsMap = animationsMap;
        // this.currentAction = currentAction;
        // this.animationsMap.forEach((value, key) => {
        //     if (key == currentAction) {
        //         value.play();
        //     }
        // });
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.speed = 10;
        this.updateCameraTarget(0, 0)
    }

    update(delta, keysPressed, cubeCollision, sphereCollision) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);

        // var play = '';
        // if (directionPressed && this.toggleRun) {
        //     play = 'Run'
        // } else if (directionPressed) {
        //     play = 'Walk'
        // } else {
        //     play = 'Idle'
        // }

        // if (this.currentAction != play) {
        //     const toPlay = this.animationsMap.get(play)
        //     const current = this.animationsMap.get(this.currentAction)

        //     current.fadeOut(this.fadeDuration)
        //     toPlay.reset().fadeIn(this.fadeDuration).play();

        //     this.currentAction = play
        // }

        // this.mixer.update(delta)

        // if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
        if (keysPressed[R]) {
            this.submarine.setPositionX(0);
            this.submarine.setPositionY(0);
            this.submarine.setPositionZ(0.85);

            this.orbitControl.target.set(
                this.submarine.getPosition().x,
                this.submarine.getPosition().y,
                this.submarine.getPosition().z
            );
            this.camera.position.set(
                this.submarine.getPosition().x,
                this.submarine.getPosition().y + 25,
                this.submarine.getPosition().z + 100
            );
        }
        if (keysPressed[C]) {
            if (this.submarine.getPosition().y <= -500) {
                this.submarine.setPositionY(this.submarine.getPosition().y = -500);
            }
            else if (this.submarine.getPosition().y > -30) {
                this.submarine.setPositionY(this.submarine.getPosition().y -= 10 * delta);
                // move camera
                this.camera.position.y -= 10 * delta;
            }
            else {
                this.submarine.setPositionY(this.submarine.getPosition().y -= 10 * delta);
                // move camera
                this.camera.position.y -= 10 * delta;
            }
            // update camera target
            this.orbitControl.target.set(
                this.submarine.getPosition().x,
                this.submarine.getPosition().y,
                this.submarine.getPosition().z
            );
        }

        if (keysPressed[V]) {
            if (this.submarine.getPosition().y >= 0) {
                this.submarine.setPositionY(this.submarine.getPosition().y = 0);
            }
            else if (this.submarine.getPosition().y > -30) {
                this.submarine.setPositionY(this.submarine.getPosition().y += 10 * delta);
                // move camera
                this.camera.position.y += 10 * delta;
            }
            else {
                this.submarine.setPositionY(this.submarine.getPosition().y += 10 * delta);
                // move camera
                this.camera.position.y += 10 * delta;
            }
            // update camera target
            this.orbitControl.target.set(
                this.submarine.getPosition().x,
                this.submarine.getPosition().y,
                this.submarine.getPosition().z
            );
        }

        if (directionPressed && !keysPressed[C] && !keysPressed[V]) {
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.submarine.getPosition().x),
                (this.camera.position.z - this.submarine.getPosition().z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            if (directionOffset !== Math.PI) {
                this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
                this.submarine.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)
                this.submarine.cube.quaternion.rotateTowards(this.rotateQuarternion, 0.2)
            } else { }
            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            // const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

            // move model & camera

            const moveX = this.walkDirection.x * this.speed * delta
            const moveZ = this.walkDirection.z * this.speed * delta
            if (keysPressed[W] && this.speed < 100) {
                this.speed += 0.1;
            }
            console.log(this.speed);
            if (!cubeCollision && !sphereCollision) {
                this.submarine.setPositionX(this.submarine.getPosition().x += moveX)
                this.submarine.setPositionZ(this.submarine.getPosition().z += moveZ)

                this.updateCameraTarget(moveX, moveZ)
            }
        }
    }

    updateCameraTarget(moveX, moveZ) {
        // move camera
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;

        // update camera target
        this.orbitControl.target.set(
            this.submarine.cube.position.x,
            this.submarine.cube.position.y,
            this.submarine.cube.position.z,
        );
    }

    directionOffset(keysPressed) {
        var directionOffset = 0 // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI // s+a
            } else if (keysPressed[D]) {
                directionOffset = Math.PI // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2 // d
        }
        return directionOffset
    }
}