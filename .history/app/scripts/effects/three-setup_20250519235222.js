// Three.js Background Effects for CHIMERA
// This script creates the animated background effects using Three.js

// Import Three.js
// Note: In a real application, we would use a proper import statement
// This code assumes Three.js is available via window.THREE

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

// Morrowind effect: Mystical glowing runes and dust particles
const createMorrowindEffect = () => {
  // Create particle geometry
  const particleCount = 300;
  const particleGeometry = new THREE.BufferGeometry();

  // Create arrays to hold particle data
  particles = {
    positions: new Float32Array(particleCount * 3),
    sizes: new Float32Array(particleCount),
    colors: new Float32Array(particleCount * 3),
    speeds: new Float32Array(particleCount),
    rotations: new Float32Array(particleCount)
  };

  // Initialize particle data
  const color = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    // Position: random across the screen
    const i3 = i * 3;
    particles.positions[i3] = (Math.random() - 0.5) * 15;
    particles.positions[i3 + 1] = (Math.random() - 0.5) * 15;
    particles.positions[i3 + 2] = (Math.random() - 0.5) * 15;

    // Size: varying sizes for dust and runes
    particles.sizes[i] = Math.random() * 0.2 + 0.05;

    // Color: amber/gold hues for Morrowind
    const hue = 0.08 + Math.random() * 0.05; // Amber/gold range
    const saturation = 0.5 + Math.random() * 0.3;
    const lightness = 0.4 + Math.random() * 0.3;

    color.setHSL(hue, saturation, lightness);
    particles.colors[i3] = color.r;
    particles.colors[i3 + 1] = color.g;
    particles.colors[i3 + 2] = color.b;

    // Movement speeds and rotations
    particles.speeds[i] = Math.random() * 0.003 + 0.001;
    particles.rotations[i] = Math.random() * Math.PI;
  }

  // Set the attributes
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1));
  particleGeometry.setAttribute('rotation', new THREE.BufferAttribute(particles.rotations, 1));

  // Create particle material - using a custom shader for rune-like shapes
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute float rotation;
      varying vec3 vColor;
      varying float vRotation;
      uniform float time;
      void main() {
        vColor = color;
        vRotation = rotation + time * 0.5;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vRotation;
      void main() {
        // Transform coordinates for rotation
        vec2 center = vec2(0.5, 0.5);
        vec2 uv = gl_PointCoord - center;
        float cos_rot = cos(vRotation);
        float sin_rot = sin(vRotation);
        vec2 rotated = vec2(
          cos_rot * uv.x - sin_rot * uv.y,
          sin_rot * uv.x + cos_rot * uv.y
        ) + center;

        // Create rune-like shapes
        float alpha = 0.0;

        // Basic circle
        float circle = length(rotated - center);
        if (circle < 0.45) alpha = 1.0;

        // Add some rune-like details
        if (abs(rotated.x - 0.5) < 0.05 && rotated.y > 0.3 && rotated.y < 0.7) alpha = 1.0;
        if (abs(rotated.y - 0.5) < 0.05 && rotated.x > 0.3 && rotated.x < 0.7) alpha = 1.0;

        if (alpha < 0.1) discard;
        gl_FragColor = vec4(vColor, alpha * 0.8);
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

// Animation loop
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  if (backgroundEffect === 'lain') {
    updateLainEffect();
  } else {
    updateMorrowindEffect();
  }

  renderer.render(scene, camera);
};

// Update Lain effect animation
const updateLainEffect = () => {
  if (!particles || !particleSystem) return;

  const positions = particleSystem.geometry.attributes.position.array;
  const time = performance.now() * 0.001; // time in seconds

  // Update particles
  for (let i = 0; i < positions.length / 3; i++) {
    const i3 = i * 3;

    // Falling motion
    positions[i3 + 1] -= particles.speeds[i];

    // Reset particle when it falls below the screen
    if (positions[i3 + 1] < -5) {
      positions[i3 + 1] = 5;
      positions[i3] = (Math.random() - 0.5) * 10;
    }

    // Add some subtle horizontal movement
    positions[i3] += Math.sin(time + i) * 0.003;
  }

  // Update uniform time value for shader
  particleSystem.material.uniforms.time.value = time;

  // Flag geometry for update
  particleSystem.geometry.attributes.position.needsUpdate = true;
};

// Update Morrowind effect animation
const updateMorrowindEffect = () => {
  if (!particles || !particleSystem) return;

  const positions = particleSystem.geometry.attributes.position.array;
  const sizes = particleSystem.geometry.attributes.size.array;
  const time = performance.now() * 0.001; // time in seconds

  // Update particles
  for (let i = 0; i < positions.length / 3; i++) {
    const i3 = i * 3;

    // Slow upward floating motion
    positions[i3 + 1] += particles.speeds[i] * Math.sin(time * 0.5 + i);

    // Slow circular motion
    const angle = time * 0.1 + i * 0.1;
    positions[i3] += Math.sin(angle) * 0.002;
    positions[i3 + 2] += Math.cos(angle) * 0.002;

    // Pulsing size
    sizes[i] = particles.sizes[i] * (0.8 + 0.4 * Math.sin(time + i));

    // Reset particles that drift too far
    if (Math.abs(positions[i3]) > 10 || Math.abs(positions[i3 + 1]) > 10 || Math.abs(positions[i3 + 2]) > 10) {
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
  }

  // Update uniform time value for shader
  particleSystem.material.uniforms.time.value = time;

  // Flag geometry attributes for update
  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
};

// Handle window resize
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// Toggle between Lain and Morrowind effects
const toggleBackgroundEffect = () => {
  backgroundEffect = backgroundEffect === 'lain' ? 'morrowind' : 'lain';
  createBackgroundEffect();
};

// Set specific background effect
const setBackgroundEffect = (effect) => {
  if (effect === backgroundEffect) return;

  backgroundEffect = effect;
  createBackgroundEffect();
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create a loading indicator first
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-animation';
  loadingIndicator.innerHTML = '<div></div><div></div><div></div><div></div>';
  document.body.appendChild(loadingIndicator);

  // Initialize Three.js scene
  initThreeScene();

  // Remove loading indicator after initialization
  setTimeout(() => {
    loadingIndicator.remove();
  }, 2000);

  // Export API for use in other modules
  window.chimeraBackground = {
    setEffect: setBackgroundEffect
  };
});
