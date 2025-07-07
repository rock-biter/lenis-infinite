import './style.css'
import 'lenis/dist/lenis.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Scene
 */
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xdedede)

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({
	color: 'coral',
	wireframe: true,
})
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 0.5
scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(2, 2, 2)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

/**
 * frame loop
 */
function tic() {
	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
