import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import normalMapImg from "./textures/normalMap.png";

// Debug
const gui = new dat.GUI();

// loaders
const textureLoader = new THREE.TextureLoader();

// Textures
const normalTexture = textureLoader.load(normalMapImg);

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

// Objects
const sphereShape = new THREE.SphereGeometry(0.5, 64, 64);

// Materials
const shpereSkin = new THREE.MeshStandardMaterial({
  color: 0x292929,
  metalness: 0.7,
  roughness: 0.2,
  normalMap: normalTexture,
  // wireframe:true
});

// Mesh
const sphere = new THREE.Mesh(sphereShape, shpereSkin);
scene.add(sphere);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
// const ambientLight = new THREE.AmbientLight({ color: 0xffffff })
pointLight.position.set(2, 3, 4);
scene.add(pointLight);
//light 2
const pointLight2 = new THREE.PointLight(0xff0000, 10);
pointLight2.position.set(-1.86, 1, -1.65);
scene.add(pointLight2);
//light 3
const pointLight3 = new THREE.PointLight(0x59ff, 5);
pointLight3.position.set(1.99, -1.32, -1.65);
scene.add(pointLight3);

// Light Helpers
// const pointLight2Helper = new THREE.PointLightHelper(pointLight2, 0.3);
// const pointLight3Helper = new THREE.PointLightHelper(pointLight3, 0.3);
// scene.add(pointLight2Helper, pointLight3Helper);

// gui controls
const light2 = gui.addFolder("Light 2");
light2.add(pointLight2.position, "x", -6, 6, 0.01);
light2.add(pointLight2.position, "y", -3, 3, 0.01);
light2.add(pointLight2.position, "z", -3, 3, 0.01);
light2.add(pointLight2, "intensity", 0, 10, 0.1);

const light3 = gui.addFolder("Light 3");
light3.add(pointLight3.position, "x", -6, 6, 0.01);
light3.add(pointLight3.position, "y", -3, 3, 0.01);
light3.add(pointLight3.position, "z", -3, 3, 0.01);
light3.add(pointLight3, "intensity", 0, 10, 0.1);

const light3Color = { color: 0x59ff };

light3
  .addColor(light3Color, "color")
  .onChange(() => pointLight3.color.set(light3Color.color));

gui.close();
// gui.destroy();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  ren.setSize(sizes.width, sizes.height);
  ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const ren = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //makes the bg of the canvas transparent
});
ren.setSize(sizes.width, sizes.height);
ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate & interactions
 */

document.addEventListener("mousemove", onDocumentMouseMove);

let mouseX,
  mouseY,
  targetX,
  targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
}

document.addEventListener("scroll", updateSphere);

function updateSphere(event) {
  sphere.position.y = window.scrollY * 0.001;
}

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // interation
  if (mouseX > 0) {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
    sphere.position.z += -0.05 * (targetY - sphere.rotation.x);
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  ren.render(scene, camera);

  // Call animate again on the next frame
  requestAnimationFrame(animate);
};

animate();
