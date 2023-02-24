import * as THREE from 'three'; // 3D Lib
import { OrbitControls } from 'OrbitControls'; // mouse controlled camera class, from threejs
import { GLTFLoader } from 'GLTFLoader'; // mouse controlled camera class, from threejs
// import * as DAT from 'datgui'; // live attr ui edit
// import gsap from 'gsap'; // animation lib

export default function setBG3D(){
// #region Setup 3D stage **********************************************************************/
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
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(); /* mouse position */

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

// #endregion 

// #region LOADModel
// scene.background = new THREE.Color(0xffff0f);

const loader = new GLTFLoader();
let gltfMoldel;
loader.load(
  // resource URL
  './donut_p11-gptl.glb',
  // './rigged_human_character_free/scene.gltf',
  // called when the resource is loaded
  function (gltf) {
    gltfMoldel = gltf
    console.log('gltf', gltf)
    scene.add(gltf.scene);
    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // called when loading has errors
  function (error) {
    console.log('An error happened');
  }
);
// #endregion 

// #region Create Lights ***********************************************************************/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // evenly illuminates the entire stage
// ambientLight.position.set(1, 1, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // generates lights and shadows on the elements
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// #endregion 

// #region Camera ************************************************************************/

camera.position.y = .4; /* So is not in the center of the stage */
camera.position.z = .3; /* So is not in the center of the stage */
camera.rotation.x = 1;
new OrbitControls(camera, renderer.domElement);
// #endregion 

// #region animation ***************************************************************************/



// loop
var frame = 0
function animate() {
  frame += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate(); // start loop

// #endregion animation

}
setBG3D()