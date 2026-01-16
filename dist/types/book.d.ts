/**
 * Type definitions for Babel Catalogue Book
 */
export interface BookDimensions {
    height: number;
    width: number;
    depth: number;
}
export interface BookConfig {
    pageCount: number;
    currentPage: number;
    dimensions: BookDimensions;
    spineRotation: number;
    tilt: number;
    scale: number;
    position: [number, number, number];
    frontHinge: number;
    backHinge: number;
    pageOpacity: number;
    pageColor: string;
    glowIntensity: number;
    coverColor: string;
    coverOpacity: number;
    spineColor: string;
    frontCoverText: string;
    backCoverText: string;
    coverTextColor: string;
    coverOutlineColor: string;
    coverOutlineWidth: number;
    fontFamily: string;
    particlesEnabled: boolean;
    particleIntensity: number;
    confidenceScore: number;
    debug: boolean;
    testPageFlipAngle: number;
    flippingPageIndex: number | null;
    flipProgress: number;
    flipDirection: 'forward' | 'backward' | null;
    isFlippingContinuously: boolean;
    continuousDirection: 'forward' | 'backward' | null;
}
export interface PageProps {
    index: number;
    totalPages: number;
    currentPage: number;
    opacity?: number;
    color?: string;
    glow?: number;
    coverWidth: number;
    coverHeight: number;
}
export interface CoverProps {
    side: 'front' | 'back';
    width: number;
    height: number;
    hinge: number;
    text?: string;
    textColor?: string;
    outlineColor?: string;
    outlineWidth?: number;
    color?: string;
    opacity?: number;
}
export interface SpineProps {
    width: number;
    height: number;
    depth: number;
    color?: string;
    pageCount: number;
}
export interface ParticleProps {
    count?: number;
    intensity: number;
    enabled: boolean;
    bookDimensions: BookDimensions;
}
//# sourceMappingURL=book.d.ts.map