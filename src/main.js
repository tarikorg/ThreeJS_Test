import './style.css'
import * as THREE from 'three';

//orbit control for mouse interaction
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//IMPORTS FOR CUSTOM 3D ASSETS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // this class is used to load 3D models in the glTF format, which is a popular format for 3D assets




const scene = new THREE.Scene();

//create cube mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//mesh it 
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//create camera
const temp = {
  width: 1024,
  height: 720
}

const camera = new THREE.PerspectiveCamera(
  75,
  temp.width / temp.height);




//renderer and canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(temp.width, temp.height);
document.body.appendChild(renderer.domElement); // document.body.appendChild(renderer.domElement); purpose is to append the canvas to the body of the document

//move the camera
camera.position.z = 5;

//render
renderer.render(scene, camera);

//orbit control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25; // this property sets the damping factor for the controls, which determines how quickly the controls respond to user input, a higher value results in slower response
controls.rotateSpeed = 0.5; // this property sets the rotation speed of the controls, which determines how quickly the camera rotates around the target point, a higher value results in faster rotation
controls.minDistance = 1; // this property sets the minimum distance from the target point that the camera can be positioned, this is useful for preventing the camera from getting too close to the object
controls.maxDistance = 10; // this property sets the maximum distance from the target point that the camera can be positioned, this is useful for preventing the camera from getting too far away from the object


//add animation loop
function animate() {
  requestAnimationFrame(animate);

  //add rotation to the cube
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;

  //update controls
  controls.update(); // this method is used to update the controls, which is necessary when using damping or auto-rotation
  renderer.render(scene, camera);
}
animate();



//handle window resize for responsive design
window.addEventListener('resize', () => {
  //update sizes
  temp.width = window.innerWidth;
  temp.height = window.innerHeight;

  //update camera
  camera.aspect = temp.width / temp.height;
  camera.updateProjectionMatrix();// this method is used to update the projection matrix of the camera after changing its aspect ratio, this assures that the camera's view is correctly adjusted to the new aspect ratio

  //update renderer
  renderer.setSize(temp.width, temp.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // this method is used to set the pixel ratio of the renderer, which determines how many pixels are used to represent each pixel on the screen, this is important for high-DPI displays
});


//click interaction
const raycaster = new THREE.Raycaster(); // this class is used to perform raycasting, which is a technique used to determine the intersection of a ray with objects in 3D space
const pointer = new THREE.Vector2(); // this class is used to represent a 2D point in normalized device coordinates (NDC), which range from -1 to +1 in both dimensions, this is useful for mouse interactions and raycasting

window.addEventListener('click', (event) => {
  pointer.x = (event.clientX / temp.width) * 2 - 1; // this line converts the mouse x coordinate from screen space to normalized device coordinates (NDC), which range from -1 to +1 in both dimensions
  pointer.y = -(event.clientY / temp.height) * 2 + 1; // this line converts the mouse y coordinate from screen space to normalized device coordinates (NDC), which range from -1 to +1 in both dimensions

  //update the raycaster
  raycaster.setFromCamera(pointer, camera);

  //check intersections
  const intersects = raycaster.intersectObjects(mesh); // this method is used to check for intersections between the ray and the objects in the scene, it returns an array of intersection objects, each containing information about the intersection point, distance, and the intersected object
  if (intersects.length > 0) {
    console.log('Intersection detected');
    //change color of the cube
    mesh.material.color.set(Math.random() * 0xffffff); // this line changes the color of the mesh material to a random color
  }
});




// ============= LOAD GLTF MODEL =============



// ============= POPUP MENU =============
//create popup element
let popup = null;
let isPopupVisible = false;

function createPopup(x, y) {
  console.log('createPopup called');
  // if popup is already visible, do nothing

  if (!popup) {


    popup = document.createElement('div'); // create a new div element
    popup.className = 'popup';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;'; // close button , &times; is the HTML entity for the multiplication sign (×), which is commonly used to represent a close button
    closeBtn.onclick = closePopup;

    const content = document.createElement('div');
    content.className = 'popup-content';
    content.innerHTML = 'This is a popup menu!'; // content of the popup

    popup.appendChild(closeBtn); // append the close button to the popup
    popup.appendChild(content); // append the content to the popup
    document.body.appendChild(popup); // append the popup to the body of the document
  }

  //position the popup at the cursor location
  if (x !== undefined && y !== undefined) {
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.transform = 'translate(-50%, -50%)'; // center the popup at the cursor location
  }

  //show the popup
  popup.style.display = 'block';
  isPopupVisible = true; // set the popup visibility to true
}


function closePopup() {
  if (popup) {
    popup.style.display = 'none'; // hide the popup
    isPopupVisible = false; // set the popup visibility to false
  }
}

//add event listener to the mesh
window.addEventListener('dblclick', (event) => {
  console.log('dblclick event triggered');

  if (popup && isPopupVisible) {
    const popupRect = popup.getBoundingClientRect(); // this method returns the size of an element and its position relative to the viewport, this is useful for determining the position of the popup
    console.log('popupRect', popupRect);

    if (
      event.clientX >= popupRect.left &&
      event.clientX <= popupRect.right &&
      event.clientY >= popupRect.top &&
      event.clientY <= popupRect.bottom
    ) {
      //click within the popup, do nothing
      return;
    }
  }


  //get the mouse position
  pointer.x = (event.clientX / temp.width) * 2 - 1; // this line converts the mouse x coordinate from screen space to normalized device coordinates (NDC), which range from -1 to +1 in both dimensions
  pointer.y = -(event.clientY / temp.height) * 2 + 1; // this line converts the mouse y coordinate from screen space to normalized device coordinates (NDC), which range from -1 to +1 in both dimensions

  //update the raycaster
  raycaster.setFromCamera(pointer, camera);

  //check intersections
  const intersects = raycaster.intersectObjects(mesh); // this method is used to check for intersections between the ray and the objects in the scene, it returns an array of intersection objects, each containing information about the intersection point, distance, and the intersected object


  console.log('intersects', intersects);

  if (intersects.length > 0) {
    if (isPopupVisible) {
      closePopup();
    }
  }

  createPopup(event.clientX, event.clientY); // pass the mouse position to the createPopup function

  // if popup is already visible, close it and show it again

}
);