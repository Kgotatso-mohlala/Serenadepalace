// Enhanced Three.js Scene Setup (Foundation)
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Scene, Camera, Renderer
let scene, camera, renderer;

// Objects
let points; // For background starfield/particles
let linesGroup; // Group for connection lines

// Parameters object to be controlled by GSAP
const sceneParams = {
    particleSpeed: 0.0001,
    lineSpeedY: 0.0002,
    cameraStartZ: 1000,
    cameraStartY: 100, // Start slightly elevated
    cameraStartX: 0,
    // Target positions/rotations for scroll animation (will be tweened by GSAP)
    cameraTargetZ: 0,
    cameraTargetY: 0,
    cameraTargetX: 0,
    cameraTargetRotX: 0,
    cameraTargetRotY: 0,
    cameraTargetRotZ: 0,
};

function initThreeScene(container) {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0814, 0.0007); // Match dark BG

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(sceneParams.cameraStartX, sceneParams.cameraStartY, sceneParams.cameraStartZ);
    camera.lookAt(scene.position); // Look towards origin initially

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404080, 1); // Soft ambient blueish
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    // TODO: Add PointLights for localized glows near content sections

    // Background Particles (Starfield)
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000; // Spread out
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x8888ff,
        size: 1.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    points = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(points);


    // Connection Lines (Simplified Example)
    linesGroup = new THREE.Group();
    const numLines = 60;
    const lineMaterialBlue = new THREE.LineBasicMaterial({
        color: 0x00bfff, // --highlight-blue
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false // Prevents depth sorting issues with blending
    });
     const lineMaterialMagenta = new THREE.LineBasicMaterial({
        color: 0xff00ff, // --highlight-magenta
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const lineDistance = 500;
    for (let i = 0; i < numLines; i++) {
        const start = new THREE.Vector3(
            (Math.random() - 0.5) * lineDistance * 2,
            (Math.random() - 0.5) * lineDistance * 2,
            (Math.random() - 0.5) * lineDistance * 2
        );
        const end = start.clone().add(new THREE.Vector3(
             (Math.random() - 0.5) * 100,
             (Math.random() - 0.5) * 100,
             (Math.random() - 0.5) * 100
        ));
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = i % 2 === 0 ? lineMaterialBlue : lineMaterialMagenta;
        const line = new THREE.Line(geometry, material);
        linesGroup.add(line);
    }
    scene.add(linesGroup);
    // TODO: Implement TubeGeometry or custom shaders for better line appearance


    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateThreeScene() {
    if (!renderer) return; // Don't run if not initialized

    const time = Date.now();

    // Animate background elements subtly
    points.rotation.y = time * sceneParams.particleSpeed;
    linesGroup.rotation.y = time * sceneParams.lineSpeedY;


    // IMPORTANT: Camera position/rotation is now primarily controlled
    // by GSAP via the sceneParams object in main.js.
    // We just apply the tweened values here.
    camera.position.set(sceneParams.cameraTargetX, sceneParams.cameraTargetY, sceneParams.cameraTargetZ);
    camera.rotation.set(sceneParams.cameraTargetRotX, sceneParams.cameraTargetRotY, sceneParams.cameraTargetRotZ);

    // Ensure camera updates if rotation/position changed
    camera.updateProjectionMatrix(); // Necessary if FOV or aspect changes, good practice here
    // camera.lookAt(scene.position); // Re-enable if rotation isn't fully controlled by GSAP


    renderer.render(scene, camera);

    requestAnimationFrame(animateThreeScene); // Loop
}

// --- Export ---
// Export the init function and the parameters object for GSAP control
export { initThreeScene, sceneParams, animateThreeScene };