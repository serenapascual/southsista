import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import Swarm from './swarm.js';

// window.addEventListener('load', init, false);
let scene;
let camera;
let aspectRatio;
let renderer;
let controls;
let swarm;

const Colors = {
  skyBlue: 0xc5daed,
  lakeBlue: 0x8abac6,
  tortoiseshellBlack: 0x303030,
  screeRed: 0x632d2b,
  cinderGrey: 0x3a3947,
  glacierGrey: 0x929daf,
  glacierWhite: 0xd0d5e2,
};

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

  // camera.position.x = 0;
  // camera.position.y = 30;
  // camera.position.z = -5;
  camera.position.x = 10;
  camera.position.y = 40;
  camera.position.z = 175;

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

function createSwarm() {
  swarm = new Swarm();
  swarm.butterflies.forEach((butterfly) => {
    scene.add(butterfly.mesh);
  });
}

function createTerrain() {
  const terrainGeo = new THREE.BoxGeometry(120, 2, 120);
  const terrainMat = new THREE.MeshPhongMaterial({
    color: Colors.glacierGrey,
    flatShading: true,
    shininess: 0,
    emissive: Colors.glacierGrey,
    emissiveIntensity: 0.95,
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);
}

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
  createTerrain();
  createSwarm();
  showAxes();
}

function draw() {
  controls.update();
  swarm.move();
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

init();
draw();
