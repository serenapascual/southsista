import * as THREE from '../node_modules/three/build/three.module.js';
import Butterfly from './butterfly.js';

const {
  PI, cos, sin, random, floor,
} = Math;

// Generates random number for direction of butterfly
function rand(min, max) {
  return random() * (max - min) + min;
}

// Generate random vector on perimeter of
// plane spanning [-len, len] in the X and Z directions
function genDirection(len) {
  const fixedX = floor(random() * floor(2));
  const positiveAxis = floor(random() * floor(2));
  if (fixedX) {
    if (positiveAxis) {
      return new THREE.Vector3(len, 0, rand(-len, len));
    } return new THREE.Vector3(-len, 0, rand(-len, len));
  }
  if (positiveAxis) {
    return new THREE.Vector3(rand(-len, len), 0, len);
  } return new THREE.Vector3(rand(-len, len), 0, -len);
}

function Swarm() {
  this.butterflies = [];
  this.position = new THREE.Vector3(0, 0, 0);

  // Initialize positions
  for (let i = 0; i < 2; i += 1) {
    this.butterflies.push(new Butterfly());

    this.butterflies[i].phase = i;

    // this.butterflies[i].rotateMatrix.makeRotationY(PI * i);
    this.butterflies[i].translateMatrix.set(
      1, 0, 0, 46 * (i + 0),
      0, 1, 0, 38 * (i + 0),
      0, 0, 1, 24 * (i + 0),
      0, 0, 0, 1,
    );

    this.butterflies[i].velocity.set(0.15, 0, 0.15);
    this.butterflies[i].rotate(this.butterflies[i].velocity);
    this.butterflies[i].applyMatrices();
  }
}

// Boid rules:
// 1. Separation - steer to avoid crowding local swarmmates
// 2. Alignment - steer toward average heading of local swarmmates
// 3. Cohesion - steer to move toward average position of local swarmmates

const xMin = -60;
const xMax = 60;
const zMin = -60;
const zMax = 60;

// Updated every frame
Swarm.prototype.move = function () {
  this.butterflies.forEach((butterfly) => {
    // Keep butterfly within terrain
    if (butterfly.thorax.position.x < xMin) {
      butterfly.velocity.x += 0.05;
      butterfly.rotate();
    } else if (butterfly.thorax.position.x > xMax) {
      butterfly.velocity.x -= 0.05;
      butterfly.rotate();
    }
    if (butterfly.thorax.position.z < zMin) {
      butterfly.velocity.z += 0.05;
      butterfly.rotate();
    } else if (butterfly.thorax.position.z > zMax) {
      butterfly.velocity.z -= 0.05;
      butterfly.rotate();
    }
    butterfly.translate(butterfly.velocity);
    butterfly.flap();
  });
};

export default Swarm;
