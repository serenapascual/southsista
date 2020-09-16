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

  camera.position.x = 0;
  camera.position.y = 0;
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
  this.thorax.castShadow = true;
  this.thorax.receiveShadow = true;
  this.body.add(this.thorax);

  const abdomenGeo = new THREE.BoxGeometry(2, 0.75, 1);
  this.abdomen = new THREE.Mesh(abdomenGeo, brownMat);
  this.abdomen.rotateZ(0.9375 * PI);
  this.abdomen.position.x = 2.9;
  this.abdomen.position.y = -0.2;
  this.abdomen.castShadow = true;
  this.abdomen.receiveShadow = true;
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

  /* RIGHT WINGS */
  const forewingRGeo = new THREE.BoxGeometry(2, 0.15, 4.75);
  forewingRGeo.vertices[4].x -= 1.5; // front-right-top
  forewingRGeo.vertices[4].z -= 2.5;
  forewingRGeo.vertices[6].x -= 1.5; // front-right-bottom
  forewingRGeo.vertices[6].z -= 2.5;
  forewingRGeo.vertices[1].x += 2; // back-right-top
  forewingRGeo.vertices[3].x += 2; // back-right-bottom
  this.forewingR = new THREE.Mesh(forewingRGeo, orangeMat);
  this.forewingR.rotateX(-0.0625 * PI);
  this.forewingR.position.x = -0.5;
  this.forewingR.position.y = -0.15;
  this.forewingR.position.z = -3.275;
  this.wings.add(this.forewingR);

  const hindwingRGeo = new THREE.BoxGeometry(1.5, 0.15, 4);
  hindwingRGeo.vertices[4].z -= 1.25; // front-right-top
  hindwingRGeo.vertices[4].x += 0.25;
  hindwingRGeo.vertices[6].z -= 1.25; // front-right-bottom
  hindwingRGeo.vertices[6].x += 0.25;
  hindwingRGeo.vertices[1].x += 4.5; // back-right-top
  hindwingRGeo.vertices[1].z += 1.5;
  hindwingRGeo.vertices[3].x += 4.5; // back-right-bottom
  hindwingRGeo.vertices[3].z += 1.5;
  this.hindwingR = new THREE.Mesh(hindwingRGeo, orangeMat);
  this.hindwingR.rotateX(-0.0625 * PI);
  this.hindwingR.position.x = 1.3;
  this.hindwingR.position.y = -0.35;
  this.hindwingR.position.z = -2.9;
  this.wings.add(this.hindwingR);

  /* LEFT WINGS */
  const forewingLGeo = new THREE.BoxGeometry(2, 0.15, 4.75);
  forewingLGeo.vertices[5].x -= 1.5; // front-left-top
  forewingLGeo.vertices[5].z += 2.5;
  forewingLGeo.vertices[7].x -= 1.5; // front-left-bottom
  forewingLGeo.vertices[7].z += 2.5;
  forewingLGeo.vertices[0].x += 2; // back-left-top
  forewingLGeo.vertices[2].x += 2; // back-left-bottom
  this.forewingL = new THREE.Mesh(forewingLGeo, orangeMat);
  this.forewingL.rotateX(0.0625 * PI);
  this.forewingL.position.x = -0.5;
  this.forewingL.position.y = -0.15;
  this.forewingL.position.z = 3.275;
  this.wings.add(this.forewingL);

  const hindwingLGeo = new THREE.BoxGeometry(1.5, 0.15, 4);
  hindwingLGeo.vertices[5].z += 1.25; // front-left-top
  hindwingLGeo.vertices[5].x += 0.25;
  hindwingLGeo.vertices[7].z += 1.25; // front-left-bottom
  hindwingLGeo.vertices[7].x += 0.25;
  hindwingLGeo.vertices[0].x += 4.5; // back-left-top
  hindwingLGeo.vertices[0].z -= 1.5;
  hindwingLGeo.vertices[2].x += 4.5; // back-left-bottom
  hindwingLGeo.vertices[2].z -= 1.5;
  this.hindwingL = new THREE.Mesh(hindwingLGeo, orangeMat);
  this.hindwingL.rotateX(0.0625 * PI);
  this.hindwingL.position.x = 1.3;
  this.hindwingL.position.y = -0.35;
  this.hindwingL.position.z = 2.9;
  this.wings.add(this.hindwingL);
}

function createButterfly() {
  const butterfly = new Butterfly();
  scene.add(butterfly.mesh);
}

function init() {
  createScene();
  createLights();
  createButterfly();
}

function draw() {
  requestAnimationFrame(draw);
  controls.update();
  renderer.render(scene, camera);
}

init();
draw();
