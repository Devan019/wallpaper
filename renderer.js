import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", (e) => {
    camera.aspect = innerWidth / innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix()
})

const controls = new OrbitControls(camera, renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const tex1 = textureLoader.load("earth.jpg");
const tex2 = textureLoader.load("cloud.jpg");
tex1.colorSpace = THREE.SRGBColorSpace;

// Load HDR environment map
const hdri = new RGBELoader();
hdri.load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr", (hdritexture) => {
    hdritexture.mapping = THREE.EquirectangularReflectionMapping; // Correct mapping for environment lighting
    scene.environment = hdritexture;  // Apply HDR texture for environment lighting
    scene.background = hdritexture;  // Set HDR texture as background as well
});

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft light to illuminate the objects
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong light for realistic shading
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create Earth sphere with texture
const sph = new THREE.SphereGeometry(3, 500, 500);
const spm = new THREE.MeshPhysicalMaterial({ map: tex1 });
const sp = new THREE.Mesh(sph, spm);

// Create cloud sphere with alpha map
const sph2 = new THREE.SphereGeometry(3.1, 500, 500);
const spm2 = new THREE.MeshPhysicalMaterial({ alphaMap: tex2 });
spm2.transparent = true;
const sp2 = new THREE.Mesh(sph2, spm2);

// Add spheres to the scene
scene.add(sp, sp2);

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    sp.rotation.y += 0.001;
    sp2.rotation.y += 0.002;
};

animate();
