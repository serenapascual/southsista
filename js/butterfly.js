import * as THREE from '../node_modules/three/build/three.module.js';

const { PI, cos, sin } = Math;

const Colors = {
  tortoiseshellOrange: 0xce8248,
  tortoiseshellBrown: 0x594a36,
};

/* MATERIALS */
const orangeMat = new THREE.MeshPhongMaterial({
  color: Colors.tortoiseshellOrange,
  flatShading: true,
});
const brownMat = new THREE.MeshPhongMaterial({
  color: Colors.tortoiseshellBrown,
  flatShading: true,
});

/*
  A butterfly's body comprises three segments - the head, thorax, and abdomen.
  All butterflies have four wings as well - left forewing, right forewing,
  left hindwing, right hindwing.
*/
function Butterfly() {
  this.phase = 0;
  this.rotateMatrix = new THREE.Matrix4();
  this.translateMatrix = new THREE.Matrix4();
  this.velocity = new THREE.Vector3();

  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.wings = new THREE.Group();
  this.mesh.add(this.body);
  this.mesh.add(this.wings);

  const headGeo = new THREE.BoxGeometry(1, 1, 1);
  headGeo.translate(0, 0.3, 2.45 + 2.5);
  this.head = new THREE.Mesh(headGeo, brownMat);
  this.body.add(this.head);

  const thoraxGeo = new THREE.BoxGeometry(3.5, 1, 1.5);
  thoraxGeo.rotateY(PI / 2);
  thoraxGeo.translate(0, 0, 2.5);
  this.thorax = new THREE.Mesh(thoraxGeo, brownMat);
  this.body.add(this.thorax);

  const abdomenGeo = new THREE.BoxGeometry(2, 0.75, 1);
  abdomenGeo.rotateZ(0.9375 * PI);
  abdomenGeo.rotateY(PI / 2);
  abdomenGeo.translate(0, -0.2, 0);
  this.abdomen = new THREE.Mesh(abdomenGeo, brownMat);
  this.body.add(this.abdomen);

  const antennaLGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaLGeo.rotateZ(1.125 * PI);
  antennaLGeo.rotateX(0.175 * PI);
  antennaLGeo.translate(-0.35, 1.25, 3 + 2.5);
  this.antennaL = new THREE.Mesh(antennaLGeo, brownMat);
  this.body.add(this.antennaL);

  const antennaRGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaRGeo.rotateZ(-1.125 * PI);
  antennaRGeo.rotateX(0.175 * PI);
  antennaRGeo.translate(0.35, 1.25, 3 + 2.5);
  this.antennaR = new THREE.Mesh(antennaRGeo, brownMat);
  this.body.add(this.antennaR);

  /* LEFT WINGS */
  this.forewingLGeo = new THREE.BoxGeometry(5, 0.15, 2.5);
  this.forewingLGeo.rotateX(-0.015 * PI);
  this.forewingLGeo.translate(3.4, 0.1, 0.5 + 2.5);

  this.forewingLGeo.vertices[0].x += 2.5; // front-left-top
  this.forewingLGeo.vertices[0].z += 2.0;
  this.forewingLGeo.vertices[2].x = this.forewingLGeo.vertices[0].x; // front-left-bottom
  this.forewingLGeo.vertices[2].z = this.forewingLGeo.vertices[0].z;
  this.forewingLGeo.vertices[1].x += 1.5; // back-left-top
  this.forewingLGeo.vertices[3].x = this.forewingLGeo.vertices[1].x; // back-left-bottom

  this.forewingL = new THREE.Mesh(this.forewingLGeo, orangeMat);
  this.wings.add(this.forewingL);

  this.hindwingLGeo = new THREE.BoxGeometry(1.5, 0.15, 2.5);
  this.hindwingLGeo.rotateX(0.015 * PI);
  this.hindwingLGeo.translate(1.6, -0.2, -2.0 + 2.5);

  this.hindwingLGeo.vertices[0].z += 0.5; // front-left-top
  this.hindwingLGeo.vertices[0].x += 4.0;
  this.hindwingLGeo.vertices[2].z = this.hindwingLGeo.vertices[0].z; // front-left-bottom
  this.hindwingLGeo.vertices[2].x = this.hindwingLGeo.vertices[0].x;
  this.hindwingLGeo.vertices[1].z -= 2.0; // back-left-top
  this.hindwingLGeo.vertices[1].x += 3.5;
  this.hindwingLGeo.vertices[3].z = this.hindwingLGeo.vertices[1].z; // back-left-bottom
  this.hindwingLGeo.vertices[3].x = this.hindwingLGeo.vertices[1].x;

  this.hindwingL = new THREE.Mesh(this.hindwingLGeo, orangeMat);
  this.wings.add(this.hindwingL);

  /* RIGHT WINGS */
  this.forewingRGeo = new THREE.BoxGeometry(5, 0.15, 2.5);
  this.forewingRGeo.rotateX(-0.015 * PI);
  this.forewingRGeo.translate(-3.4, 0.1, 0.5 + 2.5);

  this.forewingRGeo.vertices[5].x = -this.forewingLGeo.vertices[0].x; // front-right-top
  this.forewingRGeo.vertices[5].z = this.forewingLGeo.vertices[0].z;
  this.forewingRGeo.vertices[7].x = -this.forewingLGeo.vertices[2].x; // front-right-bottom
  this.forewingRGeo.vertices[7].z = this.forewingLGeo.vertices[2].z;
  this.forewingRGeo.vertices[4].x = -this.forewingLGeo.vertices[1].x; // back-right-top
  this.forewingRGeo.vertices[6].x = -this.forewingLGeo.vertices[3].x; // back-right-bottom

  this.forewingR = new THREE.Mesh(this.forewingRGeo, orangeMat);
  this.wings.add(this.forewingR);

  this.hindwingRGeo = new THREE.BoxGeometry(1.5, 0.15, 2.5);
  this.hindwingRGeo.rotateX(0.015 * PI);
  this.hindwingRGeo.translate(-1.7, -0.2, -2.0 + 2.5);

  this.hindwingRGeo.vertices[5].z = this.hindwingLGeo.vertices[0].z; // front-right-top
  this.hindwingRGeo.vertices[5].x = -this.hindwingLGeo.vertices[0].x;
  this.hindwingRGeo.vertices[7].z = this.hindwingLGeo.vertices[2].z; // front-right-bottom
  this.hindwingRGeo.vertices[7].x = -this.hindwingLGeo.vertices[2].x;
  this.hindwingRGeo.vertices[4].z = this.hindwingLGeo.vertices[1].z; // back-right-top
  this.hindwingRGeo.vertices[4].x = -this.hindwingLGeo.vertices[1].x;
  this.hindwingRGeo.vertices[6].z = this.hindwingLGeo.vertices[3].z; // back-right-bottom
  this.hindwingRGeo.vertices[6].x = -this.hindwingLGeo.vertices[3].x;

  this.hindwingR = new THREE.Mesh(this.hindwingRGeo, orangeMat);
  this.wings.add(this.hindwingR);

  function createShadows(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  }

  this.body.traverse(createShadows);
  this.wings.traverse(createShadows);
}

Butterfly.prototype.flap = function () {
  this.phase += 0.07;
  let t = this.phase;
  t %= (2 * PI); // restrict range to [0, 2pi]
  const p = t - (PI / 32);

  // Constants for vertical/horizontal forewing/hindwing movement
  const verticalFore = 2.5 * sin(t);
  const horizontalFore = 0.5 * cos(t);
  const horizontalHind = 0.5 * cos(p);
  const lagVerticalFore = 1.2 * sin(t - 1);
  const lagVerticalHind = 2.2 * sin(p - 1);
  const lagHorizontalFore = 0.5 * cos(t - 0.3);
  const lagHorizontalHind = 0.5 * cos(p - 0.3);
  const verticalGeneral = sin(t);

  // Check sign to determine movement increase or decrease along axis
  function sign(x) {
    return x / Math.abs(x);
  }

  const xFore = 7.5;

  // Set X-axis translation for left wings
  // if (sign(lagHorizontalFore) < 0) {
  this.forewingLGeo.vertices[0].x = lagHorizontalFore + xFore;
  this.forewingLGeo.vertices[2].x = this.forewingLGeo.vertices[0].x;
  // } else {
  //   this.forewingLGeo.vertices[0].x = lagHorizontalFore * 1 + xFore;
  //   this.forewingLGeo.vertices[2].x = this.forewingLGeo.vertices[0].x;
  // }
  // if (sign(lagHorizontalHind) < 0) {
  this.hindwingLGeo.vertices[0].x = lagHorizontalHind + xFore - 3.0;
  this.hindwingLGeo.vertices[2].x = this.hindwingLGeo.vertices[0].x;
  // } else {
  //   this.hindwingLGeo.vertices[0].x = lagHorizontalHind * 1 + xFore - 0.5;
  //   this.hindwingLGeo.vertices[2].x = this.hindwingLGeo.vertices[0].x;
  // }
  this.forewingLGeo.vertices[1].x = horizontalFore + xFore - 3.0;
  this.forewingLGeo.vertices[3].x = this.forewingLGeo.vertices[1].x;
  this.hindwingLGeo.vertices[1].x = horizontalHind + xFore - 4.0;
  this.hindwingLGeo.vertices[3].x = this.hindwingLGeo.vertices[1].x;

  // Set Y-axis translation for left wings
  // Increase speed when wings are down
  if (sign(verticalFore) > 0) {
    this.forewingLGeo.vertices[0].y = -verticalFore;
  } else {
    this.forewingLGeo.vertices[0].y = -verticalFore * 1.2;
  }
  this.forewingLGeo.vertices[2].y = this.forewingLGeo.vertices[0].y - 0.15;

  this.hindwingLGeo.vertices[0].y = this.forewingLGeo.vertices[1].y - 0.5;
  this.hindwingLGeo.vertices[2].y = this.hindwingLGeo.vertices[0].y - 0.15;

  // Set cycle offset for back outer vertices of both wings
  if (sign(lagVerticalFore) > 0) {
    this.forewingLGeo.vertices[1].y = -lagVerticalFore + 0.75;
  } else {
    this.forewingLGeo.vertices[1].y = -lagVerticalFore * 1.2 + 0.75;
  }
  this.forewingLGeo.vertices[3].y = this.forewingLGeo.vertices[1].y - 0.15;

  if (sign(lagVerticalHind) > 0) {
    this.hindwingLGeo.vertices[1].y = -lagVerticalHind;
  } else {
    this.hindwingLGeo.vertices[1].y = -lagVerticalHind * 1.2;
  }
  this.hindwingLGeo.vertices[3].y = this.hindwingLGeo.vertices[1].y - 0.15;

  // Set right wings to mirror left
  this.forewingRGeo.vertices[5].y = this.forewingLGeo.vertices[0].y;
  this.forewingRGeo.vertices[7].y = this.forewingLGeo.vertices[2].y;
  this.forewingRGeo.vertices[5].x = -this.forewingLGeo.vertices[0].x;
  this.forewingRGeo.vertices[7].x = -this.forewingLGeo.vertices[2].x;
  this.forewingRGeo.vertices[4].y = this.forewingLGeo.vertices[1].y;
  this.forewingRGeo.vertices[6].y = this.forewingLGeo.vertices[3].y;
  this.forewingRGeo.vertices[4].x = -this.forewingLGeo.vertices[1].x;
  this.forewingRGeo.vertices[6].x = -this.forewingLGeo.vertices[3].x;

  this.hindwingRGeo.vertices[5].y = this.hindwingLGeo.vertices[0].y;
  this.hindwingRGeo.vertices[7].y = this.hindwingLGeo.vertices[2].y;
  this.hindwingRGeo.vertices[5].x = -this.hindwingLGeo.vertices[0].x;
  this.hindwingRGeo.vertices[7].x = -this.hindwingLGeo.vertices[2].x;
  this.hindwingRGeo.vertices[4].y = this.hindwingLGeo.vertices[1].y;
  this.hindwingRGeo.vertices[6].y = this.hindwingLGeo.vertices[3].y;
  this.hindwingRGeo.vertices[4].x = -this.hindwingLGeo.vertices[1].x;
  this.hindwingRGeo.vertices[6].x = -this.hindwingLGeo.vertices[3].x;

  this.forewingLGeo.verticesNeedUpdate = true;
  this.hindwingLGeo.verticesNeedUpdate = true;
  this.forewingRGeo.verticesNeedUpdate = true;
  this.hindwingRGeo.verticesNeedUpdate = true;

  // Apply translations to all butterfly parts
  this.antennaL.translateY(verticalGeneral * -0.035);
  this.antennaR.translateY(verticalGeneral * -0.035);
  this.head.translateY(verticalGeneral * -0.035);
  this.thorax.translateY(verticalGeneral * -0.02);
  this.abdomen.rotateX(verticalGeneral * 0.025);
  this.forewingL.translateY(verticalGeneral * -0.02);
  this.forewingR.translateY(verticalGeneral * -0.02);
  this.hindwingL.translateY(verticalGeneral * -0.02);
  this.hindwingR.translateY(verticalGeneral * -0.02);
};

Butterfly.prototype.getRotateMatrix = function () {
  return this.rotateMatrix;
};

Butterfly.prototype.getTranslateMatrix = function () {
  return this.translateMatrix;
};

Butterfly.prototype.applyMatrices = function () {
  const updateMeshes = (object) => {
    if (object instanceof THREE.Mesh) {
      object.applyMatrix4(this.getRotateMatrix());
      object.applyMatrix4(this.getTranslateMatrix());
    }
  };

  this.mesh.traverse(updateMeshes);

  // Reset matrices so that initial transforms are not applied every frame
  this.translateMatrix.identity();
  this.rotateMatrix.identity();
};

// Turn to face point in world space
Butterfly.prototype.rotate = function (direction) {
  const updateMeshes = (object) => {
    if (object instanceof THREE.Mesh) {
      object.lookAt(direction.x, direction.y, direction.z);
    }
  };
  this.mesh.traverse(updateMeshes);
};

// Local translate
Butterfly.prototype.translate = function (velocity) {
  const updateMeshes = (object) => {
    if (object instanceof THREE.Mesh) {
      object.position.x += velocity.x;
      object.position.y += velocity.y;
      object.position.z += velocity.z;
    }
  };
  this.mesh.traverse(updateMeshes);
};
export default Butterfly;
