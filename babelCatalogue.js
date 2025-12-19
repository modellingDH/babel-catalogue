import * as THREE from 'three';
import * as TWEEN_MODULE from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PoissonDiskSampler } from './src/utils/PoissonDiskSampler.js';
import { PerformanceMonitor } from './src/utils/PerformanceMonitor.js';

// Create TWEEN namespace object for compatibility
const TWEEN = {
  Tween: TWEEN_MODULE.Tween,
  Easing: TWEEN_MODULE.Easing,
  update: TWEEN_MODULE.update,
};

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
 * @param {boolean} [options.enableParticlesOption=true] - Whether particles are enabled.
 * @param {boolean} [options.enablePageContentOption=true] - Whether page content texture is enabled.
 * @param {Object} [options.bookDimensions] - Book size: { height: 4, width: 3, depth: 0.7 }
 * @param {string} [options.frontCoverText=''] - Text to display on front cover
 * @param {string} [options.backCoverText=''] - Text to display on back cover
 * @param {boolean} [options.enableGestures=true] - Enable zoom/rotate gestures
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
 *   updatePageContentStream: (tokens: string[]) => void,
 *   setBookDimensions: (dimensions: { height: number, width: number, depth: number }) => void,
 *   setFrontCoverText: (text: string) => void,
 *   setBackCoverText: (text: string) => void,
 *   flipSinglePage: (pageIndex: number, direction: 'f'|'b') => void,
 *   setCoverTransparency: (opacity: number) => void,
 *   setPageTransparency: (opacity: number) => void,
 *   setCoverColor: (color: number|string) => void,
 *   setPageColor: (color: number|string) => void
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
    enableParticlesOption = true,
    enablePageContentOption = true,
    bookDimensions = { height: 4, width: 3, depth: 0.7 },
    frontCoverText = '',
    backCoverText = '',
    enableGestures = true,
    debug = false, // Debug mode with visualization helpers
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

  // Lighting - MATCH concept.html exactly
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.PointLight(0x00ffcc, 1, 50);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Book Group
  const bookGroup = new THREE.Group();
  scene.add(bookGroup);
  
  // Debug mode helpers
  if (debug) {
    // Add axes helper to show coordinate system
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Add grid helper for spatial reference
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);
    
    console.log('=== Debug Mode Enabled ===');
    console.log('Book dimensions:', { bookHeight, bookWidth, bookDepth });
    console.log('Camera position:', camera.position);
  }

  // Book dimensions - make dynamic
  let bookHeight = bookDimensions.height || 4;
  let bookWidth = bookDimensions.width || 3;
  let bookDepth = bookDimensions.depth || 0.7;
  const spineWidth = 0.1;
  const coverThickness = 0.05;

  // Materials
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x3d2e20,
    side: THREE.DoubleSide,
  });
  
  // Cover text canvases
  const frontCoverCanvas = document.createElement('canvas');
  frontCoverCanvas.width = 512;
  frontCoverCanvas.height = 512;
  const frontCoverCtx = frontCoverCanvas.getContext('2d');
  const frontCoverTexture = new THREE.CanvasTexture(frontCoverCanvas);
  
  const backCoverCanvas = document.createElement('canvas');
  backCoverCanvas.width = 512;
  backCoverCanvas.height = 512;
  const backCoverCtx = backCoverCanvas.getContext('2d');
  const backCoverTexture = new THREE.CanvasTexture(backCoverCanvas);
  
  // Create cover material with texture support
  const frontCoverMat = coverMat.clone();
  const backCoverMat = coverMat.clone();
  
  // Page material - Start with concept.html base, add Phase 1 features carefully
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.15, // EXACT value from concept.html for visibility
    side: THREE.DoubleSide, // Render both sides
    emissive: 0x00ffcc, // For Phase 1 glow effect
    emissiveIntensity: 0, // Start at 0 so pages are visible first
  });

  // Spine - FIXED position at origin
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(spineWidth, bookHeight, bookDepth),
    new THREE.MeshStandardMaterial({ color: 0x666666 })
  );
  bookGroup.add(spine);

  // Front Cover (Hinged) - FIXED anchor position like concept.html
  const frontPivot = new THREE.Group();
  // Pivot MUST stay at 0.05 (spine edge) regardless of book width
  frontPivot.position.set(0.05, 0, 0.3);
  const frontCover = new THREE.Mesh(
    new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness),
    frontCoverMat
  );
  // Cover extends from pivot - position at bookWidth/2 so left edge at spine
  // BoxGeometry is centered, so at x = bookWidth/2, left edge = 0 (at pivot)
  frontCover.position.x = bookWidth / 2;
  frontPivot.add(frontCover);
  bookGroup.add(frontPivot);

  // Back Cover (Hinged) - FIXED anchor position like concept.html
  const backPivot = new THREE.Group();
  // Pivot MUST stay at 0.05 (spine edge) regardless of book width
  backPivot.position.set(0.05, 0, -0.3);
  const backCover = new THREE.Mesh(
    new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness),
    backCoverMat
  );
  // Cover extends from pivot - position at bookWidth/2 so left edge at spine
  backCover.position.x = bookWidth / 2;
  backPivot.add(backCover);
  bookGroup.add(backPivot);

  // Phase 1.2: Particle system state - declare variables first
  // Set minimum intensity so particles are visible when book opens
  let particleIntensity = initialParticleIntensity;
  let particlesEnabled = enableParticlesOption;
  let particles = null;
  let particleGeometry = null;
  let particleMaterial = null;
  let particleVelocities = null; // Store velocities for particles
  
  // Phase 1.3: Canvas texture for page content - declare variables first
  let pageContentEnabled = enablePageContentOption;
  let pageContentCanvas = null;
  let pageContentTexture = null;
  let scrollOffset = 0;
  let scrollSpeed = 1.0;

  // Individual Pages - EXACTLY match concept.html structure
  const pages = [];
  const pageMeshes = []; // Store meshes for dimension updates
  // Use FIXED sizes like concept.html: 2.8 x 3.8
  const pageWidth = 2.8;
  const pageHeight = 3.8;
  
  // FIXED: Use concept.html's exact formula
  // concept.html: pPiv.position.set(0.06, 0, -0.25 + (i * 0.035))
  for (let i = 0; i < pageCount; i++) {
    const pagePivot = new THREE.Group();
    // EXACT formula from concept.html
    const zOffset = -0.25 + (i * 0.035);
    pagePivot.position.set(0.06, 0, zOffset);
    bookGroup.add(pagePivot);
    const pageMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageWidth, pageHeight),
      pageMat
    );
    // EXACT position from concept.html: x = 1.4
    pageMesh.position.x = 1.4;
    // NO ROTATION - concept.html doesn't rotate, PlaneGeometry default is correct
    pagePivot.add(pageMesh);
    pages.push(pagePivot);
    pageMeshes.push(pageMesh);
    
    // Debug: Add wireframe and axes to each page
    if (debug) {
      const wireframe = new THREE.WireframeGeometry(pageMesh.geometry);
      const line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.opacity = 0.5;
      line.material.transparent = true;
      line.material.color.set(0xff00ff);
      pageMesh.add(line);
      
      const pageAxes = new THREE.AxesHelper(0.5);
      pagePivot.add(pageAxes);
      
      console.log(`Page ${i}:`, {
        pivot: pagePivot.position.toArray(),
        mesh: pageMesh.position.toArray(),
        zOffset: zOffset.toFixed(3)
      });
    }
  }
  
  // Track which pages have been flipped
  const pageFlippedState = new Array(pageCount).fill(false);
  
  // Phase 1.3: Canvas texture for page content
  if (enablePageContentOption) {
    pageContentCanvas = document.createElement('canvas');
    pageContentCanvas.width = 512;
    pageContentCanvas.height = 512;
    const ctx = pageContentCanvas.getContext('2d');
    pageContentTexture = new THREE.CanvasTexture(pageContentCanvas);
    pageContentTexture.wrapS = THREE.RepeatWrapping;
    pageContentTexture.wrapT = THREE.RepeatWrapping;
    pageMat.map = pageContentTexture;
    pageMat.needsUpdate = true;
    
    // Initial text rendering - will be called in animation loop
    // Draw initial content directly
    ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const symbols = ['▮', '▯', '▰', '▱', '▪', '▫', '◼', '◻', '●', '○', '◆', '◇'];
    for (let col = 0; col < 8; col++) {
      for (let i = 0; i < 20; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        ctx.fillText(symbol, col * 64 + 5, i * 12);
      }
    }
    pageContentTexture.needsUpdate = true;
  }
  
  // Phase 1.2: Particle system
  if (enableParticlesOption) {
    particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    particleVelocities = new Float32Array(particleCount * 3);
    
    // FIXED: Use Poisson disk sampling for even distribution (prevents blob)
    const sampler = new PoissonDiskSampler(
      bookWidth * 0.8,   // Width of spawn area
      bookHeight * 0.5,  // Height of spawn area
      bookDepth * 0.5,   // Depth of spawn area
      0.1                // Minimum distance between particles
    );
    
    const positions = sampler.sample(particleCount);
    
    if (debug) {
      console.log(`Particle distribution: ${positions.length}/${particleCount} particles generated`);
    }
    
    // Initialize particles with Poisson-distributed positions
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const pos = positions[i] || { x: 0, y: 0, z: 0 };
      
      // Position particles at base of book with even distribution
      posArray[i3] = pos.x;
      posArray[i3 + 1] = pos.y - bookHeight / 4; // Offset to base
      posArray[i3 + 2] = pos.z;
      
      // Random velocities (stored persistently)
      particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 1] = 0.02 + Math.random() * 0.05; // Upward
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

  // Camera setup - adjusted for better view
  camera.position.set(6, 4, 10);
  camera.lookAt(0, 0, 0);
  
  // Gesture controls (OrbitControls for zoom/rotate)
  let controls = null;
  if (enableGestures) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.enablePan = false; // Disable panning, only rotation and zoom
    controls.target.set(0, 0, 0);
  }
  
  // Render cover text
  const renderCoverText = (canvas, ctx, text, isFront = true) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!text) return;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Handle multi-line text (split by newlines) and word wrapping
    const lines = text.split('\n');
    const maxWidth = canvas.width * 0.8;
    const lineHeight = 60;
    const padding = 40;
    let currentY = padding;
    
    for (let lineText of lines) {
      if (!lineText.trim()) {
        currentY += lineHeight;
        continue;
      }
      
      // Word wrapping for each line
      const words = lineText.split(' ');
      let line = '';
      
      for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), canvas.width / 2, currentY);
          line = word + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      
      if (line.trim()) {
        ctx.fillText(line.trim(), canvas.width / 2, currentY);
        currentY += lineHeight;
      }
      
      // Prevent text from going off canvas
      if (currentY > canvas.height - padding) break;
    }
  };
  
  // Initialize cover textures
  if (frontCoverText) {
    renderCoverText(frontCoverCanvas, frontCoverCtx, frontCoverText, true);
    frontCoverTexture.needsUpdate = true;
    frontCoverMat.map = frontCoverTexture;
    frontCoverMat.needsUpdate = true;
  }
  
  if (backCoverText) {
    renderCoverText(backCoverCanvas, backCoverCtx, backCoverText, false);
    backCoverTexture.needsUpdate = true;
    backCoverMat.map = backCoverTexture;
    backCoverMat.needsUpdate = true;
  }

  // State
  let isHovering = false;
  let frontHingeAngle = 0;
  let backHingeAngle = 0;
  
  // Phase 1.1: Glow intensity tracking
  let currentGlowIntensity = initialGlowIntensity;
  let confidenceScore = initialConfidenceScore;
  let previousPageAngles = new Array(pageCount).fill(0);
  let lastUpdateTime = performance.now();
  
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
  
  // Single page flip - flip one page at a time
  const flipSinglePage = (pageIndex, direction) => {
    if (pageIndex < 0 || pageIndex >= pages.length) return;
    
    const page = pages[pageIndex];
    const target = direction === 'f' ? -frontHingeAngle : backHingeAngle;
    
    // Toggle flip state
    pageFlippedState[pageIndex] = !pageFlippedState[pageIndex];
    const finalTarget = pageFlippedState[pageIndex] ? target : 0;
    
    new TWEEN.Tween(page.rotation)
      .to({ y: finalTarget }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
    
    if (typeof onFlip === 'function') onFlip(direction);
    emitEvent('babel:flip', { direction, pageIndex, state: getState() });
  };
  
  // Set book dimensions
  const setBookDimensions = (dimensions) => {
    const newHeight = dimensions.height || bookHeight;
    const newWidth = dimensions.width || bookWidth;
    const newDepth = dimensions.depth || bookDepth;
    
    // Update dimensions
    bookHeight = newHeight;
    bookWidth = newWidth;
    bookDepth = newDepth;
    
    // Update spine geometry
    spine.geometry.dispose();
    spine.geometry = new THREE.BoxGeometry(spineWidth, bookHeight, bookDepth);
    
    // Update front cover geometry and position
    frontCover.geometry.dispose();
    frontCover.geometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    // CRITICAL: Cover mesh position = bookWidth/2 so left edge stays at pivot (spine)
    // BoxGeometry is centered, so position at half-width means left edge at x=0
    frontCover.position.x = bookWidth / 2;
    // Pivot position NEVER changes: (0.05, 0, 0.3)
    
    // Update back cover geometry and position
    backCover.geometry.dispose();
    backCover.geometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    // CRITICAL: Cover mesh position = bookWidth/2 so left edge stays at pivot (spine)
    backCover.position.x = bookWidth / 2;
    // Pivot position NEVER changes: (0.05, 0, -0.3)
    
    // Update page positions (pages are positioned based on depth)
    const pageThickness = bookDepth / pageCount;
    const pageWidth = bookWidth * 0.93;
    const pageHeight = bookHeight * 0.95;
    
    pages.forEach((pagePivot, i) => {
      const zOffset = -bookDepth / 2 + (i + 0.5) * pageThickness;
      // Match concept.html positioning: 0.06
      pagePivot.position.set(0.06, 0, zOffset);
      
      // Update page mesh geometry
      const pageMesh = pageMeshes[i];
      if (pageMesh) {
        pageMesh.geometry.dispose();
        pageMesh.geometry = new THREE.PlaneGeometry(pageWidth, pageHeight);
        // Match concept.html: position.x = 1.4
        pageMesh.position.x = 1.4;
      }
    });
  };
  
  // Set front cover text
  const setFrontCoverText = (text) => {
    renderCoverText(frontCoverCanvas, frontCoverCtx, text, true);
    frontCoverTexture.needsUpdate = true;
    if (text) {
      frontCoverMat.map = frontCoverTexture;
    } else {
      frontCoverMat.map = null;
    }
    frontCoverMat.needsUpdate = true;
  };
  
  // Set back cover text
  const setBackCoverText = (text) => {
    renderCoverText(backCoverCanvas, backCoverCtx, text, false);
    backCoverTexture.needsUpdate = true;
    if (text) {
      backCoverMat.map = backCoverTexture;
    } else {
      backCoverMat.map = null;
    }
    backCoverMat.needsUpdate = true;
  };
  
  // Set cover transparency (opacity: 0.0 to 1.0)
  const setCoverTransparency = (opacity) => {
    const clampedOpacity = Math.max(0, Math.min(1.0, opacity));
    coverMat.opacity = clampedOpacity;
    coverMat.transparent = clampedOpacity < 1.0;
    coverMat.needsUpdate = true;
    // Also update front and back cover materials
    frontCoverMat.opacity = clampedOpacity;
    frontCoverMat.transparent = clampedOpacity < 1.0;
    frontCoverMat.needsUpdate = true;
    backCoverMat.opacity = clampedOpacity;
    backCoverMat.transparent = clampedOpacity < 1.0;
    backCoverMat.needsUpdate = true;
  };
  
  // Set page transparency (opacity: 0.0 to 1.0)
  const setPageTransparency = (opacity) => {
    const clampedOpacity = Math.max(0, Math.min(1.0, opacity));
    pageMat.opacity = clampedOpacity;
    pageMat.transparent = clampedOpacity < 1.0;
    pageMat.needsUpdate = true;
  };
  
  // Set cover color (accepts hex number or CSS color string)
  const setCoverColor = (color) => {
    const colorValue = typeof color === 'string' 
      ? new THREE.Color(color).getHex()
      : color;
    coverMat.color.setHex(colorValue);
    coverMat.needsUpdate = true;
    // Also update front and back cover materials
    frontCoverMat.color.setHex(colorValue);
    frontCoverMat.needsUpdate = true;
    backCoverMat.color.setHex(colorValue);
    backCoverMat.needsUpdate = true;
  };
  
  // Set page color (accepts hex number or CSS color string)
  const setPageColor = (color) => {
    const colorValue = typeof color === 'string'
      ? new THREE.Color(color).getHex()
      : color;
    pageMat.color.setHex(colorValue);
    // Also update emissive to match for glow effect
    if (pageMat.emissive) {
      pageMat.emissive.setHex(colorValue);
    }
    pageMat.needsUpdate = true;
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
    
    // If intensity is 0, still show a few particles for visual feedback
    const effectiveIntensity = Math.max(0.05, particleIntensity);
    
    particles.visible = true;
    const posArray = particleGeometry.attributes.position.array;
    const activeParticleCount = Math.max(10, Math.floor(effectiveIntensity * particleCount));
    
    // Check if covers are transparent
    const frontCoverTransparent = coverMat.transparent && coverMat.opacity < 1.0;
    const backCoverTransparent = coverMat.transparent && coverMat.opacity < 1.0;
    
    // Calculate cover positions in world space for occlusion
    const frontCoverZ = bookDepth / 2;
    const backCoverZ = -bookDepth / 2;
    
    for (let i = 0; i < activeParticleCount; i++) {
      const i3 = i * 3;
      
      // Update position using stored velocities
      posArray[i3] += particleVelocities[i3] * deltaTime * 60;
      posArray[i3 + 1] += particleVelocities[i3 + 1] * deltaTime * 60 * (0.5 + effectiveIntensity * 0.5);
      posArray[i3 + 2] += particleVelocities[i3 + 2] * deltaTime * 60;
      
      // Particle occlusion: hide particles behind non-transparent covers
      const particleZ = posArray[i3 + 2];
      if (!frontCoverTransparent && particleZ > frontCoverZ) {
        // Particle is behind front cover - hide it
        posArray[i3 + 1] = -bookHeight; // Move off-screen below book
        continue;
      }
      if (!backCoverTransparent && particleZ < backCoverZ) {
        // Particle is behind back cover - hide it
        posArray[i3 + 1] = -bookHeight; // Move off-screen below book
        continue;
      }
      
      // Reset if particle goes too high
      if (posArray[i3 + 1] > bookHeight / 2 + 2) {
        // Respawn at base, spread across book area
        posArray[i3] = (Math.random() - 0.5) * bookWidth * 0.8;
        posArray[i3 + 1] = -bookHeight / 2 + Math.random() * 0.3;
        posArray[i3 + 2] = (Math.random() - 0.5) * bookDepth * 0.5;
        // Reset velocity
        particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
        particleVelocities[i3 + 1] = 0.02 + Math.random() * 0.05;
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
    
    // Update OrbitControls if enabled
    if (controls) {
      controls.update();
    }
    
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
    flipSinglePage,
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
    // New features
    setBookDimensions,
    setFrontCoverText,
    setBackCoverText,
    setCoverTransparency,
    setPageTransparency,
    setCoverColor,
    setPageColor,
  };
}
