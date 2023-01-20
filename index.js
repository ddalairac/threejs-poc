import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as DAT from 'datgui';

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

// #endregion Setup 3D stage

// #region Create elements *********************************************************************/

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // lights do not aplly
// const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }); // lights do not aplly
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xffff00, // vertexColors interfere with color attr
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true, // add colo by the color BufferAttribute array
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.x = -1;
scene.add(planeMesh);


// plainRandom_Z_Points
var planeOriginalPositionArray = [];
function plainRandomZPoints() {
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 3; i < array.length; i += 3) {
    // const x = array[i];
    // const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
    // console.log(z, array[i + 2])
  }
  planeOriginalPositionArray = [...array]
}
plainRandomZPoints()

// Set poligon color
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(1, 0, 0);
}
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(
  new Float32Array(colors, /* [0, 0, 1] color goes from 0 to 1 */),
  3 /* amaunt of data entries*/
))
/** Get the intercep face, and set each vertex color (0 to 1) */
function setIntersectFaceColor(intersects, red = 1, green = 0, blue = 0) {
  if (intersects.length < 1) {
    console.error('setIntersectFaceColor: no intersect geometry');
    return
  }
  const { face } = intersects[0]
  const { color } = intersects[0].object.geometry.attributes
  // vertice 1
  color.setX(face.a, red)
  color.setY(face.a, green)
  color.setZ(face.a, blue)
  // vertice 2
  color.setX(face.b, red)
  color.setY(face.b, green)
  color.setZ(face.b, blue)
  // vertice 3
  color.setX(face.c, red)
  color.setY(face.c, green)
  color.setZ(face.c, blue)
  color.needsUpdate = true
}

// #endregion Create elements

// #region Create Lights ***********************************************************************/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // evenly illuminates the entire stage
// ambientLight.position.set(1, 1, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // generates lights and shadows on the elements
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// #endregion Create Lights

// #region GUI to change props *****************************************************************/
const gui = new DAT.GUI()
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
    zDeep: 1
  }
}
function onChangePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.widthSegments);
  plainRandomZPoints()
}

function onChangeZDeepPlane() {
  const array = [...planeOriginalPositionArray];
  console.log('array', array)
  for (let i = 3; i < array.length; i += 3) {
    const z = array[i + 2];
    array[i + 2] = z + Math.random() * world.plane.zDeep;
  }
  planeMesh.geometry.attributes.position.array = array;
}
gui.add(world.plane, 'width', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'height', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'widthSegments', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'heightSegments', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'zDeep', 1, 10).onChange(onChangeZDeepPlane);

// #endregion GUI to change props

// #region Orbit Camera ************************************************************************/
new OrbitControls(camera, renderer.domElement);
// #endregion GUI to change props

// #region Hover Event *************************************************************************/

// prevent collision by default pointer position (x:0 y:0)
var firstMousemove = false;
function onMouseMove() {
  firstMousemove = true
  removeEventListener('mousemove', onMouseMove)
}
addEventListener('mousemove', onMouseMove);

function onPointerMove(event) {
  // function onMousemove(event){
  /** Calculate pointer position in normalized device coordinates
  (-1 to +1) for both components
  In treejs X goes from -1(left) to 1(right), and Y goes from 1(top) to -1 (bottom). Leaving the 0 in the center */
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}
addEventListener('pointermove', onPointerMove);

function trackCollision() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  // Calculate: objects intersecting the picking ray
  const intersects = raycaster.intersectObject(planeMesh);
  // const intersects = raycaster.intersectObjects(scene.children); // eval all or array

  if (firstMousemove && intersects.length > 0) {
    setIntersectFaceColor(intersects, 0, 1, 0);
  }
}

// #endregion Hover Event

// #region animation ***************************************************************************/
camera.position.z = 5; /* So is not in the center of the stage */

function rotateElements() {
  // boxMesh.rotation.x += 0.01;
  // boxMesh.rotation.y += 0.01;
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.y += 0.01;
}

// loop
function animate() {
  requestAnimationFrame(animate);
  trackCollision();
  // rotateElements();
  renderer.render(scene, camera);
}
animate(); // start loop

// #endregion animation
