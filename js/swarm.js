import * as THREE from '../node_modules/three/build/three.module.js';
import Butterfly from './butterfly.js';

const {
  PI, cos, sin, abs, random, floor,
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
  for (let i = 0; i < 3; i += 1) {
    this.butterflies.push(new Butterfly());

    this.butterflies[i].phase = i;

    // this.butterflies[i].rotateMatrix.makeRotationY(PI * i);
    this.butterflies[i].translateMatrix.set(
      1, 0, 0, 26 * (i + 0),
      0, 1, 0, 38 * (i + 0),
      0, 0, 1, 14 * (i + 0),
      0, 0, 0, 1,
    );

    this.butterflies[i].velocity.set(0.15, 0, 0.15);
    this.butterflies[i].applyMatrices();
  }
}

// Boid rules:
// 1. Separation - steer to avoid crowding local swarmmates
// 2. Alignment - steer toward average heading of local swarmmates
// 3. Cohesion - steer to move toward average position of local swarmmates

const xMin = -60;
const xMax = 60;
const yMin = 10;
const yMax = 60;
const zMin = -60;
const zMax = 60;
const maxSpeed = 0.3;

// Updated every frame
Swarm.prototype.move = function () {
  const sumPosition = new THREE.Vector3();
  this.butterflies.forEach((butterfly) => {
    sumPosition.add(butterfly.getPosition());
  });

  this.butterflies.forEach((butterfly) => {
    // Find average position of butterfly's swarmmates and move toward it
    const avgPosition = sumPosition.sub(butterfly.getPosition());
    avgPosition.divideScalar(this.butterflies.length);
    butterfly.velocity.addScaledVector(avgPosition, 0.0001);

    // Confine butterfly within a space
    if (butterfly.getPosition().x < xMin) {
      butterfly.velocity.x += 0.05;
      butterfly.rotate();
    } else if (butterfly.getPosition().x > xMax) {
      butterfly.velocity.x -= 0.05;
      butterfly.rotate();
    }
    if (butterfly.getPosition().y < yMin) {
      butterfly.velocity.y += 0.05;
      butterfly.rotate();
    } else if (butterfly.getPosition().y > yMax) {
      butterfly.velocity.y -= 0.05;
      butterfly.rotate();
    }
    if (butterfly.getPosition().z < zMin) {
      butterfly.velocity.z += 0.05;
      butterfly.rotate();
    } else if (butterfly.getPosition().z > zMax) {
      butterfly.velocity.z -= 0.05;
      butterfly.rotate();
    }
    if (butterfly.thorax.position.z < zMin) {
      butterfly.velocity.z += 0.05;
      butterfly.rotate();
    } else if (butterfly.thorax.position.z > zMax) {
      butterfly.velocity.z -= 0.05;
      butterfly.rotate();
    }

    // Limit speed
    butterfly.velocity.clampScalar(-maxSpeed, maxSpeed);

    butterfly.translate(butterfly.velocity);
    butterfly.flap();
  });
};

export default Swarm;
