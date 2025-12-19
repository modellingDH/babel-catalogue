import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { TWEEN } from 'https://cdn.skypack.dev/tween.js';

/**
 * Create a Babel Catalogue instance.
 *
 * This sets up the 3D book with spine, hinged covers, and individual pages.
 * Returns an API that can be wired into any UI (sliders, buttons, LLM callbacks, etc).
 *
 * @param {Object} options
 * @param {HTMLElement} [options.container=document.body] - Where to attach the WebGL canvas.
 * @param {number} [options.pageCount=15] - Number of individual page meshes.
 * @param {number} [options.initialSpineRotation=0.5] - Initial spine Y rotation.
 * @param {number} [options.initialTilt=0.2] - Initial X rotation (tilt).
 * @param {number} [options.initialScale=1] - Initial scale.
 * @param {number} [options.initialFrontHinge=0] - Initial front cover hinge angle.
 * @param {number} [options.initialBackHinge=0] - Initial back cover hinge angle.
 * @param {string} [options.initialMaterial='leather'] - Initial cover material.
 * @param {boolean} [options.initialHover=false] - Whether the book starts in hover mode.
 * @param {number} [options.initialGlowIntensity=0.0] - Initial glow intensity (0.0 to 2.0).
 * @param {number} [options.initialConfidenceScore=0.0] - Initial confidence score (0.0 to 1.0).
 * @param {number} [options.initialParticleIntensity=0.0] - Initial particle intensity (0.0 to 1.0).
 * @param {number} [options.particleCount=1500] - Number of particles in the data stream.
 * @param {boolean} [options.enableParticles=true] - Whether particles are enabled.
 * @param {boolean} [options.enablePageContent=true] - Whether page content texture is enabled.
 * @param {(direction: 'f'|'b') => void} [options.onFlip] - Callback fired when pages flip.
 * @param {() => void} [options.onGlitch] - Callback fired when glitch is triggered.
 * @param {(isHovering: boolean) => void} [options.onHoverChange] - Callback fired when hover toggles.
 * @returns {{
 *   setSpineRotation: (angle: number) => void,
 *   setTilt: (angle: number) => void,
 *   setScale: (value: number) => void,
 *   setFrontHinge: (angle: number) => void,
 *   setBackHinge: (angle: number) => void,
 *   flipPages: (direction: 'f'|'b') => void,
 *   resetPages: () => void,
 *   morphMaterial: (type: 'leather'|'metal'|'glass') => void,
 *   glitch: () => void,
 *   toggleHover: () => void,
 *   getState: () => object,
 *   resize: () => void,
 *   dispose: () => void,
 *   bookGroup: THREE.Group,
 *   setGlowIntensity: (intensity: number) => void,
 *   setConfidenceScore: (score: number) => void,
 *   setParticleIntensity: (intensity: number) => void,
 *   enableParticles: (enabled: boolean) => void,
 *   setPageContent: (text: string) => void,
 *   setScrollSpeed: (speed: number) => void,
 *   enablePageContent: (enabled: boolean) => void,
 *   updatePageContentStream: (tokens: string[]) => void
 * }}
 */
export function createBabelCatalogue(options = {}) {
  const {
    container = document.body,
    pageCount = 15,
    initialSpineRotation = 0.5,
    initialTilt = 0.2,
    initialScale = 1,
    initialFrontHinge = 0,
    initialBackHinge = 0,
    initialMaterial = 'leather',
    initialHover = false,
    initialGlowIntensity = 0.0,
    initialConfidenceScore = 0.0,
    initialParticleIntensity = 0.0,
    particleCount = 1500,
    enableParticles = true,
    enablePageContent = true,
    onFlip,
    onGlitch,
    onHoverChange,
  } = options;

  // --- THREE.JS ENGINE ---
  const scene = new THREE.Scene();

  const getContainerSize = () => {
    // For body/document.body, use window dimensions directly
    if (container === document.body || container === document.documentElement) {
      return { w: window.innerWidth, h: window.innerHeight };
    }
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    return { w: w || window.innerWidth, h: h || window.innerHeight };
  };
  const { w: initialW, h: initialH } = getContainerSize();

  // Ensure container has proper dimensions
  if (container === document.body) {
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
  }

  const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(initialW, initialH);
  renderer.setClearColor(0x020202);

  // Position canvas absolutely to fill container
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.PointLight(0x00ffcc, 1, 50);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Book Group
  const bookGroup = new THREE.Group();
  scene.add(bookGroup);

  // Materials
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x2b1e16,
    side: THREE.DoubleSide,
  });
  // Phase 1.1: Convert to MeshPhysicalMaterial for emissive glow
  const pageMat = new THREE.MeshPhysicalMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    emissive: 0x00ffcc,
    emissiveIntensity: initialGlowIntensity,
  });

  // Spine
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  bookGroup.add(spine);

  // Front Cover (Hinged)
  const frontPivot = new THREE.Group();
  frontPivot.position.set(0.05, 0, 0.3);
  const frontCover = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.05), coverMat);
  frontCover.position.x = 1.5;
  frontPivot.add(frontCover);
  bookGroup.add(frontPivot);

  // Back Cover (Hinged)
  const backPivot = new THREE.Group();
  backPivot.position.set(0.05, 0, -0.3);
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.05), coverMat);
  backCover.position.x = 1.5;
  backPivot.add(backCover);
  bookGroup.add(backPivot);

  // Individual Pages
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    const pagePivot = new THREE.Group();
    pagePivot.position.set(0.06, 0, -0.25 + i * 0.035);
    bookGroup.add(pagePivot);
    const pageMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.8), pageMat);
    pageMesh.position.x = 1.4;
    pagePivot.add(pageMesh);
    pages.push(pagePivot);
  }
  
  // Phase 1.3: Canvas texture for page content
  if (pageContentEnabled) {
    pageContentCanvas = document.createElement('canvas');
    pageContentCanvas.width = 512;
    pageContentCanvas.height = 512;
    const ctx = pageContentCanvas.getContext('2d');
    pageContentTexture = new THREE.CanvasTexture(pageContentCanvas);
    pageContentTexture.wrapS = THREE.RepeatWrapping;
    pageContentTexture.wrapT = THREE.RepeatWrapping;
    pageMat.map = pageContentTexture;
    pageMat.needsUpdate = true;
    
    // Initial text rendering
    updatePageContent();
  }
  
  // Phase 1.2: Particle system
  if (particlesEnabled) {
    particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    particleVelocities = new Float32Array(particleCount * 3);
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Start particles at base of pages
      posArray[i3] = (Math.random() - 0.5) * 2.5; // X
      posArray[i3 + 1] = -2 + Math.random() * 0.5; // Y (base)
      posArray[i3 + 2] = -0.25 + Math.random() * 0.1; // Z
      
      // Random velocities (stored persistently)
      particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 1] = 0.01 + Math.random() * 0.03; // Upward
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffcc,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
  }

  // Camera setup
  camera.position.set(6, 4, 10);
  camera.lookAt(0, 0, 0);

  // State
  let isHovering = false;
  let frontHingeAngle = 0;
  let backHingeAngle = 0;
  
  // Phase 1.1: Glow intensity tracking
  let currentGlowIntensity = initialGlowIntensity;
  let confidenceScore = initialConfidenceScore;
  let previousPageAngles = new Array(pageCount).fill(0);
  let lastUpdateTime = performance.now();
  
  // Phase 1.2: Particle system state
  let particleIntensity = initialParticleIntensity;
  let particlesEnabled = enableParticles;
  let particles = null;
  let particleGeometry = null;
  let particleMaterial = null;
  let particleVelocities = null; // Store velocities for particles
  
  // Phase 1.3: Canvas texture for page content
  let pageContentEnabled = enablePageContent;
  let pageContentCanvas = null;
  let pageContentTexture = null;
  let scrollOffset = 0;
  let scrollSpeed = 1.0;

  const emitEvent = (type, detail) => {
    try {
      const target = container || window;
      if (typeof CustomEvent === 'function' && target && target.dispatchEvent) {
        target.dispatchEvent(new CustomEvent(type, { detail }));
      }
    } catch {
      // swallow event errors to avoid breaking rendering
    }
  };

  // API Methods
  const setSpineRotation = (angle) => {
    bookGroup.rotation.y = angle;
  };

  const setTilt = (angle) => {
    bookGroup.rotation.x = angle;
  };

  const setScale = (value) => {
    bookGroup.scale.set(value, value, value);
  };

  const setFrontHinge = (angle) => {
    frontHingeAngle = angle;
    frontPivot.rotation.y = -angle;
    // Constrain pages to not exceed front hinge
    pages.forEach((p) => {
      if (p.rotation.y < -angle) p.rotation.y = -angle;
    });
  };

  const setBackHinge = (angle) => {
    backHingeAngle = angle;
    backPivot.rotation.y = angle;
    // Constrain pages to not exceed back hinge
    pages.forEach((p) => {
      if (p.rotation.y > angle) p.rotation.y = angle;
    });
  };

  const flipPages = (direction) => {
    const target = direction === 'f' ? -frontHingeAngle : backHingeAngle;
    pages.forEach((p, i) => {
      new TWEEN.Tween(p.rotation)
        .to({ y: target }, 700)
        .delay(i * 60)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    });
    if (typeof onFlip === 'function') onFlip(direction);
    emitEvent('babel:flip', { direction, state: getState() });
  };
  
  // Phase 1.1: Update glow intensity based on flip velocity
  const updateGlowFromFlipVelocity = () => {
    const now = performance.now();
    const deltaTime = (now - lastUpdateTime) / 1000; // Convert to seconds
    lastUpdateTime = now;
    
    if (deltaTime === 0) return;
    
    let maxVelocity = 0;
    pages.forEach((p, i) => {
      const currentAngle = p.rotation.y;
      const previousAngle = previousPageAngles[i];
      const velocity = Math.abs(currentAngle - previousAngle) / deltaTime;
      maxVelocity = Math.max(maxVelocity, velocity);
      previousPageAngles[i] = currentAngle;
    });
    
    // Map velocity to emissive intensity (0.0 to 2.0)
    const velocityBasedGlow = Math.min(maxVelocity * 0.1, 2.0);
    
    // Combine with confidence score
    const confidenceBasedGlow = confidenceScore * 0.5;
    
    // Use maximum of both, but smooth transitions
    const targetGlow = Math.max(velocityBasedGlow, confidenceBasedGlow);
    currentGlowIntensity = currentGlowIntensity * 0.9 + targetGlow * 0.1; // Smooth interpolation
    pageMat.emissiveIntensity = Math.max(0, Math.min(2.0, currentGlowIntensity));
  };
  
  // Phase 1.1: API methods for glow
  const setGlowIntensity = (intensity) => {
    currentGlowIntensity = Math.max(0, Math.min(2.0, intensity));
    pageMat.emissiveIntensity = currentGlowIntensity;
  };
  
  const setConfidenceScore = (score) => {
    confidenceScore = Math.max(0, Math.min(1.0, score));
    // Confidence affects both glow and particles
    const confidenceGlow = confidenceScore * 0.5;
    if (confidenceGlow > currentGlowIntensity) {
      currentGlowIntensity = confidenceGlow;
      pageMat.emissiveIntensity = currentGlowIntensity;
    }
    // Update particle intensity
    if (particlesEnabled) {
      particleIntensity = confidenceScore;
    }
  };
  
  // Phase 1.2: Particle system API methods
  const setParticleIntensity = (intensity) => {
    particleIntensity = Math.max(0, Math.min(1.0, intensity));
  };
  
  const enableParticles = (enabled) => {
    particlesEnabled = enabled;
    if (particles) {
      particles.visible = enabled;
    }
  };
  
  // Phase 1.2: Update particle system
  const updateParticles = (deltaTime) => {
    if (!particlesEnabled || !particles || !particleVelocities) return;
    
    const isBookOpen = frontHingeAngle > 0.5 || backHingeAngle > 0.5;
    if (!isBookOpen) {
      // Hide particles when book is closed
      particles.visible = false;
      return;
    }
    
    particles.visible = true;
    const posArray = particleGeometry.attributes.position.array;
    const activeParticleCount = Math.floor(particleIntensity * particleCount);
    
    for (let i = 0; i < activeParticleCount; i++) {
      const i3 = i * 3;
      
      // Update position using stored velocities
      posArray[i3] += particleVelocities[i3] * deltaTime * 60; // Scale by deltaTime
      posArray[i3 + 1] += particleVelocities[i3 + 1] * deltaTime * 60 * (0.5 + particleIntensity * 0.5);
      posArray[i3 + 2] += particleVelocities[i3 + 2] * deltaTime * 60;
      
      // Reset if particle goes too high
      if (posArray[i3 + 1] > 3) {
        posArray[i3] = (Math.random() - 0.5) * 2.5;
        posArray[i3 + 1] = -2 + Math.random() * 0.5;
        posArray[i3 + 2] = -0.25 + Math.random() * 0.1;
        // Reset velocity
        particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
        particleVelocities[i3 + 1] = 0.01 + Math.random() * 0.03;
        particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      }
    }
    
    particleGeometry.attributes.position.needsUpdate = true;
  };
  
  // Phase 1.3: Update page content canvas
  const updatePageContent = () => {
    if (!pageContentEnabled || !pageContentCanvas) return;
    
    const ctx = pageContentCanvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
    
    // Generate procedural text/glyphs
    const symbols = ['▮', '▯', '▰', '▱', '▪', '▫', '◼', '◻', '●', '○', '◆', '◇'];
    ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    // Draw scrolling columns
    const columnCount = 8;
    const lineHeight = 12;
    const columnWidth = 512 / columnCount;
    
    for (let col = 0; col < columnCount; col++) {
      const x = col * columnWidth;
      const startY = (scrollOffset + col * 50) % (512 + lineHeight * 10) - lineHeight * 10;
      
      for (let i = 0; i < 20; i++) {
        const y = startY + i * lineHeight;
        if (y > -lineHeight && y < 512) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          ctx.fillText(symbol, x + 5, y);
        }
      }
    }
    
    pageContentTexture.needsUpdate = true;
  };
  
  // Phase 1.3: Page content API methods
  const setPageContent = (text) => {
    if (!pageContentCanvas) return;
    const ctx = pageContentCanvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = 'rgba(0, 255, 204, 0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 256);
    pageContentTexture.needsUpdate = true;
  };
  
  const setScrollSpeed = (speed) => {
    scrollSpeed = Math.max(0, Math.min(5.0, speed));
  };
  
  const enablePageContent = (enabled) => {
    pageContentEnabled = enabled;
    if (pageContentTexture) {
      pageMat.map = enabled ? pageContentTexture : null;
      pageMat.needsUpdate = true;
    }
  };
  
  const updatePageContentStream = (tokens) => {
    // For streaming AI tokens - could be enhanced
    if (!pageContentCanvas) return;
    const ctx = pageContentCanvas.getContext('2d');
    // Implementation for token streaming
  };

  const resetPages = () => {
    pages.forEach((p) => {
      new TWEEN.Tween(p.rotation).to({ y: 0 }, 500).start();
    });
  };

  const morphMaterial = (type) => {
    const colors = {
      leather: 0x2b1e16,
      metal: 0x777777,
      glass: 0xffffff,
    };
    const color = colors[type] || colors.leather;
    coverMat.color.set(color);
    coverMat.opacity = type === 'glass' ? 0.3 : 1;
    coverMat.transparent = type === 'glass';
  };

  const glitch = () => {
    new TWEEN.Tween(bookGroup.position)
      .to({ x: [0.3, -0.3, 0] }, 50)
      .repeat(4)
      .start();
    if (typeof onGlitch === 'function') onGlitch();
    emitEvent('babel:glitch', { state: getState() });
  };

  const toggleHover = () => {
    isHovering = !isHovering;
    if (typeof onHoverChange === 'function') onHoverChange(isHovering);
    emitEvent('babel:hoverChange', { isHovering, state: getState() });
    if (!isHovering) {
      new TWEEN.Tween(bookGroup.position).to({ y: 0 }, 500).start();
    }
  };

  // Initialize
  setSpineRotation(initialSpineRotation);
  setTilt(initialTilt);
  setScale(initialScale);
  morphMaterial(initialMaterial);
  setFrontHinge(initialFrontHinge);
  setBackHinge(initialBackHinge);
  if (initialHover) {
    isHovering = true;
  }

  // Animation loop
  let animationId = null;
  let animationTime = 0;
  let lastFrameTime = performance.now();
  const animate = (time) => {
    animationId = requestAnimationFrame(animate);
    animationTime = time;
    TWEEN.update(time);
    
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    
    // Phase 1.1: Update glow from flip velocity
    updateGlowFromFlipVelocity();
    
    // Phase 1.2: Update particles
    updateParticles(deltaTime);
    
    // Phase 1.3: Update page content scroll
    if (pageContentEnabled) {
      scrollOffset += scrollSpeed;
      if (scrollOffset > 512) scrollOffset = 0;
      updatePageContent();
    }
    
    if (isHovering) {
      bookGroup.position.y = Math.sin(time * 0.002) * 0.3;
    }
    renderer.render(scene, camera);
  };
  animate();

  // Resize handler
  const resize = () => {
    const { w, h } = getContainerSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  // Cleanup
  const dispose = () => {
    if (animationId) cancelAnimationFrame(animationId);
    renderer.dispose();
    coverMat.dispose();
    pageMat.dispose();
    if (particleGeometry) particleGeometry.dispose();
    if (particleMaterial) particleMaterial.dispose();
    if (pageContentTexture) pageContentTexture.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };

  window.addEventListener('resize', resize);

  const getState = () => ({
    isHovering,
    frontHingeAngle,
    backHingeAngle,
    spineRotation: bookGroup.rotation.y,
    tilt: bookGroup.rotation.x,
    scale: bookGroup.scale.x,
    glowIntensity: currentGlowIntensity,
    confidenceScore,
    particleIntensity,
    particlesEnabled,
    pageContentEnabled,
  });

  return {
    setSpineRotation,
    setTilt,
    setScale,
    setFrontHinge,
    setBackHinge,
    flipPages,
    resetPages,
    morphMaterial,
    glitch,
    toggleHover,
    getState,
    resize,
    dispose,
    bookGroup, // Direct access for advanced control
    // Phase 1 additions
    setGlowIntensity,
    setConfidenceScore,
    setParticleIntensity,
    enableParticles,
    setPageContent,
    setScrollSpeed,
    enablePageContent,
    updatePageContentStream,
  };
}
