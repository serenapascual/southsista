import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const Colors = {
  skyBlue: 0xc5daed,
  lakeBlue: 0x8abac6,
  tortoiseshellOrange: 0xce8248,
  screeRed: 0x632d2b,
  cinderGrey: 0x3a3947,
  glacierGrey: 0x929daf,
  glacierWhite: 0xd0d8e5,
};

// window.addEventListener('load', init, false);
let scene, camera, aspectRatio, renderer, controls;
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

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  controls = new OrbitControls(camera, renderer.domElement);

  const container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

function createLights() {
  const globalLight = new THREE.AmbientLight(0xfff5e0);
  scene.add(globalLight);
}

function createButterfly() {
  // MATERIALS
  const orangeMat = new THREE.MeshPhongMaterial({
    color: Colors.tortoiseshellOrange,
    flatShading: true,
  });

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  butterfly = new THREE.Mesh(geometry, orangeMat);
  scene.add(butterfly);
}

function init() {
  createScene();
  createLights();
  createButterfly();
}

function draw() {
  requestAnimationFrame(draw);
  butterfly.rotation.x += 0.01;
  butterfly.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

init();
draw();
