// Main JS for Qmarshal Website - Enhanced Interaction
import { initThreeScene, sceneParams, animateThreeScene } from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const canvasContainer = document.getElementById('three-canvas-container');
    const sections = document.querySelectorAll('.scroll-section');
    const contentLayers = document.querySelectorAll('.content-layer');

    // 1. Initialize Three.js Scene
    // Small delay to ensure container is ready, then start animation loop
    setTimeout(() => {
        try {
            initThreeScene(canvasContainer);
            animateThreeScene(); // Start the animation loop
            console.log("Three.js scene initialized.");

            // Hide preloader after scene init (and maybe a slight delay)
            setTimeout(() => {
                if(preloader) preloader.classList.add('loaded');
            }, 500); // Adjust delay as needed

        } catch (error) {
            console.error("Error initializing Three.js:", error);
             if(preloader) preloader.innerHTML = "<p>Error loading 3D environment. Please refresh.</p>"; // Show error on preloader
        }

        // 2. Initialize GSAP and ScrollTrigger (AFTER Three.js potentially loads)
        initScrollAnimations();

    }, 100); // Small delay for DOM readiness

    // --- Basic Setup ---
    document.getElementById('current-year').textContent = new Date().getFullYear();


    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
             console.error("GSAP or ScrollTrigger not loaded!");
             return;
        }
        gsap.registerPlugin(ScrollTrigger);
        console.log("GSAP & ScrollTrigger registered.");


        // --- Master ScrollTimeline for Camera Control ---
        const cameraTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container", // Use the main scrollable element
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5, // Smooth scrubbing (adjust timing)
                // markers: true, // DEBUG: Show trigger points
            }
        });

        // Define Camera "Waypoints" for each section (adjust values extensively!)
        // These values determine where the camera moves/rotates TO as you scroll towards that section
        const cameraWaypoints = [
            { section: "#hero", x: 0, y: 100, z: 1000, rotX: 0, rotY: 0, rotZ: 0 }, // Start
            { section: "#network", x: -50, y: 50, z: 700, rotX: 0, rotY: -0.1, rotZ: 0 }, // Move left/closer for network
            { section: "#intelligence", x: 100, y: 0, z: 600, rotX: 0.05, rotY: 0.2, rotZ: 0 }, // Move right/closer/tilt for AI
            { section: "#experience", x: 0, y: -20, z: 650, rotX: 0, rotY: 0, rotZ: 0 }, // Center/closer for App UI
            { section: "#safety", x: -80, y: 30, z: 750, rotX: -0.05, rotY: -0.15, rotZ: 0 }, // Move left/up slightly
            { section: "#download", x: 0, y: 0, z: 850, rotX: 0, rotY: 0, rotZ: 0 } // Pull back slightly for final CTA
        ];

        // Add camera tweens to the master timeline
        cameraWaypoints.forEach((wp, index) => {
            // Target the sceneParams object that three-scene.js uses
            cameraTimeline.to(sceneParams, {
                cameraTargetX: wp.x,
                cameraTargetY: wp.y,
                cameraTargetZ: wp.z,
                cameraTargetRotX: wp.rotX,
                cameraTargetRotY: wp.rotY,
                cameraTargetRotZ: wp.rotZ,
                ease: "power1.inOut"
                // The position in the timeline is relative to the section's scroll position
            }, `${index / (cameraWaypoints.length -1)}`); // Distribute tweens along the timeline (0 to 1)
        });


        // --- Animate Content Visibility ---
        contentLayers.forEach((layer) => {
            const section = layer.closest('.scroll-section');
            gsap.to(layer, {
                opacity: 1,
                y: 0,
                duration: 1, // Control fade-in duration
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 60%", // When section top hits 60% from viewport top
                    end: "bottom 40%", // When section bottom hits 40% from viewport top
                    toggleActions: "play reverse play reverse", // Fade in/out smoothly
                    // markers: {startColor: "green", endColor: "red", indent: 20} // DEBUG
                }
            });
        });


        // --- Specific Element Animations (Example for Hero) ---
        gsap.from("#hero .main-headline", { opacity: 0, y: 80, duration: 1.5, delay: 0.5, ease: "power3.out" });
        gsap.from("#hero .subtitle", { opacity: 0, y: 50, duration: 1.2, delay: 0.8, ease: "power3.out" });
        gsap.from("#hero .scroll-indicator", { opacity: 0, y: 20, duration: 1, delay: 1.2, ease: "power3.out" });

        // TODO: Add more specific animations for elements within each section triggered by ScrollTrigger


        console.log("GSAP Scroll animations initialized.");
    } // End initScrollAnimations

}); // End DOMContentLoaded