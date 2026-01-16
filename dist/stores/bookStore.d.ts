import { BookConfig, BookDimensions } from '../types/book';
interface BookState extends BookConfig {
    setPageCount: (count: number) => void;
    setCurrentPage: (page: number) => void;
    flipPage: (direction: 'forward' | 'backward') => void;
    toggleContinuousFlip: (direction: 'forward' | 'backward') => void;
    setDimensions: (dimensions: Partial<BookDimensions>) => void;
    setSpineRotation: (rotation: number) => void;
    setTilt: (tilt: number) => void;
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
    openBook: (duration?: number) => void;
    closeBook: (duration?: number) => void;
    flipPages: (count: number, direction: 'forward' | 'backward', duration?: number) => void;
    triggerEmotion: (emotion: 'focus' | 'drift' | 'paradox') => void;
    morphMaterial: (material: 'leather' | 'metal' | 'glass') => void;
}
export type BookStore = ReturnType<typeof createBookStore>;
export declare const createBookStore: (initProps?: Partial<BookConfig>) => import('zustand').UseBoundStore<import('zustand').StoreApi<BookState>>;
export {};
//# sourceMappingURL=bookStore.d.ts.map