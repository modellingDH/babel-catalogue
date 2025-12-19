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
  setDimensions: (dimensions: Partial<BookDimensions>) => void;
  setSpineRotation: (rotation: number) => void;
  setTilt: (tilt: number) => void;
  setScale: (scale: number) => void;
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
  setParticlesEnabled: (enabled: boolean) => void;
  setParticleIntensity: (intensity: number) => void;
  setConfidenceScore: (score: number) => void;
  setDebug: (debug: boolean) => void;
  reset: () => void;
  
  // Animated actions
  openBook: (duration?: number) => void;
  closeBook: (duration?: number) => void;
  flipPages: (count: number, direction: 'forward' | 'backward', duration?: number) => void;
  triggerEmotion: (emotion: 'focus' | 'drift' | 'paradox') => void;
  morphMaterial: (material: 'leather' | 'metal' | 'glass') => void;
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
  
  // Transformations
  spineRotation: 0.5,
  tilt: 0.2,
  scale: 1,
  
  // Cover hinges
  frontHinge: 0,
  backHinge: 0,
  
  // Appearance
  pageOpacity: 0.15,
  pageColor: '#00ffcc',
  glowIntensity: 0,
  coverColor: '#2b1e16',
  coverOpacity: 1,
  
  // Cover text
  frontCoverText: '',
  backCoverText: '',
  coverTextColor: '#c9a876', // Gold/beige default
  coverTextColor: '#c9a876', // Gold/beige default
  
  // Features
  particlesEnabled: true,
  particleIntensity: 0.5,
  confidenceScore: 0,
  
  // Debug
  debug: false,
};

export const useBookStore = create<BookState>((set, get) => ({
  ...initialState,
  
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
    const { currentPage, pageCount } = state;
    
    if (direction === 'forward') {
      // Flip forward (increase current page)
      const newPage = Math.min(currentPage + 1, pageCount - 1);
      set({ currentPage: newPage });
      console.log('Flip forward:', currentPage, '→', newPage);
    } else {
      // Flip backward (decrease current page)
      const newPage = Math.max(currentPage - 1, 0);
      set({ currentPage: newPage });
      console.log('Flip backward:', currentPage, '→', newPage);
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
  setScale: (scale) => set({ scale: scale }),
  setFrontHinge: (hinge) => set({ frontHinge: hinge }),
  setBackHinge: (hinge) => set({ backHinge: hinge }),
  setBothHinges: (hinge) => set({ frontHinge: hinge, backHinge: hinge }),
  setPageOpacity: (opacity) => set({ pageOpacity: opacity }),
  setPageColor: (color) => set({ pageColor: color }),
  setGlowIntensity: (intensity) => set({ glowIntensity: intensity }),
  setCoverColor: (color) => set({ coverColor: color }),
  setCoverOpacity: (opacity) => set({ coverOpacity: opacity }),
  setFrontCoverText: (text) => set({ frontCoverText: text }),
  setBackCoverText: (text) => set({ backCoverText: text }),
  setCoverTextColor: (color) => set({ coverTextColor: color }),
  setParticlesEnabled: (enabled) => set({ particlesEnabled: enabled }),
  setParticleIntensity: (intensity) => set({ particleIntensity: intensity }),
  setConfidenceScore: (score) => set({ confidenceScore: score }),
  setDebug: (debug) => set({ debug: debug }),
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
   * Flip multiple pages with animation
   */
  flipPages: (count, direction, duration = 50) => {
    let flipped = 0;
    
    const flipNext = () => {
      if (flipped >= count) {
        console.log('Finished flipping', count, 'pages', direction);
        return;
      }
      
      // Get fresh state each time
      const state = get();
      const { currentPage, pageCount } = state;
      
      let newPage: number;
      
      if (direction === 'forward') {
        newPage = Math.min(currentPage + 1, pageCount - 1);
      } else {
        newPage = Math.max(currentPage - 1, 0);
      }
      
      console.log(`Flip ${flipped + 1}/${count}:`, currentPage, '→', newPage);
      
      // Only update if page actually changed
      if (newPage !== currentPage) {
        set({ currentPage: newPage });
        flipped++;
        
        if (flipped < count) {
          setTimeout(flipNext, duration);
        }
      } else {
        // Can't flip further (at boundary)
        console.log('Reached boundary at page', currentPage);
      }
    };
    
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
}));
