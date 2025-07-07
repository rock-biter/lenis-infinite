import './style.css'
import 'lenis/dist/lenis.css'
import * as THREE from 'three'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
// __controls_import__
// __gui_import__

const lenis = new Lenis({
	autoRaf: true,
	infinite: true,
	anchors: true,
})
window.lenis = lenis

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => {
	lenis.raf(t * 1000)
})
gsap.ticker.lagSmoothing(0)

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

lenis.scrollTo(0, { immediate: true })
window.addEventListener('load', () => {
	lenis.scrollTo('#first', { duration: 1.5 })
})

/**
 * Debug
 */
// __gui__
const config = {
	example: 5,
}
const pane = new Pane()

pane
	.addBinding(config, 'example', {
		min: 0,
		max: 10,
		step: 0.1,
	})
	.on('change', (ev) => console.log(ev.value))

/**
 * Scene
 */
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xdedede)

// __box__
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

// __floor__
/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

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
 * Show the axes of coordinates system
 */
// __helper_axes__
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

// scene.background = new THREE.Color('lightgray')

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
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

const tl = gsap.timeline({ paused: true })
tl.to(mesh.rotation, { y: Math.PI * 2, duration: 4, ease: 'none' })
tl.to(
	camera.position,
	{ x: 5, y: 5, z: 5, duration: 2, ease: 'power2.inOut' },
	0
)
tl.to(
	camera.position,
	{ x: 2, y: 2, z: 2, duration: 2, ease: 'power2.inOut' },
	2
)

ScrollTrigger.create({
	animation: tl,
	trigger: document.body,
	start: 'top top',
	end: 'bottom bottom',
	scrub: true,
})

/**
 * Three js Clock
 */
// __clock__
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	// __controls_update__
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
