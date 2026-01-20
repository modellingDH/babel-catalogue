/**
 * Zustand store for book state management
 */
import { create } from 'zustand';
import { BookConfig, BookDimensions } from '../types/book';

// Animation helper - simple easing for smooth transitions
const animateValue = (
  from: number,
  to: number,
  duration: number,
  setter: (value: number) => void,
  easing: (t: number) => number = (t) => t // Linear by default
) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const value = from + (to - from) * easedProgress;

    setter(value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Easing functions
const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutElastic = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

interface BookState extends BookConfig {
  // Direct state setters
  setPageCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  flipPage: (direction: 'forward' | 'backward') => void;
  toggleContinuousFlip: (direction: 'forward' | 'backward') => void;
  setDimensions: (dimensions: Partial<BookDimensions>) => void;
  setSpineRotation: (rotation: number) => void;
  setTilt: (tilt: number) => void;
  setLean: (lean: number) => void;
  setScale: (scale: number) => void;
  setPosition: (position: [number, number, number]) => void;
  setFrontHinge: (hinge: number) => void;
  setBackHinge: (hinge: number) => void;
  setBothHinges: (hinge: number) => void;
  setPageOpacity: (opacity: number) => void;
  setPageColor: (color: string) => void;
  setGlowIntensity: (intensity: number) => void;
  setCoverColor: (color: string) => void;
  setCoverOpacity: (opacity: number) => void;
  setFrontCoverText: (text: string) => void;
  setBackCoverText: (text: string) => void;
  setCoverTextColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setParticlesEnabled: (enabled: boolean) => void;
  setParticleIntensity: (intensity: number) => void;
  setConfidenceScore: (score: number) => void;
  setDebug: (debug: boolean) => void;
  setTestPageFlipAngle: (angle: number) => void;
  reset: () => void;

  // Animated actions
  openBook: (duration?: number) => void;
  closeBook: (duration?: number) => void;
  flipPages: (count: number, direction: 'forward' | 'backward', duration?: number) => void;
  triggerEmotion: (emotion: 'focus' | 'drift' | 'paradox') => void;
  morphMaterial: (material: 'leather' | 'metal' | 'glass') => void;
  putDownBook: (duration?: number) => void;
  restoreBook: (duration?: number) => void;
  animateTo: (target: Partial<BookState>, duration?: number) => void;
  savedState?: Partial<BookConfig> | null;
}

const initialState: BookConfig = {
  // Core settings
  pageCount: 30, // More pages for better visual
  currentPage: 15, // Open in the middle
  dimensions: {
    height: 4,
    width: 3,
    depth: 0.6, // Will be calculated from pageCount
  },

  // Transformations (Reading Position: Y=0°, Z=0°, X=0°)
  spineRotation: 0,
  tilt: 0,
  lean: 0,
  scale: 1,
  position: [0, 0, 0] as [number, number, number],

  // Cover hinges
  frontHinge: 0,
  backHinge: 0,

  // Appearance
  pageOpacity: 0.15,
  pageColor: '#00ffcc',
  glowIntensity: 0,
  coverColor: '#2b1e16',
  coverOpacity: 1,
  spineColor: '#1a0f0a',

  // Cover text
  frontCoverText: '',
  backCoverText: '',
  coverTextColor: '#c9a876',
  coverOutlineColor: '#c9a876',
  coverOutlineWidth: 3,
  fontFamily: 'Roboto',

  // Features
  particlesEnabled: true,
  particleIntensity: 0.5,
  confidenceScore: 0,

  // Debug
  debug: false,
  testPageFlipAngle: 0, // 0 = back cover, 180 = front cover

  // Page flip animation
  flippingPageIndex: null,
  flipProgress: 0,
  flipDirection: null,
  isFlippingContinuously: false,
  continuousDirection: null,
  savedState: null,
};

// ... types remain the same, just exporting the creator function now
export type BookStore = ReturnType<typeof createBookStore>;

export const createBookStore = (initProps?: Partial<BookConfig>) => {
  const DEFAULT_PROPS: BookConfig = { ...initialState, ...initProps };

  return create<BookState>((set, get) => ({
    ...DEFAULT_PROPS,

    // Actions
    setPageCount: (count) => {
      const validCount = Math.max(10, Math.min(100, count)); // 10-100 pages (density)
      const currentPage = Math.floor(validCount / 2); // Keep in middle

      // Spine depth is FIXED (0.6) - pages are density within that space
      // More pages = denser packing, not thicker spine
      const spineDepth = 0.6;

      set({
        pageCount: validCount,
        currentPage: currentPage,
        dimensions: {
          ...get().dimensions,
          depth: spineDepth
        }
      });
    },

    setCurrentPage: (page) => {
      const { pageCount } = get();
      // Keep within bounds, but allow wrapping
      const validPage = ((page % pageCount) + pageCount) % pageCount;
      set({ currentPage: validPage });
    },

    flipPage: (direction) => {
      const state = get();
      const { currentPage, pageCount, flippingPageIndex, isFlippingContinuously } = state;

      // Don't start new flip if one is in progress
      if (flippingPageIndex !== null) {
        console.log('⚠️ Flip already in progress');
        return;
      }

      if (direction === 'forward') {
        // Flip forward (increase current page)
        const newPage = Math.min(currentPage + 1, pageCount - 1);
        if (newPage === currentPage) {
          console.log('⚠️ Already at last page');
          return;
        }

        console.log('📄 Start flip forward:', currentPage, '→', newPage);

        // Start animation - DON'T update currentPage yet
        set({ flippingPageIndex: currentPage, flipProgress: 0, flipDirection: 'forward' });

        // Animate flip progress
        const duration = 500; // ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          set({ flipProgress: progress });
          console.log(`  Progress: ${(progress * 100).toFixed(1)}%`);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Animation complete - reset without updating currentPage
            set({ flippingPageIndex: null, flipProgress: 0, flipDirection: null });
            console.log('✅ Flip animation complete (currentPage unchanged)');

            // If continuous flip is on, start next flip
            if (get().isFlippingContinuously && get().continuousDirection === 'forward') {
              setTimeout(() => {
                if (get().isFlippingContinuously && get().continuousDirection === 'forward') {
                  get().flipPage('forward');
                }
              }, 100);
            }
          }
        };

        requestAnimationFrame(animate);

      } else {
        // Flip backward (decrease current page)
        const newPage = Math.max(currentPage - 1, 0);
        if (newPage === currentPage) {
          console.log('⚠️ Already at first page');
          return;
        }

        console.log('📄 Start flip BACKWARD:', currentPage, '→', newPage);
        console.log('   Flipping page', currentPage, 'from FRONT to BACK');

        // For backward, flip the first page from the FRONT stack
        // This is the page at index currentPage
        set({ flippingPageIndex: currentPage, flipProgress: 0, flipDirection: 'backward' });

        // Animate flip progress (in reverse - front to back)
        const duration = 500; // ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          set({ flipProgress: progress });
          console.log(`  Progress: ${(progress * 100).toFixed(1)}% (BACKWARD)`);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Animation complete - reset without updating currentPage
            set({ flippingPageIndex: null, flipProgress: 0, flipDirection: null });
            console.log('✅ Flip animation complete (currentPage unchanged)');

            // If continuous flip is on, start next flip
            if (get().isFlippingContinuously && get().continuousDirection === 'backward') {
              setTimeout(() => {
                if (get().isFlippingContinuously && get().continuousDirection === 'backward') {
                  get().flipPage('backward');
                }
              }, 100);
            }
          }
        };

        requestAnimationFrame(animate);
      }
    },

    toggleContinuousFlip: (direction) => {
      const state = get();
      const { isFlippingContinuously, continuousDirection } = state;

      if (isFlippingContinuously && continuousDirection === direction) {
        // Toggle off
        console.log('⏸️ Stop continuous flip');
        set({ isFlippingContinuously: false, continuousDirection: null });
      } else {
        // Toggle on (and turn off opposite direction)
        console.log('▶️ Start continuous flip', direction);
        set({ isFlippingContinuously: true, continuousDirection: direction });

        // Start the first flip
        get().flipPage(direction);
      }
    },

    setDimensions: (dims) => {
      const current = get().dimensions;
      const newDimensions = { ...current, ...dims };

      // If depth is manually changed, update page count to match
      if (dims.depth !== undefined && dims.depth !== current.depth) {
        const estimatedPageCount = Math.round(dims.depth / 0.002);
        const validCount = Math.max(10, Math.min(100, estimatedPageCount));
        set({
          dimensions: newDimensions,
          pageCount: validCount,
          currentPage: Math.floor(validCount / 2)
        });
      } else {
        set({ dimensions: newDimensions });
      }
    },

    setSpineRotation: (rotation) => set({ spineRotation: rotation }),
    setTilt: (tilt) => set({ tilt: tilt }),
    setLean: (lean) => set({ lean: lean }),
    setScale: (scale) => set({ scale: scale }),
    setPosition: (position) => set({ position: position }),
    setFrontHinge: (hinge) => set({ frontHinge: hinge }),
    setBackHinge: (hinge) => set({ backHinge: hinge }),
    setBothHinges: (hinge) => set({ frontHinge: hinge, backHinge: hinge }),
    setPageOpacity: (opacity) => set({ pageOpacity: opacity }),
    setPageColor: (color) => set({ pageColor: color }),
    setGlowIntensity: (intensity) => set({ glowIntensity: intensity }),
    setCoverColor: (color) => set({ coverColor: color }),
    setCoverOpacity: (opacity) => set({ coverOpacity: opacity }),
    setSpineColor: (color) => set({ spineColor: color }),
    setFrontCoverText: (text) => set({ frontCoverText: text }),
    setBackCoverText: (text) => set({ backCoverText: text }),
    setCoverTextColor: (color) => set({ coverTextColor: color }),
    setCoverOutlineColor: (color) => set({ coverOutlineColor: color }),
    setCoverOutlineWidth: (width) => set({ coverOutlineWidth: width }),
    setFontFamily: (font) => set({ fontFamily: font }),
    setParticlesEnabled: (enabled) => set({ particlesEnabled: enabled }),
    setParticleIntensity: (intensity) => set({ particleIntensity: intensity }),
    setConfidenceScore: (score) => set({ confidenceScore: score }),
    setDebug: (debug) => set({ debug: debug }),
    setTestPageFlipAngle: (angle) => {
      set({ testPageFlipAngle: angle });
      console.log('📄 Test page flip angle:', angle.toFixed(1), '°');
    },
    reset: () => set(initialState),

    // ========== ANIMATED ACTIONS ==========

    /**
     * Open book - smoothly animate both covers to open position
     */
    openBook: (duration = 1000) => {
      const current = get();
      const targetAngle = Math.PI * 0.4; // ~72 degrees (realistic book open angle)

      animateValue(
        current.frontHinge,
        targetAngle,
        duration,
        (value) => set({ frontHinge: value }),
        easeInOutCubic
      );

      animateValue(
        current.backHinge,
        targetAngle,
        duration,
        (value) => set({ backHinge: value }),
        easeInOutCubic
      );

      // Increase particle intensity when opening
      animateValue(
        current.particleIntensity,
        0.7,
        duration,
        (value) => set({ particleIntensity: value }),
        easeInOutCubic
      );
    },

    /**
     * Close book - smoothly animate both covers to closed position
     */
    closeBook: (duration = 1000) => {
      const current = get();

      animateValue(
        current.frontHinge,
        0,
        duration,
        (value) => set({ frontHinge: value }),
        easeInOutCubic
      );

      animateValue(
        current.backHinge,
        0,
        duration,
        (value) => set({ backHinge: value }),
        easeInOutCubic
      );

      // Decrease particle intensity when closing
      animateValue(
        current.particleIntensity,
        0,
        duration,
        (value) => set({ particleIntensity: value }),
        easeInOutCubic
      );

      // Reset glow
      animateValue(
        current.glowIntensity,
        0,
        duration,
        (value) => set({ glowIntensity: value }),
        easeInOutCubic
      );
    },

    /**
     * Flip multiple pages with animation (visual flip for each)
     */
    flipPages: (count, direction, duration = 200) => {
      const state = get();
      const { flippingPageIndex } = state;

      // Don't start if already flipping
      if (flippingPageIndex !== null) {
        console.log('⚠️ Flip already in progress');
        return;
      }

      let flipped = 0;

      const flipNext = () => {
        if (flipped >= count) {
          console.log('✅ Finished flipping', count, 'pages', direction);
          return;
        }

        // Get fresh state
        const state = get();
        const { currentPage, pageCount } = state;

        let newPage: number;

        if (direction === 'forward') {
          newPage = Math.min(currentPage + 1, pageCount - 1);
        } else {
          newPage = Math.max(currentPage - 1, 0);
        }

        if (newPage === currentPage) {
          console.log('⚠️ Reached boundary at page', currentPage);
          return;
        }

        console.log(`📄 Flip ${flipped + 1}/${count}: page ${currentPage} → ${newPage}`);

        // Start visual flip animation for this page
        const pageToFlip = direction === 'forward' ? currentPage : currentPage;
        set({ flippingPageIndex: pageToFlip, flipProgress: 0 });

        // Animate this page flip
        const flipDuration = 500; // Each page flips in 500ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / flipDuration, 1);

          set({ flipProgress: progress });

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // This page flip complete - reset without updating currentPage
            set({ flippingPageIndex: null, flipProgress: 0, flipDirection: null });
            flipped++;

            // Start next flip after a brief pause
            if (flipped < count) {
              setTimeout(flipNext, 50); // 50ms pause between flips
            } else {
              console.log('✅ All', count, 'page animations complete (currentPage unchanged)');
            }
          }
        };

        requestAnimationFrame(animate);
      };

      console.log('▶️ Starting', count, 'page flips', direction, 'from page', get().currentPage);
      flipNext();
    },

    /**
     * Trigger emotional states (from README concept)
     */
    triggerEmotion: (emotion) => {
      const current = get();

      switch (emotion) {
        case 'focus':
          // Bright pulsing of pages (high confidence, active thinking)
          // Slow, bright pulses (same frequency as drift)
          let pulseCycles = 0;
          const maxPulses = 5;
          const pulseDuration = 1200; // Same slow duration as drift

          const pulse = () => {
            if (pulseCycles >= maxPulses) {
              // End with bright glow
              animateValue(get().glowIntensity, 1.2, pulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);
              return;
            }

            // Up to bright
            animateValue(get().glowIntensity, 1.8, pulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);

            setTimeout(() => {
              // Down
              animateValue(get().glowIntensity, 0.8, pulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);
              pulseCycles++;
              setTimeout(pulse, pulseDuration / 2);
            }, pulseDuration / 2);
          };

          pulse();

          // Increase particle flow
          animateValue(current.particleIntensity, 1.0, 800, (v) => set({ particleIntensity: v }), easeInOutCubic);
          break;

        case 'drift':
          // Dimming pulsing of pages (daydreaming, low activity)
          // Slow, dim pulses (same frequency as focus)
          let dimPulseCycles = 0;
          const maxDimPulses = 5;
          const dimPulseDuration = 1200; // Same slow duration as focus

          const dimPulse = () => {
            if (dimPulseCycles >= maxDimPulses) {
              // End very dim
              animateValue(get().glowIntensity, 0.1, dimPulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);
              return;
            }

            // Slightly up
            animateValue(get().glowIntensity, 0.4, dimPulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);

            setTimeout(() => {
              // Down to dim
              animateValue(get().glowIntensity, 0.1, dimPulseDuration / 2, (v) => set({ glowIntensity: v }), easeInOutCubic);
              dimPulseCycles++;
              setTimeout(dimPulse, dimPulseDuration / 2);
            }, dimPulseDuration / 2);
          };

          dimPulse();

          // Decrease particles
          animateValue(current.particleIntensity, 0.1, 1200, (v) => set({ particleIntensity: v }), easeInOutCubic);
          break;

        case 'paradox':
          // Violent tremor effect - rapid position shake
          const originalRotation = current.spineRotation;
          const originalTilt = current.tilt;
          const shakeIntensity = 0.15;
          const shakeCount = 10;
          const shakeDuration = 50;

          let shakes = 0;
          const shake = () => {
            if (shakes >= shakeCount) {
              // Return to original position
              set({ spineRotation: originalRotation, tilt: originalTilt });
              return;
            }

            const randomRotation = originalRotation + (Math.random() - 0.5) * shakeIntensity;
            const randomTilt = originalTilt + (Math.random() - 0.5) * shakeIntensity;
            set({ spineRotation: randomRotation, tilt: randomTilt });

            shakes++;
            setTimeout(shake, shakeDuration);
          };

          shake();

          // Flash glow
          animateValue(current.glowIntensity, 2.0, 200, (v) => set({ glowIntensity: v }));
          setTimeout(() => {
            animateValue(2.0, 0.3, 300, (v) => set({ glowIntensity: v }));
          }, 200);
          break;
      }
    },

    /**
     * Morph cover material appearance (from README concept)
     */
    morphMaterial: (material) => {
      const current = get();

      switch (material) {
        case 'leather':
          // Dark, matte, organic - humanities/lore
          set({ coverColor: '#2b1e16', coverOpacity: 1.0 });
          animateValue(current.glowIntensity, 0.1, 500, (v) => set({ glowIntensity: v }), easeInOutCubic);
          break;

        case 'metal':
          // Reflective, cold, hard - scientific/logical
          set({ coverColor: '#556b7d', coverOpacity: 1.0 });
          animateValue(current.glowIntensity, 0.8, 500, (v) => set({ glowIntensity: v }), easeInOutCubic);
          animateValue(current.particleIntensity, 0.9, 500, (v) => set({ particleIntensity: v }), easeInOutCubic);
          break;

        case 'glass':
          // Transparent, vulnerable - ultimate truth
          set({ coverColor: '#d0e8f2', coverOpacity: 0.3 });
          animateValue(current.glowIntensity, 1.8, 500, (v) => set({ glowIntensity: v }), easeInOutCubic);
          animateValue(current.particleIntensity, 1.0, 500, (v) => set({ particleIntensity: v }), easeInOutCubic);
          break;
      }
    },

    /**
     * Put down book - close, lay flat, and center
     */
    putDownBook: (duration = 1500) => {
      const current = get();
      const width = current.dimensions.width;

      // 1. Close the book
      get().closeBook(duration * 0.7);

      // Save current state for restoration
      set({
        savedState: {
          spineRotation: current.spineRotation,
          tilt: current.tilt,
          lean: current.lean,
          position: current.position,
          frontHinge: current.frontHinge,
          backHinge: current.backHinge,
        }
      });

      // 2. Animate to flat position (lying on back cover)
      // Rotate -90 on X (lean) to lie flat
      // Shift X by -width/2 to center it (since pivot is at spine)

      const targetLean = -Math.PI / 2;
      const targetX = -width / 2;
      // Calculate target Y to rest on grid (which is at -height/2)
      // Book when flat has height = depth. It is centered at Y=targetY
      // Bottom face is at targetY - depth/2. We want bottom face at -height/2
      // targetY - depth/2 = -height/2  =>  targetY = -height/2 + depth/2
      const targetY = -current.dimensions.height / 2 + current.dimensions.depth / 2;
      const targetTilt = 0;
      const targetRotation = 0;

      // Animate Position (X and Y)
      animateValue(
        0, // Progress 0 to 1
        1,
        duration,
        (progress) => {
          // We interpolate manually to handle both X and Y
          // X: startX -> targetX
          // Y: startY -> targetY
          const startX = current.position[0];
          const startY = current.position[1];

          // Easing is applied by the animateValue wrapper to 'progress'?
          // Wait, animateValue interpolates a single value.
          // Better to use two animateValues or one acting on a progress proxy.
          // Let's us separate animateValues for simplicity and consistency with existing code.
        },
        easeInOutCubic
      );

      // Revised implementation using separate animators for clarity
      // Animate Position X
      animateValue(
        current.position[0],
        targetX,
        duration,
        (val) => {
          const currentPos = get().position;
          set({ position: [val, currentPos[1], currentPos[2]] });
        },
        easeInOutCubic
      );

      // Animate Position Y to drop down
      animateValue(
        current.position[1],
        targetY,
        duration,
        (val) => {
          const currentPos = get().position;
          set({ position: [currentPos[0], val, currentPos[2]] });
        },
        easeInOutCubic
      );

      animateValue(
        current.lean || 0,
        targetLean,
        duration,
        (value) => set({ lean: value }),
        easeInOutCubic
      );

      animateValue(
        current.tilt,
        targetTilt,
        duration,
        (value) => set({ tilt: value }),
        easeInOutCubic
      );

      animateValue(
        current.spineRotation,
        targetRotation,
        duration,
        (value) => set({ spineRotation: value }),
        easeInOutCubic
      );
    },

    /**
     * Restore book - return to reading position and open
     */
    restoreBook: (duration = 1500) => {
      const current = get();

      // 1. Animate back to saved position or default reading position
      const saved = current.savedState;

      const targetTilt = saved?.tilt ?? 0;
      const targetRotation = saved?.spineRotation ?? 0;
      const targetLean = saved?.lean ?? 0;
      const targetX = saved?.position?.[0] ?? 0;
      const targetY = saved?.position?.[1] ?? 0;

      // Restore Position X
      animateValue(
        current.position[0],
        targetX,
        duration,
        (val) => {
          const currentPos = get().position;
          set({ position: [val, currentPos[1], currentPos[2]] });
        },
        easeInOutCubic
      );

      // Restore Position Y
      animateValue(
        current.position[1],
        targetY,
        duration,
        (val) => {
          const currentPos = get().position;
          set({ position: [currentPos[0], val, currentPos[2]] });
        },
        easeInOutCubic
      );

      animateValue(
        current.lean || 0,
        targetLean,
        duration,
        (value) => set({ lean: value }),
        easeInOutCubic
      );

      animateValue(
        current.tilt,
        targetTilt,
        duration,
        (value) => set({ tilt: value }),
        easeInOutCubic
      );

      animateValue(
        current.spineRotation,
        targetRotation,
        duration,
        (value) => set({ spineRotation: value }),
        easeInOutCubic
      );

      // 2. Restore Hinges (Open/Closed state)
      // If we have a saved state, animate back to it.
      // If no saved state, we default to OPEN (Math.PI * 0.4) as per original behavior.

      const defaultOpenAngle = Math.PI * 0.4;
      const targetFrontHinge = saved?.frontHinge ?? defaultOpenAngle;
      const targetBackHinge = saved?.backHinge ?? defaultOpenAngle;

      setTimeout(() => {
        animateValue(
          get().frontHinge,
          targetFrontHinge,
          duration * 0.7,
          (value) => set({ frontHinge: value }),
          easeInOutCubic
        );

        animateValue(
          get().backHinge,
          targetBackHinge,
          duration * 0.7,
          (value) => set({ backHinge: value }),
          easeInOutCubic
        );
      }, duration * 0.3);
    },

    /**
     * Generic animation function
     * Animates any subset of numeric state properties
     */
    animateTo: (targetState: Partial<BookState>, duration = 1000) => {
      const current = get();

      Object.keys(targetState).forEach((key) => {
        const targetValue = targetState[key as keyof BookState];
        const currentValue = current[key as keyof BookState];

        // Only animate if both are numbers
        if (typeof targetValue === 'number' && typeof currentValue === 'number') {
          // Find the setter for this key if it exists, or just use generic setState
          // Since we don't have a map of key -> setter, we just set the state directly
          animateValue(
            currentValue,
            targetValue,
            duration,
            (value) => set({ [key]: value } as Partial<BookState>),
            easeInOutCubic
          );
        }
      });
    },
  }));
};
