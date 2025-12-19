/**
 * Cover Component
 * Hinged book cover that opens/closes from spine edge
 */
import * as THREE from 'three';
import { CoverProps } from '../../types/book';
import { useCoverTexture } from '../../hooks/useCoverTexture';

export function Cover({ 
  side, 
  width, 
  height,
  hinge, 
  text,
  textColor = '#c9a876',
  outlineColor = '#c9a876',
  outlineWidth = 3,
  color = '#2b1e16',
  opacity = 1
}: CoverProps) {
  const texture = useCoverTexture(text, textColor, outlineColor, outlineWidth, side === 'front');
  
  // Cover pivots at spine edge
  // Spine is centered at origin with width 0.1
  // Spine goes from -0.05 to +0.05 in X
  // Front cover pivots at RIGHT edge of spine (x = 0.05)
  // Position in Z based on spine depth (0.6 total, so ±0.3)
  const spineWidth = 0.1;
  const spineDepth = 0.6;
  const coverThickness = 0.05;
  
  const pivotX = spineWidth / 2; // 0.05
  const pivotZ = side === 'front' ? spineDepth / 2 : -spineDepth / 2; // ±0.3
  
  // Rotation direction: front cover uses negative (opens forward), back uses positive
  const hingeRotation = side === 'front' ? -hinge : hinge;
  
  return (
    <group 
      position={[pivotX, 0, pivotZ]} 
      rotation={[0, hingeRotation, 0]}
    >
      {/* Cover box - plain color, no texture */}
      <mesh 
        position={[width / 2, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, height, coverThickness]} />
        <meshStandardMaterial
          color={color}
          transparent={opacity < 1}
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Text plane hovering in front of external side */}
      {texture && (
        <mesh 
          position={[width, 0, 0]} // At the far end (external side)
          rotation={[0, 0, 0]} // Facing outward
        >
          <planeGeometry args={[width * 0.9, height * 0.9]} /> {/* Slightly smaller */}
          <meshStandardMaterial
            color="#ffffff" // White base to show texture colors correctly
            map={texture}
            transparent={true}
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

