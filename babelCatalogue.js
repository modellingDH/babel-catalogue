import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { TWEEN } from 'https://cdn.skypack.dev/tween.js';

/**
 * Create a Babel Catalogue instance.
 *
 * This sets up the 3D book, particles, and audio engine, and returns a small
 * API that can be wired into any UI (sliders, buttons, LLM callbacks, etc).
 *
 * @param {Object} options
 * @param {HTMLElement} [options.container=document.body] - Where to attach the WebGL canvas.
 * @param {string} [options.initialTitle='Encyclopedia'] - Initial title text.
 * @param {number} [options.particleCount=1500] - Number of particles in the data stream.
 * @param {number} [options.initialParticleIntensity=150] - Initial particle intensity.
 * @returns {{
 *   updateTitle: (text: string) => void,
 *   morphMaterial: (mode: 'leather'|'metal'|'wood'|'glass') => void,
 *   triggerEmotion: (type: 'focus'|'drift'|'glitch') => void,
 *   toggleBook: () => void,
 *   setParticleIntensity: (value: number) => void,
 *   setParticleColor: (hex: string) => void,
 *   getState: () => { isOpen: boolean, isGlitching: boolean, particleIntensity: number },
 *   resize: () => void,
 *   dispose: () => void
 * }}
 */
export function createBabelCatalogue(options = {}) {
  const {
    container = document.body,
    initialTitle = 'Encyclopedia',
    particleCount = 1500,
    initialParticleIntensity = 150,
  } = options;

  // --- AUDIO ENGINE ---
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioCtx = AudioContextClass ? new AudioContextClass() : null;
  let streamOsc = null;
  let streamGain = null;

  let isOpen = false;
  let isGlitching = false;
  let particleIntensity = initialParticleIntensity;
  let currentTitle = initialTitle;

  const playTone = (freq, type, dur, vol) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  };

  const setupStreamHum = () => {
    if (!audioCtx) return;
    streamOsc = audioCtx.createOscillator();
    streamGain = audioCtx.createGain();
    streamOsc.type = 'sine';
    streamOsc.frequency.setValueAtTime(110, audioCtx.currentTime);
    streamGain.gain.setValueAtTime(0, audioCtx.currentTime);
    streamOsc.connect(streamGain);
    streamGain.connect(audioCtx.destination);
    streamOsc.start();
  };
  setupStreamHum();

  const updateStreamHum = () => {
    if (!streamGain || !audioCtx) return;
    const target = (particleIntensity / 1000) * (isOpen ? 0.1 : 0);
    streamGain.gain.setTargetAtTime(target, audioCtx.currentTime, 0.1);
  };

  // --- THREE.JS ENGINE ---
  const scene = new THREE.Scene();

  const getContainerSize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    return { w, h };
  };
  const { w: initialW, h: initialH } = getContainerSize();

  const camera = new THREE.PerspectiveCamera(40, initialW / initialH, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(initialW, initialH);
  renderer.setClearColor(0x050505);
  container.appendChild(renderer.domElement);

  const bookGroup = new THREE.Group();
  scene.add(bookGroup);

  // Title Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const titleTex = new THREE.CanvasTexture(canvas);

  const drawTitle = (text) => {
    ctx.clearRect(0, 0, 512, 512);
    ctx.textAlign = 'center';
    if (isGlitching) {
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#ff0055' : '#00ffcc';
        ctx.font = 'italic 36px serif';
        ctx.fillText(
          text.toUpperCase(),
          256 + (Math.random() - 0.5) * 50,
          160 + (Math.random() - 0.5) * 30
        );
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '32px serif';
      ctx.fillText(text.toUpperCase(), 256, 160);
    }
    titleTex.needsUpdate = true;
  };

  const updateTitle = (text) => {
    currentTitle = text;
    drawTitle(currentTitle);
  };
  updateTitle(initialTitle);

  // Book Objects
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x221a15,
    roughness: 0.7,
  });
  const pageMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    transmission: 0.9,
    emissive: 0x002222,
  });

  const frontCover = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.08), coverMat);
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.08), coverMat);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.95, 0.7), pageMat);

  const titlePlate = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true })
  );
  titlePlate.position.z = 0.05;
  frontCover.add(titlePlate);

  const frontPivot = new THREE.Group();
  frontPivot.position.set(-1.5, 0, 0.35);
  frontCover.position.set(1.5, 0, 0);
  frontPivot.add(frontCover);

  backCover.position.z = -0.35;
  bookGroup.add(frontPivot, backCover, pages);

  // Particles
  const partGeom = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 3;
  }
  partGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x00ffcc,
    size: 0.015,
    transparent: true,
    opacity: 0,
  });
  const particles = new THREE.Points(partGeom, partMat);
  scene.add(particles);

  scene.add(
    new THREE.AmbientLight(0xffffff, 0.3),
    new THREE.PointLight(0xffffff, 0.8).set(5, 5, 5)
  );
  camera.position.set(0, 1, 9);

  const toggleBook = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isOpen = !isOpen;
    new TWEEN.Tween(frontPivot.rotation)
      .to({ y: isOpen ? -Math.PI * 0.85 : 0 }, 1400)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    new TWEEN.Tween(partMat).to({ opacity: isOpen ? 0.8 : 0 }, 1000).start();
    playTone(isOpen ? 220 : 110, 'sine', 1.5, 0.1);
    updateStreamHum();
  };

  const morphMaterial = (m) => {
    const s = {
      leather: { color: 0x221a15, metalness: 0, roughness: 0.8, opacity: 1, freq: 150 },
      metal: { color: 0x666666, metalness: 1, roughness: 0.2, opacity: 1, freq: 880 },
      wood: { color: 0x1a0f00, metalness: 0, roughness: 0.6, opacity: 1, freq: 100 },
      glass: { color: 0xffffff, metalness: 0, roughness: 0, opacity: 0.3, freq: 1200 },
    };
    const target = s[m] || s.leather;
    new TWEEN.Tween(coverMat).to(target, 1000).start();
    coverMat.transparent = m === 'glass';
    playTone(target.freq, 'triangle', 0.5, 0.05);
  };

  const triggerEmotion = (type) => {
    if (type === 'focus') {
      new TWEEN.Tween(bookGroup.position)
        .to({ y: 1.2, x: 0, z: 2 }, 1000)
        .easing(TWEEN.Easing.Back.Out)
        .start();
      playTone(440, 'sine', 0.8, 0.05);
    } else if (type === 'glitch') {
      isGlitching = true;
      playTone(60, 'sawtooth', 0.5, 0.1);
      new TWEEN.Tween(bookGroup.position)
        .to({ x: '+0.1' }, 40)
        .repeat(25)
        .yoyo(true)
        .onComplete(() => {
          isGlitching = false;
          drawTitle(currentTitle);
        })
        .start();
    } else {
      new TWEEN.Tween(bookGroup.position)
        .to({ y: -1, x: 3, z: -2 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      playTone(80, 'sine', 2, 0.05);
    }
  };

  const setParticleIntensity = (value) => {
    particleIntensity = value;
    updateStreamHum();
  };

  const setParticleColor = (hex) => {
    partMat.color.set(hex);
  };

  let animationId = null;
  const animate = (time) => {
    animationId = requestAnimationFrame(animate);
    TWEEN.update(time);
    if (isGlitching) {
      drawTitle(currentTitle);
    }
    if (isOpen || isGlitching) {
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        if (isGlitching) {
          pos[i * 3] += (Math.random() - 0.5) * 0.2;
          pos[i * 3 + 1] += (Math.random() - 0.5) * 0.2;
        } else {
          pos[i * 3 + 1] += Math.random() * 0.01 * (particleIntensity / 100);
        }
        if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
  };
  animate();

  const resize = () => {
    const { w, h } = getContainerSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const dispose = () => {
    if (animationId) cancelAnimationFrame(animationId);
    renderer.dispose();
    partGeom.dispose();
    coverMat.dispose();
    pageMat.dispose();
    titleTex.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    if (streamOsc) {
      streamOsc.stop();
      streamOsc.disconnect();
    }
    if (streamGain) {
      streamGain.disconnect();
    }
    if (audioCtx) {
      audioCtx.close();
    }
  };

  window.addEventListener('resize', resize);

  const getState = () => ({
    isOpen,
    isGlitching,
    particleIntensity,
  });

  return {
    updateTitle,
    morphMaterial,
    triggerEmotion,
    toggleBook,
    setParticleIntensity,
    setParticleColor,
    getState,
    resize,
    dispose,
  };
}


