/**
 * Individual Page Component
 * Pages positioned INSIDE the book between covers
 */
import * as THREE from 'three';
import { PageProps } from '../../types/book';

export function Page({ 
  index,
  totalPages,
  currentPage,
  opacity = 0.15, 
  color = '#00ffcc',
  glow = 0,
  coverWidth,
  coverHeight
}: PageProps) {
  // Page dimensions - slightly smaller than covers to fit inside
  const pageWidth = coverWidth * 0.93;
  const pageHeight = coverHeight * 0.95;
  
  // Spine parameters
  const spineWidth = 0.1;
  const spineDepth = 0.6;
  
  // Determine which cover this page is attached to
  const isAttachedToBack = index < currentPage;
  
  // Spread pages across the spine depth
  // Parent group is at inside face of cover (offset by coverThickness/2)
  // Pages spread from inside face (z=0) toward the center of the book
  
  const coverThickness = 0.05;
  // Available depth to spread pages (from inside face to center)
  const availableDepth = spineDepth / 2 - coverThickness / 2;
  
  let zOffset: number;
  
  if (isAttachedToBack && currentPage > 0) {
    // Back pages: spread from inside face (0) toward center (positive Z)
    // Back cover is at z=-0.3, inside face at -0.275, center at 0
    const progress = index / (currentPage - 1 || 1);
    zOffset = progress * availableDepth; // Positive spreads toward center (0)
  } else {
    // Front pages: spread from inside face (0) toward center (negative Z)
    // Front cover is at z=+0.3, inside face at +0.275, center at 0
    const progress = (index - currentPage) / (totalPages - currentPage - 1 || 1);
    zOffset = -progress * availableDepth; // Negative spreads toward center (0)
  }
  
  return (
    <group position={[0, 0, zOffset]}>
      {/* Page mesh positioned so it stays inside cover bounds */}
      <mesh position={[pageWidth / 2, 0, 0]}>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={glow}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
