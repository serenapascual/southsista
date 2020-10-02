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

  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.wings = new THREE.Group();
  this.mesh.add(this.body);
  this.mesh.add(this.wings);

  const headGeo = new THREE.BoxGeometry(1, 1, 1);
  headGeo.translate(0, 0.3, 2.45);
  this.head = new THREE.Mesh(headGeo, brownMat);
  this.body.add(this.head);

  const thoraxGeo = new THREE.BoxGeometry(3.5, 1, 1.5);
  thoraxGeo.rotateY(PI / 2);
  this.thorax = new THREE.Mesh(thoraxGeo, brownMat);
  this.body.add(this.thorax);

  const abdomenGeo = new THREE.BoxGeometry(2, 0.75, 1);
  abdomenGeo.rotateZ(0.9375 * PI);
  abdomenGeo.rotateY(PI / 2);
  abdomenGeo.translate(-0.1, -0.2, -2.9);
  this.abdomen = new THREE.Mesh(abdomenGeo, brownMat);
  this.body.add(this.abdomen);

  const antennaLGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaLGeo.rotateZ(1.125 * PI);
  antennaLGeo.rotateX(0.175 * PI);
  antennaLGeo.translate(-0.35, 1.25, 3);
  this.antennaL = new THREE.Mesh(antennaLGeo, brownMat);
  this.body.add(this.antennaL);

  const antennaRGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaRGeo.rotateZ(-1.125 * PI);
  antennaRGeo.rotateX(0.175 * PI);
  antennaRGeo.translate(0.35, 1.25, 3);
  this.antennaR = new THREE.Mesh(antennaRGeo, brownMat);
  this.body.add(this.antennaR);

  /* LEFT WINGS */
  this.forewingLGeo = new THREE.BoxGeometry(5, 0.15, 2.2);
  this.forewingLGeo.rotateZ(0.0625 * PI);
  this.forewingLGeo.translate(3.4, -0.3, 0.5);

  this.forewingLGeo.vertices[0].x += 2.5; // front-left-top
  this.forewingLGeo.vertices[0].z += 2.5;
  this.forewingLGeo.vertices[2].x += 2.5; // front-left-bottom
  this.forewingLGeo.vertices[2].z += 2.5;
  this.forewingLGeo.vertices[1].x += 1.5; // back-left-top
  this.forewingLGeo.vertices[3].x += 1.5; // back-left-bottom

  this.forewingL = new THREE.Mesh(this.forewingLGeo, orangeMat);
  this.wings.add(this.forewingL);

  this.hindwingLGeo = new THREE.BoxGeometry(1.5, 0.15, 3.75);
  this.hindwingLGeo.rotateZ(0.0625 * PI);
  this.hindwingLGeo.translate(1.3, -0.4, -2.775);

  this.hindwingLGeo.vertices[0].z += 1.25; // front-left-top
  this.hindwingLGeo.vertices[0].x += 1.0;
  this.hindwingLGeo.vertices[2].z += 1.25; // front-left-bottom
  this.hindwingLGeo.vertices[2].x += 1.0;
  this.hindwingLGeo.vertices[1].x += 4.5; // back-left-top
  this.hindwingLGeo.vertices[1].z -= 1.5;
  this.hindwingLGeo.vertices[3].x += 4.5; // back-left-bottom
  this.hindwingLGeo.vertices[3].z -= 1.5;

  this.hindwingL = new THREE.Mesh(this.hindwingLGeo, orangeMat);
  this.wings.add(this.hindwingL);

  /* RIGHT WINGS */
  this.forewingRGeo = new THREE.BoxGeometry(5, 0.15, 2.2);
  this.forewingRGeo.rotateZ(-0.0625 * PI);
  this.forewingRGeo.translate(-3.4, -0.3, 0.5);

  this.forewingRGeo.vertices[5].x -= 2.5; // front-right-top
  this.forewingRGeo.vertices[5].z += 2.5;
  this.forewingRGeo.vertices[7].x -= 2.5; // front-right-bottom
  this.forewingRGeo.vertices[7].z += 2.5;
  this.forewingRGeo.vertices[4].x -= 1.5; // back-right-top
  this.forewingRGeo.vertices[6].x -= 1.5; // back-right-bottom

  this.forewingR = new THREE.Mesh(this.forewingRGeo, orangeMat);
  this.wings.add(this.forewingR);

  this.hindwingRGeo = new THREE.BoxGeometry(1.5, 0.15, 3.75);
  this.hindwingRGeo.rotateZ(-0.0625 * PI);
  this.hindwingRGeo.translate(-1.3, -0.4, -2.775);

  this.hindwingRGeo.vertices[5].z += 1.25; // front-right-top
  this.hindwingRGeo.vertices[5].x -= 1;
  this.hindwingRGeo.vertices[7].z += 1.25; // front-right-bottom
  this.hindwingRGeo.vertices[7].x -= 1;
  this.hindwingRGeo.vertices[4].x -= 4.5; // back-right-top
  this.hindwingRGeo.vertices[4].z -= 1.5;
  this.hindwingRGeo.vertices[6].x -= 4.5; // back-right-bottom
  this.hindwingRGeo.vertices[6].z -= 1.5;

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
  const verticalFore = sin(t);
  const horizontalFore = cos(t);
  const horizontalHind = cos(p);
  const lagVerticalFore = sin(t - 1);
  const lagVerticalHind = sin(p - 1);
  const lagHorizontalFore = cos(t - 0.3);
  const lagHorizontalHind = cos(p - 0.3);

  // Check sign to determine movement increase or decrease along axis
  function sign(x) {
    return x / Math.abs(x);
  }

  const zFore = 4.75;

  // Set Z-axis translation for left wings
  if (sign(lagHorizontalFore) < 0) {
    this.forewingLGeo.vertices[5].z = lagHorizontalFore * 1 + zFore;
    this.forewingLGeo.vertices[7].z = this.forewingLGeo.vertices[5].z;
  } else {
    this.forewingLGeo.vertices[5].z = lagHorizontalFore * 1 + zFore;
    this.forewingLGeo.vertices[7].z = this.forewingLGeo.vertices[5].z;
  }
  if (sign(lagHorizontalHind) < 0) {
    this.hindwingLGeo.vertices[5].z = lagHorizontalHind * 1 + zFore - 0.5;
    this.hindwingLGeo.vertices[7].z = this.hindwingLGeo.vertices[5].z;
  } else {
    this.hindwingLGeo.vertices[5].z = lagHorizontalHind * 1 + zFore - 0.5;
    this.hindwingLGeo.vertices[7].z = this.hindwingLGeo.vertices[5].z;
  }
  this.forewingLGeo.vertices[0].z = horizontalFore * 0.75 + zFore - 0.75;
  this.forewingLGeo.vertices[2].z = this.forewingLGeo.vertices[0].z;
  this.hindwingLGeo.vertices[0].z = horizontalHind * 1 + zFore - 1.0;
  this.hindwingLGeo.vertices[2].z = this.hindwingLGeo.vertices[0].z;

  // Set Y-axis translation for left wings
  // Increase speed when wings are down
  if (sign(verticalFore) > 0) {
    this.forewingLGeo.vertices[5].y = -verticalFore * 2.5;
    this.forewingLGeo.vertices[7].y = this.forewingLGeo.vertices[5].y - 0.15;
  } else {
    this.forewingLGeo.vertices[5].y = -verticalFore * 3;
    this.forewingLGeo.vertices[7].y = this.forewingLGeo.vertices[5].y - 0.15;
  }
  this.hindwingLGeo.vertices[5].y = this.forewingLGeo.vertices[0].y - 0.25;
  this.hindwingLGeo.vertices[7].y = this.hindwingLGeo.vertices[5].y - 0.15;

  // Set cycle offset for back outer vertices of both wings
  if (sign(lagVerticalFore) > 0) {
    this.forewingLGeo.vertices[0].y = -lagVerticalFore * 1 + 0.5;
    this.forewingLGeo.vertices[2].y = this.forewingLGeo.vertices[0].y - 0.15;
  } else {
    this.forewingLGeo.vertices[0].y = -lagVerticalFore * 1.25 + 0.5;
    this.forewingLGeo.vertices[2].y = this.forewingLGeo.vertices[0].y - 0.15;
  }
  if (sign(lagVerticalHind) > 0) {
    this.hindwingLGeo.vertices[0].y = -lagVerticalHind * 2;
    this.hindwingLGeo.vertices[2].y = this.hindwingLGeo.vertices[0].y - 0.15;
  } else {
    this.hindwingLGeo.vertices[0].y = -lagVerticalHind * 2.5;
    this.hindwingLGeo.vertices[2].y = this.hindwingLGeo.vertices[0].y - 0.15;
  }

  // Set right wings to mirror left
  this.forewingRGeo.vertices[4].y = this.forewingLGeo.vertices[5].y;
  this.forewingRGeo.vertices[6].y = this.forewingLGeo.vertices[7].y;
  this.forewingRGeo.vertices[4].z = -this.forewingLGeo.vertices[5].z;
  this.forewingRGeo.vertices[6].z = -this.forewingLGeo.vertices[7].z;
  this.forewingRGeo.vertices[1].y = this.forewingLGeo.vertices[0].y;
  this.forewingRGeo.vertices[3].y = this.forewingLGeo.vertices[2].y;
  this.forewingRGeo.vertices[1].z = -this.forewingLGeo.vertices[0].z;
  this.forewingRGeo.vertices[3].z = -this.forewingLGeo.vertices[2].z;

  this.hindwingRGeo.vertices[4].y = this.hindwingLGeo.vertices[5].y;
  this.hindwingRGeo.vertices[6].y = this.hindwingLGeo.vertices[7].y;
  this.hindwingRGeo.vertices[4].z = -this.hindwingLGeo.vertices[5].z;
  this.hindwingRGeo.vertices[6].z = -this.hindwingLGeo.vertices[7].z;
  this.hindwingRGeo.vertices[1].y = this.hindwingLGeo.vertices[0].y;
  this.hindwingRGeo.vertices[3].y = this.hindwingLGeo.vertices[2].y;
  this.hindwingRGeo.vertices[1].z = -this.hindwingLGeo.vertices[0].z;
  this.hindwingRGeo.vertices[3].z = -this.hindwingLGeo.vertices[2].z;

  this.forewingLGeo.verticesNeedUpdate = true;
  this.hindwingLGeo.verticesNeedUpdate = true;
  this.forewingRGeo.verticesNeedUpdate = true;
  this.hindwingRGeo.verticesNeedUpdate = true;

  // Apply translations to all butterfly parts
  this.antennaL.translateY(verticalFore * -0.035);
  this.antennaR.translateY(verticalFore * -0.035);;
  this.head.translateY(verticalFore * -0.035);
  this.thorax.translateY(verticalFore * -0.02);
  this.abdomen.rotateZ(verticalFore * 0.005);
  this.forewingL.translateY(verticalFore * -0.02);
  this.forewingR.translateY(verticalFore * -0.02);
  this.hindwingL.translateY(verticalFore * -0.02);
  this.hindwingR.translateY(verticalFore * -0.02);
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

// Face point in world space
Butterfly.prototype.rotate = function (x, y, z) {
  const updateMeshes = (object) => {
    if (object instanceof THREE.Mesh) {
      object.lookAt(x, y, z);
    }
  };

  this.mesh.traverse(updateMeshes);
};

// Local translate
Butterfly.prototype.translate = function (dX, dY, dZ) {
  const updateMeshes = (object) => {
    if (object instanceof THREE.Mesh) {
      object.position.x += dX;
      object.position.y += dY;
      object.position.z += dZ;
    }
  };

  this.mesh.traverse(updateMeshes);
};
export default Butterfly;
