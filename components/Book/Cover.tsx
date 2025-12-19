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
  color = '#2b1e16',
  opacity = 1
}: CoverProps) {
  const texture = useCoverTexture(text, textColor, side === 'front');
  
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
      {/* Cover extends from pivot (spine edge) outward */}
      <mesh 
        position={[width / 2, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, height, coverThickness]} />
        <meshStandardMaterial
          color={color}
          map={texture}
          transparent={opacity < 1 || texture !== null}
          opacity={opacity}
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>
    </group>
  );
}
