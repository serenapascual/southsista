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
  this.numButterflies = 3;

  // Initialize positions
  for (let i = 0; i < this.numButterflies; i += 1) {
    this.butterflies.push(new Butterfly());

    this.butterflies[i].setId(i);
    this.butterflies[i].setPhase(i * PI * 0.5);

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

const xMin = -75;
const xMax = 75;
const yMin = 10;
const yMax = 75;
const zMin = -75;
const zMax = 75;
const maxSpeed = 0.25;
const minDistance = 20;

// Updated every frame
Swarm.prototype.move = function move() {
  const sumPosition = new THREE.Vector3();
  this.butterflies.forEach((butterfly) => {
    sumPosition.add(butterfly.getPosition());
  });

  this.butterflies.forEach((butterfly) => {
    // Separation
    for (let i = 0; i < this.numButterflies; i += 1) {
      if (i !== butterfly.getId()) {
        if (butterfly.getPosition().distanceTo(this.butterflies[i].getPosition()) < minDistance) {
          console.log('too close bro');
          let v = new THREE.Vector3();
          v.subVectors(butterfly.getVelocity(), this.butterflies[i].getVelocity());
          butterfly.velocity.add(v);
        }
      }
    }

    // Cohesion
    const avgPosition = sumPosition.sub(butterfly.getPosition());
    avgPosition.divideScalar(this.numButterflies - 1);
    butterfly.velocity.addScaledVector(avgPosition, 0.0005);

    // Confine butterfly within a space
    if (butterfly.getPosition().x < xMin) {
      butterfly.setVelocityX(0.05);
    } else if (butterfly.getPosition().x > xMax) {
      butterfly.setVelocityX(-0.05);
    }
    if (butterfly.getPosition().y < yMin) {
      butterfly.setVelocityY(0.05);
    } else if (butterfly.getPosition().y > yMax) {
      // butterfly.velocity.multiplyScalar(-1);
      butterfly.setVelocityY(-0.05);
    }
    if (butterfly.getPosition().z < zMin) {
      butterfly.setVelocityZ(0.05);
    } else if (butterfly.getPosition().z > zMax) {
      butterfly.setVelocityZ(-0.05);
    }

    // Limit speed
    butterfly.velocity.clampScalar(-maxSpeed, maxSpeed);

    // Alignment based on average position (i.e. perceived center of swarm)
    butterfly.rotate();
    butterfly.translate();
    butterfly.flap();
  });
};

export default Swarm;
