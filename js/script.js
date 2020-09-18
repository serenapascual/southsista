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
const blackMat = new THREE.MeshPhongMaterial({
  color: Colors.tortoiseshellBlack,
  flatShading: true,
});

// window.addEventListener('load', init, false);
let scene;
let camera;
let aspectRatio;
let renderer;
let controls;
let clock;
let delta;
let butterfly;

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

  clock = new THREE.Clock();

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
  this.phase = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.wings = new THREE.Group();
  this.mesh.add(this.body);
  this.mesh.add(this.wings);

  const headGeo = new THREE.BoxGeometry(1, 1, 1);
  this.head = new THREE.Mesh(headGeo, brownMat);
  this.head.position.x = -2.45;
  this.head.position.y = 0.35;
  this.head.castShadow = true;
  this.head.receiveShadow = true;
  this.body.add(this.head);

  const thoraxGeo = new THREE.BoxGeometry(3.5, 1, 1.5);
  this.thorax = new THREE.Mesh(thoraxGeo, brownMat);
  this.body.add(this.thorax);

  const abdomenGeo = new THREE.BoxGeometry(2, 0.75, 1);
  this.abdomen = new THREE.Mesh(abdomenGeo, brownMat);
  this.abdomen.rotateZ(0.9375 * PI);
  this.abdomen.position.x = 2.9;
  this.abdomen.position.y = -0.2;
  this.body.add(this.abdomen);

  const antennaGeo = new THREE.ConeGeometry(0.075, 2, 5);

  this.antennaL = new THREE.Mesh(antennaGeo, brownMat);
  this.antennaL.rotateX(0.125 * PI);
  this.antennaL.rotateZ(1.175 * PI);
  this.antennaL.position.x = -3.5;
  this.antennaL.position.y = 1.5;
  this.antennaL.position.z = 0.5;
  this.body.add(this.antennaL);

  this.antennaR = new THREE.Mesh(antennaGeo, brownMat);
  this.antennaR.rotateX(-0.125 * PI);
  this.antennaR.rotateZ(1.175 * PI);
  this.antennaR.position.x = -3.5;
  this.antennaR.position.y = 1.5;
  this.antennaR.position.z = -0.5;
  this.body.add(this.antennaR);

  /* LEFT WINGS */
  this.forewingLGeo = new THREE.BoxGeometry(2, 0.15, 4.75);
  this.forewingLGeo.vertices[5].x -= 1.5; // front-left-top
  this.forewingLGeo.vertices[5].z += 2.5;
  this.forewingLGeo.vertices[7].x -= 1.5; // front-left-bottom
  this.forewingLGeo.vertices[7].z += 2.5;
  this.forewingLGeo.vertices[0].x += 2; // back-left-top
  this.forewingLGeo.vertices[2].x += 2; // back-left-bottom

  const forewingL = new THREE.Mesh(this.forewingLGeo, orangeMat);
  forewingL.rotateX(0.0625 * PI);
  forewingL.position.x = -0.5;
  forewingL.position.y = -0.2;
  forewingL.position.z = 3.275;
  this.wings.add(forewingL);

  this.hindwingLGeo = new THREE.BoxGeometry(1.5, 0.15, 4);
  this.hindwingLGeo.vertices[5].z += 1.25; // front-left-top
  this.hindwingLGeo.vertices[5].x += 0.25;
  this.hindwingLGeo.vertices[7].z += 1.25; // front-left-bottom
  this.hindwingLGeo.vertices[7].x += 0.25;
  this.hindwingLGeo.vertices[0].x += 4.5; // back-left-top
  this.hindwingLGeo.vertices[0].z -= 1.5;
  this.hindwingLGeo.vertices[2].x += 4.5; // back-left-bottom
  this.hindwingLGeo.vertices[2].z -= 1.5;
  const hindwingL = new THREE.Mesh(this.hindwingLGeo, orangeMat);
  hindwingL.rotateX(0.0625 * PI);
  hindwingL.rotateZ(-0.03125 * PI);
  hindwingL.position.x = 1.3;
  hindwingL.position.y = -0.4;
  hindwingL.position.z = 2.9;
  this.wings.add(hindwingL);

  /* RIGHT WINGS */
  this.forewingRGeo = new THREE.BoxGeometry(2, 0.15, 4.75);
  this.forewingRGeo.vertices[4].x -= 1.5; // front-right-top
  this.forewingRGeo.vertices[4].z -= 2.5;
  this.forewingRGeo.vertices[6].x -= 1.5; // front-right-bottom
  this.forewingRGeo.vertices[6].z -= 2.5;
  this.forewingRGeo.vertices[1].x += 2; // back-right-top
  this.forewingRGeo.vertices[3].x += 2; // back-right-bottom

  const forewingR = new THREE.Mesh(this.forewingRGeo, orangeMat);
  forewingR.rotateX(-0.0625 * PI);
  forewingR.position.x = -0.5;
  forewingR.position.y = -0.2;
  forewingR.position.z = -3.275;
  this.wings.add(forewingR);

  this.hindwingRGeo = new THREE.BoxGeometry(1.5, 0.15, 4);
  this.hindwingRGeo.vertices[4].z -= 1.25; // front-right-top
  this.hindwingRGeo.vertices[4].x += 0.25;
  this.hindwingRGeo.vertices[6].z -= 1.25; // front-right-bottom
  this.hindwingRGeo.vertices[6].x += 0.25;
  this.hindwingRGeo.vertices[1].x += 4.5; // back-right-top
  this.hindwingRGeo.vertices[1].z += 1.5;
  this.hindwingRGeo.vertices[3].x += 4.5; // back-right-bottom
  this.hindwingRGeo.vertices[3].z += 1.5;

  const hindwingR = new THREE.Mesh(this.hindwingRGeo, orangeMat);
  hindwingR.rotateX(-0.0625 * PI);
  hindwingR.rotateZ(0.03125 * PI);
  hindwingR.position.x = 1.3;
  hindwingR.position.y = -0.4;
  hindwingR.position.z = -2.9;
  this.wings.add(hindwingR);

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
  butterfly = new Butterfly();
  scene.add(butterfly.mesh);
  console.log(butterfly);
}

const forewingCCWMatrix = new THREE.Matrix4();
const forewingCWMatrix = new THREE.Matrix4();
const hindwingCCWMatrix = new THREE.Matrix4();
const hindwingCWMatrix = new THREE.Matrix4();
let foreFlapDown = true;
let hindFlapDown = true;

Butterfly.prototype.fly = function () {
  this.phase = 0.065;
  // this.phase += 0.01;
  let t = this.phase; // angle for forewings
  t %= (PI / 16); // restrict range to [0, pi/16]
  const p = t - 0.01; // angle for hindwings

  forewingCCWMatrix.set(1, 0, 0, 0,
    0, cos(t), -sin(t), 0,
    0, sin(t), cos(t), 0,
    0, 0, 0, 1);
  forewingCWMatrix.set(1, 0, 0, 0,
    0, cos(t), sin(t), 0,
    0, -sin(t), cos(t), 0,
    0, 0, 0, 1);
  hindwingCCWMatrix.set(1, 0, 0, 0,
    0, cos(p), -sin(p), 0,
    0, sin(p), cos(p), 0,
    0, 0, 0, 1);
  hindwingCWMatrix.set(1, 0, 0, 0,
    0, cos(p), sin(p), 0,
    0, -sin(p), cos(p), 0,
    0, 0, 0, 1);

  if (foreFlapDown) {
    this.forewingLGeo.vertices[5].applyMatrix4(forewingCCWMatrix);
    this.forewingLGeo.vertices[7].applyMatrix4(forewingCCWMatrix);
    this.forewingLGeo.vertices[0].applyMatrix4(forewingCCWMatrix);
    this.forewingLGeo.vertices[2].applyMatrix4(forewingCCWMatrix);
    // this.forewingLGeo.vertices[5].y = cos(-this.phase);
    // this.forewingLGeo.vertices[5].z = 2.5 + cos(-this.phase);
    // this.forewingLGeo.vertices[7].y = cos(-this.phase);
    // this.forewingLGeo.vertices[7].z = 2.5 + cos(-this.phase);

    this.forewingRGeo.vertices[4].applyMatrix4(forewingCWMatrix);
    this.forewingRGeo.vertices[6].applyMatrix4(forewingCWMatrix);
    this.forewingRGeo.vertices[1].applyMatrix4(forewingCWMatrix);
    this.forewingRGeo.vertices[3].applyMatrix4(forewingCWMatrix);
    // this.abdomen.rotation.z = cos(-this.phase);
  } else {
    this.forewingLGeo.vertices[5].applyMatrix4(forewingCWMatrix);
    this.forewingLGeo.vertices[7].applyMatrix4(forewingCWMatrix);
    this.forewingLGeo.vertices[0].applyMatrix4(forewingCWMatrix);
    this.forewingLGeo.vertices[2].applyMatrix4(forewingCWMatrix);
    // this.forewingLGeo.vertices[5].y = cos(this.phase);
    // this.forewingLGeo.vertices[5].z = 2.5 + cos(this.phase);
    // this.forewingLGeo.vertices[7].y = cos(this.phase);
    // this.forewingLGeo.vertices[7].z = 2.5 + cos(this.phase);

    this.forewingRGeo.vertices[4].applyMatrix4(forewingCCWMatrix);
    this.forewingRGeo.vertices[6].applyMatrix4(forewingCCWMatrix);
    this.forewingRGeo.vertices[1].applyMatrix4(forewingCCWMatrix);
    this.forewingRGeo.vertices[3].applyMatrix4(forewingCCWMatrix);
    // this.abdomen.rotation.z = cos(this.phase);
  }
  if (hindFlapDown) {
    this.hindwingLGeo.vertices[5].applyMatrix4(forewingCCWMatrix);
    this.hindwingLGeo.vertices[7].applyMatrix4(forewingCCWMatrix);
    this.hindwingLGeo.vertices[0].applyMatrix4(forewingCCWMatrix);
    this.hindwingLGeo.vertices[2].applyMatrix4(forewingCCWMatrix);

    this.hindwingRGeo.vertices[4].applyMatrix4(forewingCWMatrix);
    this.hindwingRGeo.vertices[6].applyMatrix4(forewingCWMatrix);
    this.hindwingRGeo.vertices[1].applyMatrix4(forewingCWMatrix);
    this.hindwingRGeo.vertices[3].applyMatrix4(forewingCWMatrix);
  } else {
    this.hindwingLGeo.vertices[5].applyMatrix4(forewingCWMatrix);
    this.hindwingLGeo.vertices[7].applyMatrix4(forewingCWMatrix);
    this.hindwingLGeo.vertices[0].applyMatrix4(forewingCWMatrix);
    this.hindwingLGeo.vertices[2].applyMatrix4(forewingCWMatrix);

    this.hindwingRGeo.vertices[4].applyMatrix4(forewingCCWMatrix);
    this.hindwingRGeo.vertices[6].applyMatrix4(forewingCCWMatrix);
    this.hindwingRGeo.vertices[1].applyMatrix4(forewingCCWMatrix);
    this.hindwingRGeo.vertices[3].applyMatrix4(forewingCCWMatrix);
  }

  this.forewingLGeo.verticesNeedUpdate = true;
  this.hindwingLGeo.verticesNeedUpdate = true;
  this.forewingRGeo.verticesNeedUpdate = true;
  this.hindwingRGeo.verticesNeedUpdate = true;

  if (this.forewingLGeo.vertices[5].z < -2.3 || this.forewingLGeo.vertices[5].y < -2.8) {
    foreFlapDown = !foreFlapDown;
  }
  if (this.forewingLGeo.vertices[5].y < 4.5 && foreFlapDown) {
    hindFlapDown = true;
  }
  if (this.hindwingLGeo.vertices[5].y < -2.5) {
    hindFlapDown = false;
  }
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
  showAxes();
}

function draw() {
  delta = clock.getDelta();
  controls.update();
  butterfly.fly();
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

init();
draw();
