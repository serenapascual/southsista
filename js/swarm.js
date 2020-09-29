import * as THREE from '../node_modules/three/build/three.module.js';
import Butterfly from './butterfly.js';

const { PI, cos, sin } = Math;

function Swarm() {
  this.butterflies = [];
  this.position = new THREE.Vector3(0, 0, 0);

  const m = new THREE.Matrix4();
  const m2 = new THREE.Matrix4();

  function applyNoise(object) {
    if (object instanceof THREE.Mesh) {
      object.applyMatrix4(m);
      object.applyMatrix4(m2);
    }
  }

  // Initiailize positions
  for (let i = 0; i < 2; i += 1) {
    this.butterflies.push(new Butterfly());

    m.set(
      cos(i * 0.125 * PI), -sin(i * 0.125 * PI), 0, 0,
      sin(i * 0.125 * PI), cos(i * 0.125 * PI), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
    m2.set(
      1, 0, 0, 6 * (i + 1),
      0, 1, 0, 8 * (i + 1),
      0, 0, 1, 4 * (i + 1),
      0, 0, 0, 1,
    );
    this.butterflies[i].mesh.traverse(applyNoise);
    console.log(this.butterflies[i].thorax.position);
  }
}

// Boid rules:
// 1. Separation - steer to avoid crowding local swarmmates
// 2. Alignment - steer toward average heading of local swarmmates
// 3. Cohesion - steer to move toward average position of local swarmmates

const perceivedCenter = new THREE.Vector3(0, 0, 0);

Swarm.prototype.move = function () {
  this.butterflies.forEach((butterfly) => {
    // Alignment
    perceivedCenter.add(butterfly.thorax.position);
    // console.log(perceivedCenter);

    butterfly.fly();
  });

  perceivedCenter.set(0, 0, 0);
};

export default Swarm;
