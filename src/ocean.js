import * as THREE from "three";

export default class Ocean {
  constructor(clock) {
    this.clock = clock;
    // Common
    this.GridSize = 200;        // Size of Grid in meters
    this.GridRepetitions = 2;   // number of Grid repetition
    this.WaterColor = 0x081080; // Water (Navy)
    // Animated
    this.segments = 15;          // Segments per Grid (fewer = sharper waves)
    this.GridPointer = [0];

    this.WavMZV = [0];
    this.WavMXV = [0];
    this.waveGeometry = new THREE.PlaneGeometry(this.GridSize, this.GridSize, this.segments, this.segments);
    this.waveGeometry.rotateX(-Math.PI * 0.5);
    this.matWav;
    this.gu = {              // Uniform
      time: { value: 0 },
      grid: { value: this.GridSize },
    };
    // Textures
    // Water texture Map
    this.waterTexture = new THREE.TextureLoader().load('/resources/textures/waternormals.jpg', function (texture) {
      texture.format = THREE.RGBAFormat;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.generateMipmaps = true;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.needsUpdate = true
    });
    this.LodFlg = 0;           // Load Flag

    //renderer.outputEncoding = THREE.sRGBEncoding;

  }

  initlize(scene) {
    let n, zx;
    /* = Main Program =============================================*/
    // Planes with Extended Material ----------------------------

    this.matWav = new THREE.MeshStandardMaterial({
      normalMap: this.waterTexture,
      metalness: 0.5,
      roughness: 0.6,
      side: THREE.DoubleSide,
      onBeforeCompile: shader => {
        shader.uniforms.time = this.gu.time;
        shader.uniforms.grid = this.gu.grid;
        shader.vertexShader = `
              uniform float time;
              uniform float grid;  
              varying float vHeight;
              vec3 moveWave(vec3 p){
                // Angle = distance offset + degree offset
                vec3 retVal = p;
                float ang;
                float kzx = 360.0/grid;
                // Wave1 (135 degrees)
                ang = 50.0*time + -1.0*p.x*kzx + -2.0*p.z*kzx;
                if (ang>360.0) ang = ang-360.0;
                ang = ang*3.14159265/180.0;
                retVal.y = 3.0*sin(ang);
                // Wave2 (090)
                ang = 25.0*time + -3.0*p.x*kzx;
                if (ang>360.0) ang = ang-360.0;
                ang = ang*3.14159265/180.0;
                retVal.y = retVal.y + 2.0*sin(ang);
                // Wave3 (180 degrees)
                ang = 15.0*time - 3.0*p.z*kzx;
                if (ang>360.0) ang = ang-360.0;
                ang = ang*3.14159265/180.0;
                retVal.y = retVal.y + 2.0*sin(ang);
                // Wave4 (225 degrees)
                ang = 50.0*time + 4.0*p.x*kzx + 8.0*p.z*kzx;
                if (ang>360.0) ang = ang-360.0;
                ang = ang*3.14159265/180.0;
                retVal.y = retVal.y + 0.5*sin(ang);
                // Wave5 (270 degrees)
                ang = 50.0*time + 8.0*p.x*kzx;
                if (ang>360.0) ang = ang-360.0;
                ang = ang*3.14159265/180.0;
                retVal.y = retVal.y + 0.5*sin(ang);
                //
                return retVal;
              }         
              ${shader.vertexShader}
            `.replace(
          `#include <beginnormal_vertex>`,
          `#include <beginnormal_vertex>
                vec3 p = position;
                    vec2 move = vec2(1, 0);
                vec3 pos = moveWave(p);
                vec3 pos2 = moveWave(p + move.xyy);
                vec3 pos3 = moveWave(p + move.yyx);
                vNormal = normalize(cross(normalize(pos2-pos), normalize(pos3-pos)));
              `
        ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
                transformed.y = pos.y;
                vHeight = pos.y;
              `
        );
        shader.fragmentShader = `
              varying float vHeight;
              ${shader.fragmentShader}
            `.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
                diffuseColor.rgb = mix(vec3(0.03125,0.0625,0.5), vec3(0.1,0.2,0.6), smoothstep(0.0, 6.0, vHeight));
                if (vHeight>7.0) {
                  diffuseColor.rgb = vec3(0.2,0.3,0.7); // Adds "foam" highlight to highest waves
                }
              `
        );
      }
    });

    // Compute Starting Z and X Values
    zx = -0.5 * (this.GridRepetitions) * this.GridSize + 0.5 * this.GridSize;
    for (let i = 0; i < this.GridRepetitions; i++) {
      this.WavMZV[i] = zx;
      this.WavMXV[i] = zx;
      zx = zx + this.GridSize;
    }
    // 4 Adjacent Planes
    n = 0;
    for (let z = 0; z < this.GridRepetitions; z++) {    // Row X2
      for (let x = 0; x < this.GridRepetitions; x++) {  // Column X2
        this.GridPointer[n] = new THREE.Mesh(this.waveGeometry, this.matWav);
        scene.add(this.GridPointer[n]);
        this.GridPointer[n].position.set(this.WavMXV[x], 0, -this.WavMZV[z]);
        n++;
      }
    }
    //
    this.LodFlg = 1;
  }


  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.LodFlg > 0) {
      this.gu.time.value = this.clock.getElapsedTime();
      this.waterTexture.offset.x -= .0005;
      this.waterTexture.offset.y += .00025;
    }
  }
}