/**
 * Type definitions for Babel Catalogue Book
 */

export interface BookDimensions {
  height: number;
  width: number;
  depth: number;
}

export interface BookConfig {
  // Core settings
  pageCount: number;
  currentPage: number; // Which page the book is open to (for infinite pages)
  dimensions: BookDimensions;
  
  // Transformations
  spineRotation: number;
  tilt: number;
  scale: number;
  
  // Cover hinges
  frontHinge: number;
  backHinge: number;
  
  // Appearance
  pageOpacity: number;
  pageColor: string;
  glowIntensity: number;
  coverColor: string;
  coverOpacity: number;
  
  // Cover text
  frontCoverText: string;
  backCoverText: string;
  coverTextColor: string;
  
  // Features
  particlesEnabled: boolean;
  particleIntensity: number;
  confidenceScore: number;
  
  // Debug
  debug: boolean;
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
  color?: string;
  opacity?: number;
}

export interface SpineProps {
  width: number;
  height: number;
  depth: number;
  color?: string;
  pageCount: number; // Used to calculate thickness
}

export interface ParticleProps {
  count?: number;
  intensity: number;
  enabled: boolean;
  bookDimensions: BookDimensions;
}
