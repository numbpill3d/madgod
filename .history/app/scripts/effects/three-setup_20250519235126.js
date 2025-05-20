// Three.js Background Effects for CHIMERA
// This script creates the animated background effects using Three.js

// Global variables
let scene, camera, renderer;
let animationFrameId;
let particles, particleSystem;
let backgroundEffect = 'lain'; // Default effect (lain or morrowind)

// Initialize the Three.js scene
const initThreeScene = () => {
  const canvas = document.getElementById('background-canvas');
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  
  // Create initial background effect
  createBackgroundEffect();
  
  // Start animation loop
  animate();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Listen for theme changes
  document.getElementById('theme-toggle').addEventListener('click', toggleBackgroundEffect);
  
  // Also detect theme changes from stylesheet switches
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet.href.includes('lain')) {
          setBackgroundEffect('lain');
        } else if (themeStylesheet.href.includes('morrowind')) {
          setBackgroundEffect('morrowind');
        }
      }
    });
  });
  
  observer.observe(document.getElementById('theme-stylesheet'), { attributes: true });
};

// Create the background effect based on the current theme
const createBackgroundEffect = () => {
  // Clear existing particle system if it exists
  if (particleSystem) {
    scene.remove(particleSystem);
  }
  
  if (backgroundEffect === 'lain') {
    createLainEffect();
  } else {
    createMorrowindEffect();
  }
};

// Lain effect: Digital falling particles resembling the Wired
const createLainEffect = () => {
  // Create particle geometry
  const particleCount = 500;
  const particleGeometry = new THREE.BufferGeometry();
  
  // Create arrays to hold particle data
  particles = {
    positions: new Float32Array(particleCount * 3),
    sizes: new Float32Array(particleCount),
    colors: new Float32Array(particleCount * 3),
    speeds: new Float32Array(particleCount)
  };
  
  // Initialize particle data
  const color = new THREE.Color();
  
  for (let i = 0; i < particleCount; i++) {
    // Position: random across the screen, but more concentrated in the center
    const i3 = i * 3;
    particles.positions[i3] = (Math.random() - 0.5) * 10;
    particles.positions[i3 + 1] = (Math.random() - 0.5) * 10;
    particles.positions[i3 + 2] = (Math.random() - 0.5) * 10;
    
    // Size: varying small sizes
    particles.sizes[i] = Math.random() * 0.1 + 0.05;
    
    // Color: green hues for Lain
    color.setHSL(0.3, 0.8, Math.random() * 0.3 + 0.4);
    particles.colors[i3] = color.r;
    particles.colors[i3 + 1] = color.g;
    particles.colors[i3 + 2] = color.b;
    
    // Fall speed
    particles.speeds[i] = Math.random() * 0.01 + 0.005;
  }
  
  // Set the attributes
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1));
  
  // Create particle material
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float time;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });
  
  // Create particle system
  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
};
