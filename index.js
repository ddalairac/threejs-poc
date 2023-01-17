/**
 import * as THREE from './node_modules/three/';
 throw a MIME type Error. The REAL problem is that the file does not exist, or at least it's not at that location.
*/
import * as THREE from './node_modules/three/build/three.module.js';

// console.log('THREE module',THREE)

// Setup 3D stage
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75 /*lens field of view*/,
  innerWidth / innerHeight /* aspect ratio */,
  0.1, 1000/* Clipping plane: distance to be cut from camera */
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio)

console.log(scene);
console.log(camera);
console.log(renderer);

document.body.appendChild(renderer.domElement);


// Create elements
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, material1);
scene.add(boxMesh);

const planeGeometry = new THREE.PlaneGeometry(2, 2, 10, 10);
const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, material2);
scene.add(planeMesh);

console.log(boxGeometry);
console.log(material1);
console.log(boxMesh);


// render element
camera.position.z = 5; /* So is not in the center of the stage */

function moveElements() {
  boxMesh.rotation.x += 0.01;
  boxMesh.rotation.y += 0.1;
  planeMesh.rotation.x += 0.1;
  planeMesh.rotation.y += 0.01;
}

// loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  moveElements();
}
animate(); // start loop