import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const { PI, cos, sin } = Math;

const Colors = {
  skyBlue: 0xc5daed,
  lakeBlue: 0x8abac6,
  tortoiseshellOrange: 0xce8248,
  tortoiseshellBrown: 0x594a36,
  tortoiseshellBlack: 0x303030,
  screeRed: 0x632d2b,
  cinderGrey: 0x3a3947,
  glacierGrey: 0x929daf,
  glacierWhite: 0xd0d8e5,
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

// window.addEventListener('load', init, false);
let scene;
let camera;
let aspectRatio;
let renderer;
let controls;
const butterflies = [];

function handleWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function createScene() {
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  aspectRatio = window.innerWidth / window.innerHeight;
  const fov = 60;
  const nearPlane = 1;
  const farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    nearPlane,
    farPlane,
  );

  camera.position.x = 25;
  camera.position.y = 10;
  camera.position.z = 25;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new OrbitControls(camera, renderer.domElement);

  const container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

function createLights() {
  const globalLight = new THREE.AmbientLight(0xfff5e0, 0.2);
  const pointLight = new THREE.PointLight(0xfff5e0, 1);
  pointLight.position.set(25, 50, 25);

  scene.add(globalLight);
  scene.add(pointLight);
}

/*
  A butterfly's body comprises three segments - the head, thorax, and abdomen.
  All butterflies have four wings as well - left forewing, right forewing,
  left hindwing, right hindwing.
*/
function Butterfly() {
  this.noiseMatrix = new THREE.Matrix4();
  this.noiseMatrix.set(1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);

  this.phase = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.wings = new THREE.Group();
  this.mesh.add(this.body);
  this.mesh.add(this.wings);

  const headGeo = new THREE.BoxGeometry(1, 1, 1);
  this.head = new THREE.Mesh(headGeo, brownMat);
  this.head.position.x = -2.45;
  this.head.position.y = 0.3;
  this.head.castShadow = true;
  this.head.receiveShadow = true;
  this.body.add(this.head);

  const thoraxGeo = new THREE.BoxGeometry(3.5, 1, 1.5);
  this.thorax = new THREE.Mesh(thoraxGeo, brownMat);
  this.body.add(this.thorax);

  const abdomenGeo = new THREE.BoxGeometry(2, 0.75, 1);
  abdomenGeo.rotateZ(0.9375 * PI);
  this.abdomen = new THREE.Mesh(abdomenGeo, brownMat);
  this.abdomen.position.x = 2.9;
  this.abdomen.position.y = -0.2;
  this.body.add(this.abdomen);

  const antennaLGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaLGeo.rotateZ(1.175 * PI);
  antennaLGeo.rotateX(0.125 * PI);
  antennaLGeo.translate(-3, 1.25, 0.35);
  this.antennaL = new THREE.Mesh(antennaLGeo, brownMat);
  this.body.add(this.antennaL);

  const antennaRGeo = new THREE.ConeGeometry(0.075, 2, 5);
  antennaRGeo.rotateZ(1.175 * PI);
  antennaRGeo.rotateX(-0.125 * PI);
  antennaRGeo.translate(-3, 1.25, -0.35);
  this.antennaR = new THREE.Mesh(antennaRGeo, brownMat);
  this.body.add(this.antennaR);

  /* LEFT WINGS */
  this.forewingLGeo = new THREE.BoxGeometry(2.2, 0.15, 5);
  this.forewingLGeo.rotateX(0.0625 * PI);

  // this.forewingLGeo.translate(-0.5, -0.3, 3.4);
  this.forewingLGeo.vertices[5].x -= 2.5; // front-left-top
  this.forewingLGeo.vertices[5].z += 2.5;
  this.forewingLGeo.vertices[7].x -= 2.5; // front-left-bottom
  this.forewingLGeo.vertices[7].z += 2.5;
  this.forewingLGeo.vertices[0].x += 1.5; // back-left-top
  this.forewingLGeo.vertices[2].x += 1.5; // back-left-bottom

  this.forewingL = new THREE.Mesh(this.forewingLGeo, orangeMat);
  this.forewingL.position.x = -0.5;
  this.forewingL.position.y = -0.3;
  this.forewingL.position.z = 3.4;
  this.wings.add(this.forewingL);

  this.hindwingLGeo = new THREE.BoxGeometry(1.5, 0.15, 3.75);
  this.hindwingLGeo.rotateX(0.0625 * PI);

  this.hindwingLGeo.vertices[5].z += 1.25; // front-left-top
  this.hindwingLGeo.vertices[5].x += 1.0;
  this.hindwingLGeo.vertices[7].z += 1.25; // front-left-bottom
  this.hindwingLGeo.vertices[7].x += 1.0;
  this.hindwingLGeo.vertices[0].x += 4.5; // back-left-top
  this.hindwingLGeo.vertices[0].z -= 1.5;
  this.hindwingLGeo.vertices[2].x += 4.5; // back-left-bottom
  this.hindwingLGeo.vertices[2].z -= 1.5;
  this.hindwingL = new THREE.Mesh(this.hindwingLGeo, orangeMat);
  // this.hindwingL.rotateZ(-0.03125 * PI);
  this.hindwingL.position.x = 1.3;
  this.hindwingL.position.y = -0.4;
  this.hindwingL.position.z = 2.775;
  this.wings.add(this.hindwingL);

  /* RIGHT WINGS */
  this.forewingRGeo = new THREE.BoxGeometry(2.2, 0.15, 5);
  this.forewingRGeo.rotateX(-0.0625 * PI);
  this.forewingRGeo.vertices[4].x -= 2.5; // front-right-top
  this.forewingRGeo.vertices[4].z -= 2.5;
  this.forewingRGeo.vertices[6].x -= 2.5; // front-right-bottom
  this.forewingRGeo.vertices[6].z -= 2.5;
  this.forewingRGeo.vertices[1].x += 1.5; // back-right-top
  this.forewingRGeo.vertices[3].x += 1.5; // back-right-bottom

  this.forewingR = new THREE.Mesh(this.forewingRGeo, orangeMat);
  this.forewingR.position.x = -0.5;
  this.forewingR.position.y = -0.3;
  this.forewingR.position.z = -3.4;
  this.wings.add(this.forewingR);

  this.hindwingRGeo = new THREE.BoxGeometry(1.5, 0.15, 3.75);
  this.hindwingRGeo.rotateX(-0.0625 * PI);
  this.hindwingRGeo.vertices[4].z -= 1.25; // front-right-top
  this.hindwingRGeo.vertices[4].x += 1;
  this.hindwingRGeo.vertices[6].z -= 1.25; // front-right-bottom
  this.hindwingRGeo.vertices[6].x += 1;
  this.hindwingRGeo.vertices[1].x += 4.5; // back-right-top
  this.hindwingRGeo.vertices[1].z += 1.5;
  this.hindwingRGeo.vertices[3].x += 4.5; // back-right-bottom
  this.hindwingRGeo.vertices[3].z += 1.5;

  this.hindwingR = new THREE.Mesh(this.hindwingRGeo, orangeMat);
  this.hindwingR.position.x = 1.3;
  this.hindwingR.position.y = -0.4;
  this.hindwingR.position.z = -2.775;
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

function createButterfly() {
  const butterfly = new Butterfly();
  butterflies.push(butterfly);
  scene.add(butterfly.mesh);
}

Butterfly.prototype.fly = function () {
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

  // Set Z-axis translation for left wings
  if (sign(lagHorizontalFore) < 0) {
    this.forewingLGeo.vertices[5].z = lagHorizontalFore * 1 + 2.75;
    this.forewingLGeo.vertices[7].z = this.forewingLGeo.vertices[5].z;
  } else {
    this.forewingLGeo.vertices[5].z = lagHorizontalFore * 1 + 2.75;
    this.forewingLGeo.vertices[7].z = this.forewingLGeo.vertices[5].z;
  }
  if (sign(lagHorizontalHind) < 0) {
    this.hindwingLGeo.vertices[5].z = lagHorizontalHind * 1 + 2.25;
    this.hindwingLGeo.vertices[7].z = this.hindwingLGeo.vertices[5].z;
  } else {
    this.hindwingLGeo.vertices[5].z = lagHorizontalHind * 1 + 2.25;
    this.hindwingLGeo.vertices[7].z = this.hindwingLGeo.vertices[5].z;
  }
  this.forewingLGeo.vertices[0].z = horizontalFore * 0.75 + 2.0;
  this.forewingLGeo.vertices[2].z = this.forewingLGeo.vertices[0].z;
  this.hindwingLGeo.vertices[0].z = horizontalHind * 1 + 1.75;
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
  const m = new THREE.Matrix4();
  m.set(
    1, 0, 0, 0,
    0, 1, 0, verticalFore * -0.035,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );
  // const m2 = new THREE.Matrix4();
  // m2.set(
  //   cos(t / 128), -sin(t / 128), 0, 0,
  //   sin(t / 128), cos(t / 128), 0, 0,
  //   0, 0, 1, 0,
  //   0, 0, 0, 1);

  this.antennaL.applyMatrix4(m);
  this.antennaR.applyMatrix4(m);
  this.head.translateY(verticalFore * -0.035);
  this.thorax.translateY(verticalFore * -0.02);
  this.abdomen.rotateZ(verticalFore * 0.025);
  this.forewingL.translateY(verticalFore * -0.02);
  this.forewingR.translateY(verticalFore * -0.02);
  this.hindwingL.translateY(verticalFore * -0.02);
  this.hindwingR.translateY(verticalFore * -0.02);
};

function showAxes() {
  const redMat = new THREE.LineBasicMaterial({
    color: 0xff0000,
  });
  const greenMat = new THREE.LineBasicMaterial({
    color: 0x00ff00,
  });
  const blueMat = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });
  const origin = new THREE.Vector3(0, 0, 0);
  const x = new THREE.Vector3(10, 0, 0);
  const y = new THREE.Vector3(0, 10, 0);
  const z = new THREE.Vector3(0, 0, 10);

  const xGeo = new THREE.BufferGeometry().setFromPoints([origin, x]);
  const xAxis = new THREE.Line(xGeo, redMat);
  const yGeo = new THREE.BufferGeometry().setFromPoints([origin, y]);
  const yAxis = new THREE.Line(yGeo, greenMat);
  const zGeo = new THREE.BufferGeometry().setFromPoints([origin, z]);
  const zAxis = new THREE.Line(zGeo, blueMat);

  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);
}

function init() {
  createScene();
  createLights();
  createButterfly();

  // test transform of second butterfly
  createButterfly();
  butterflies[1].noiseMatrix.set(
    1, 0, 0, 6,
    0, 1, 0, 6,
    0, 0, 1, 6,
    0, 0, 0, 1,
  );
  const m = butterflies[1].noiseMatrix;
  function applyNoise(object) {
    if (object instanceof THREE.Mesh) {
      object.applyMatrix4(m);
    }
  }
  butterflies[1].mesh.traverse(applyNoise);

  showAxes();
}

function draw() {
  controls.update();
  butterflies.forEach((butterfly) => {
    butterfly.fly();
  });
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

init();
draw();
