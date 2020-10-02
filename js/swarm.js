import * as THREE from '../node_modules/three/build/three.module.js';
import Butterfly from './butterfly.js';

const {
  PI, cos, sin, random, floor,
} = Math;

// Generates random number for direction of butterfly
function rand(min, max) {
  return random() * (max - min) + min;
}

function genDirection() {
  const fixedX = floor(random() * floor(2));
  const positiveAxis = floor(random() * floor(2));
  if (fixedX) {
    if (positiveAxis) {
      return new THREE.Vector3(60, 0, rand(-60, 60));
    } return new THREE.Vector3(-60, 0, rand(-60, 60));
  }
  if (positiveAxis) {
    return new THREE.Vector3(rand(-60, 60), 0, 60);
  } return new THREE.Vector3(rand(-60, 60), 0, -60);
}

function Swarm() {
  this.butterflies = [];
  this.position = new THREE.Vector3(0, 0, 0);

  // Initialize positions
  for (let i = 0; i < 2; i += 1) {
    this.butterflies.push(new Butterfly());

    this.butterflies[i].phase = i;

    this.butterflies[i].rotateMatrix.set(
      cos(i * 0.125 * PI), -sin(i * 0.125 * PI), 0, 0,
      sin(i * 0.125 * PI), cos(i * 0.125 * PI), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
    this.butterflies[i].translateMatrix.set(
      1, 0, 0, 6 * (i + 1),
      0, 1, 0, 8 * (i + 1),
      0, 0, 1, 4 * (i + 1),
      0, 0, 0, 1,
    );

    this.butterflies[i].applyMatrices();
  }
}

// Boid rules:
// 1. Separation - steer to avoid crowding local swarmmates
// 2. Alignment - steer toward average heading of local swarmmates
// 3. Cohesion - steer to move toward average position of local swarmmates

let velocity = 1 / 200;
const direction = genDirection();

// Updated every frame
Swarm.prototype.move = function () {
  this.butterflies.forEach((butterfly) => {
    // Keep butterfly within terrain
    butterfly.rotate(direction.x, direction.y, direction.z);
    if (butterfly.thorax.position.x < -60) {
      direction.set(rand(0, 60), 0, rand(-60, 60));
    } else if (butterfly.thorax.position.x > 60) {
      direction.set(rand(-60, 0), 0, rand(-60, 60));
    }
    if (butterfly.thorax.position.z < -60) {
      direction.set(rand(-60, 60), 0, rand(0, 60));
    } else if (butterfly.thorax.position.z > 60) {
      direction.set(rand(-60, 60), 0, rand(-60, 0));
    }
    butterfly.translate(direction.x * velocity, direction.y * velocity, direction.z * velocity);
    // butterfly.flap();
  });
};

export default Swarm;
