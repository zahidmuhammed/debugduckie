//Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
// To allow for the camera to move around the scene
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
// To allow for importing the .gltf file
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'

//Create a Three.JS Scene
const scene = new THREE.Scene()
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// Remove cube geometry and material
// Add GLTF loader
const loader = new GLTFLoader()

// Add these variables after scene creation
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let duckModel = null // Store reference to the duck model

// Add control elements
// const sizeControl = document.getElementById('size')
const rotateXControl = document.getElementById('rotateX')
const rotateYControl = document.getElementById('rotateY')
const rotateZControl = document.getElementById('rotateZ')
const enableRotationControl = document.getElementById('enableRotation')

// Add event listeners for controls
// sizeControl.addEventListener('input', updateDuckSize)
rotateXControl.addEventListener('input', updateDuckRotation)
rotateYControl.addEventListener('input', updateDuckRotation)
rotateZControl.addEventListener('input', updateDuckRotation)
enableRotationControl.addEventListener('change', updateRotationState)

// Control update functions
// function updateDuckSize() {
//   if (duckModel) {
//     const size = parseFloat(sizeControl.value)
//     duckModel.scale.set(size, size, size)
//   }
// }

function updateDuckRotation() {
  if (duckModel) {
    const rotX = (parseFloat(rotateXControl.value) * Math.PI) / 180
    const rotY = (parseFloat(rotateYControl.value) * Math.PI) / 180
    const rotZ = (parseFloat(rotateZControl.value) * Math.PI) / 180

    duckModel.rotation.x = rotX
    duckModel.rotation.y = rotY
    duckModel.rotation.z = rotZ
  }
}

// Add rotation state control function
function updateRotationState(event) {
  if (controls) {
    controls.autoRotate = event.target.checked

    // Enable/disable rotation sliders
    rotateXControl.disabled = !event.target.checked
    rotateYControl.disabled = !event.target.checked
    rotateZControl.disabled = !event.target.checked

    // Update visual state of sliders
    const sliders = [rotateXControl, rotateYControl, rotateZControl]
    sliders.forEach((slider) => {
      slider.style.opacity = event.target.checked ? '1' : '0.5'
      slider.style.cursor = event.target.checked ? 'pointer' : 'not-allowed'
    })
  }
}

// Load the GLTF model
loader.load(
  './rubber_duck.glb', // Replace with your GLTF file path
  function (gltf) {
    console.log('🚀 Model loaded successfully')
    duckModel = gltf.scene // Store reference to the duck
    scene.add(duckModel)

    // Initialize controls with default values
    updateDuckSize()
    updateDuckRotation()
  },
  function (progress) {
    console.log(
      '🚀 Loading progress:',
      (progress.loaded / progress.total) * 100 + '%'
    )
  },
  function (error) {
    console.error('🚀 Error loading model:', error)
  }
)

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)

//Add the renderer to the DOM
document.getElementById('container3D').appendChild(renderer.domElement)

//Set camera position
camera.position.z = 1

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(0, 1, 1)
scene.add(topLight)

const ambientLight = new THREE.AmbientLight(0x333333, 1)
scene.add(ambientLight)

//Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true // Enable auto-rotation
controls.autoRotateSpeed = 5 // Set rotation speed (default is 2.0)
controls.minDistance = 0.5 // Minimum zoom distance
controls.maxDistance = 5 // Maximum zoom distance
controls.enablePan = false // Disable panning
controls.enableDamping = true // Add smooth damping effect
controls.dampingFactor = 0.05 // Damping inertia

// Add click event listener
// window.addEventListener('click', onMouseClick)

function onMouseClick(event) {
  console.log('🚀 Mouse clicked')
}

// Modify the existing animate function
const animations = [] // Store animation functions

function animate() {
  requestAnimationFrame(animate)

  // Run all active animations
  animations.forEach((animation) => animation())

  controls.update()
  renderer.render(scene, camera)
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

//Start the 3D rendering
animate()

// Add control panel toggle functionality
const settingsToggle = document.getElementById('settingsToggle')
const controlPanel = document.getElementById('controlPanel')
const infoToggle = document.getElementById('infoToggle')
const infoPanel = document.getElementById('infoPanel')

settingsToggle.addEventListener('click', () => {
  controlPanel.classList.toggle('hidden')
  if (!controlPanel.classList.contains('hidden')) {
    infoPanel.classList.add('hidden')
  }
  console.log('🚀 Settings panel toggled')
})

infoToggle.addEventListener('click', () => {
  infoPanel.classList.toggle('hidden')
  if (!infoPanel.classList.contains('hidden')) {
    controlPanel.classList.add('hidden')
  }
  console.log('🚀 Info panel toggled')
})
