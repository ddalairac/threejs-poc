import * as THREE from 'three'; // 3D Lib
import { OrbitControls } from 'OrbitControls'; // mouse controlled camera class, from threejs
import * as DAT from 'datgui'; // live attr ui edit
import gsap from 'gsap'; // animation lib


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

const planeGeometry = new THREE.PlaneGeometry(200, 200, 200, 200);
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
var zIncrease = 0.5;
function plainRandomZPoints() {
  const randomValues = []
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i++) {
    // each 3 iterations
    if (i % 3 == 0) {
      // array[i] += Math.random() * 0.2 // x;
      // array[i + 1] += Math.random() * 0.2; // y
      const z = array[i + 2];
      array[i + 2] = z + Math.random() * zIncrease;
    }
    // every iterations
    randomValues.push(Math.random());
  }
  planeMesh.geometry.attributes.position.arrayInitial = new Float32Array(array) // for z gui edit
  planeMesh.geometry.attributes.position.arrayOrigen = new Float32Array(array)
  planeMesh.geometry.attributes.position.randomValues = new Float32Array(randomValues)
  setPointsColors();
}

plainRandomZPoints()
// #endregion  Create elements

// #region Element Color ***********************************************************************/
// Set poligon color
function setPointsColors() {
  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(1, 0, 0);
  }
  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(
    new Float32Array(colors, /* [0, 0, 1] color goes from 0 to 1 */),
    3 /* amaunt of data entries*/
  ))
}

/** Get the intercep face, and set each vertex color (0 to 1) */
function setIntersectFaceColor(intersects, RGB) {
  if (intersects.length < 1) {
    console.error('setIntersectFaceColor: no intersect geometry');
    return
  }
  const { face } = intersects[0];
  const { color } = intersects[0].object.geometry.attributes;
  // x, y & z vertex are in the same index as the colors

  // vertex 1
  color.setX(face.a, RGB.r);
  color.setY(face.a, RGB.g);
  color.setZ(face.a, RGB.b);
  // vertex 2
  color.setX(face.b, RGB.r);
  color.setY(face.b, RGB.g);
  color.setZ(face.b, RGB.b);
  // vertex 3
  color.setX(face.c, RGB.r);
  color.setY(face.c, RGB.g);
  color.setZ(face.c, RGB.b);
  color.needsUpdate = true;
}

// #endregion Element Color

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
    width: planeGeometry.parameters.width,
    height: planeGeometry.parameters.height,
    widthSegments: planeGeometry.parameters.widthSegments,
    heightSegments: planeGeometry.parameters.heightSegments,
    zDeep: zIncrease
  }
}
function onChangePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
  plainRandomZPoints()
}


function onChangeZDeepPlane() {
  planeMesh.geometry.dispose();
  zIncrease = world.plane.zDeep;
  const { array, arrayInitial, arrayOrigen } = planeMesh.geometry.attributes.position;
  const newZOrigen = new Float32Array(arrayOrigen)
  for (let i = 0; i < newZOrigen.length; i += 3) {
    /* z */ newZOrigen[i + 2] = arrayInitial[i + 2] * zIncrease;
    /* z */ array[i + 2] = arrayInitial[i + 2] * zIncrease;
  }
  planeMesh.geometry.attributes.position.arrayOrigen = newZOrigen;
}
gui.add(world.plane, 'width', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'height', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'widthSegments', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'heightSegments', 1, 500).onChange(onChangePlane);
gui.add(world.plane, 'zDeep', 0, 10.5).onChange(onChangeZDeepPlane);

// #endregion GUI to change props

// #region Orbit Camera ************************************************************************/
new OrbitControls(camera, renderer.domElement);
// #endregion GUI to change props

// #region Hover Event Collision ***************************************************************/

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

    const initialColor = { r: 0.9, g: 0, b: 0 }
    const hoverColor = { r: 2, g: 0.5, b: 0.5 }
    setIntersectFaceColor(intersects, hoverColor);

    //   setTimeout(() => {
    //     setIntersectFaceColor(intersects, 1, 0, 0)
    //   }, 300);

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // console.log('update color')
        setIntersectFaceColor(intersects, hoverColor)
      }
    })
  }
}

// #endregion Hover Event

// #region animation ***************************************************************************/
camera.position.z = 5; /* So is not in the center of the stage */

// function rotateElements() {
//   // boxMesh.rotation.x += 0.01;
//   // boxMesh.rotation.y += 0.01;
//   planeMesh.rotation.x += 0.01;
//   planeMesh.rotation.y += 0.01;
// }
function wavePoints() {
  const { array, arrayOrigen, randomValues } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    /* x */ array[i] = arrayOrigen[i] + Math.cos(frame * 0.3 + randomValues[i]) * 0.5;
    /* y */ array[i + 1] = arrayOrigen[i + 1] + (Math.cos(frame * 0.6 + randomValues[i + 1]) * 0.5);
    /* z */ array[i + 2] = arrayOrigen[i + 2] + (Math.cos(frame*0.9 + randomValues[i + 2] ) * 0.3);
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;
}

// loop
var frame = 0
function animate() {
  frame += 0.021;
  requestAnimationFrame(animate);
  // rotateElements();
  trackCollision();
  wavePoints();
  renderer.render(scene, camera);
}
animate(); // start loop

// #endregion animation
