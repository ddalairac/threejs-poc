/**
 import * as THREE from './node_modules/three/';
 throw a MIME type Error. The REAL problem is that the file does not exist, or at least it's not at that location.
*/
import * as THREE from './node_modules/three/build/three.module.js';

// console.log('THREE module',THREE)

/* Setup 3D stage **********************************************************************/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75 /*lens field of view*/,
  innerWidth / innerHeight /* aspect ratio */,
  0.1, 1000/* Clipping plane: distance to be cut from camera */
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement);

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );


/* Create elements **********************************************************************/
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // lights do not aplly
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }); // lights do not aplly
const planeMaterial = new THREE.MeshPhongMaterial({ 
  color: 0xffff00, 
  side: THREE.DoubleSide, 
  flatShading: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.x = -1;
scene.add(planeMesh);


// plainRandomZPoints
const { array } = planeMesh.geometry.attributes.position;
for (let i = 3; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();
  console.log(z, array[i + 2])
}



/* Create Lights **********************************************************************/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // evenly illuminates the entire stage
// ambientLight.position.set(1, 1, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // generates lights and shadows on the elements
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);


/* animation **********************************************************************/
camera.position.z = 5; /* So is not in the center of the stage */


function rotateBox() {
  boxMesh.rotation.x += 0.01;
  boxMesh.rotation.y += 0.01;
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.y += 0.01;
}

// loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  rotateBox();
}
animate(); // start loop