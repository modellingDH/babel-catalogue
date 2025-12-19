/**
 * Zustand store for book state management
 */
import { create } from 'zustand';
import { BookConfig, BookDimensions } from '../types/book';

interface BookState extends BookConfig {
  // Actions
  setPageCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  flipPage: (direction: 'forward' | 'backward') => void;
  setDimensions: (dimensions: Partial<BookDimensions>) => void;
  setSpineRotation: (rotation: number) => void;
  setTilt: (tilt: number) => void;
  setScale: (scale: number) => void;
  setFrontHinge: (hinge: number) => void;
  setBackHinge: (hinge: number) => void;
  setBothHinges: (hinge: number) => void; // Symmetric open/close
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
    const { currentPage, pageCount } = get();
    if (direction === 'forward') {
      // Flip forward (increase current page)
      const newPage = (currentPage + 1) % pageCount;
      set({ currentPage: newPage });
    } else {
      // Flip backward (decrease current page)
      const newPage = ((currentPage - 1) + pageCount) % pageCount;
      set({ currentPage: newPage });
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
}));
