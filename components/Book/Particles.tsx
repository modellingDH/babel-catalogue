/**
 * Particle System Component
 * Animated particles flowing around the book
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleProps } from '../../types/book';

export function Particles({ 
  count = 200, 
  intensity, 
  enabled,
  bookDimensions 
}: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create particle geometry and velocities
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    const { height, width, depth } = bookDimensions;
    
    // Initialize particles with Poisson disk sampling for even distribution
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles around book
      positions[i3] = (Math.random() - 0.5) * width * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * height * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * depth * 2;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count, bookDimensions]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current || !enabled) return;
    
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions
      positionAttr.array[i3] += velocities[i3];
      positionAttr.array[i3 + 1] += velocities[i3 + 1];
      positionAttr.array[i3 + 2] += velocities[i3 + 2];
      
      // Wrap around bounds
      const bounds = {
        x: bookDimensions.width * 2,
        y: bookDimensions.height * 2,
        z: bookDimensions.depth * 2
      };
      
      if (Math.abs(positionAttr.array[i3]) > bounds.x) {
        positionAttr.array[i3] = -Math.sign(positionAttr.array[i3]) * bounds.x;
      }
      if (Math.abs(positionAttr.array[i3 + 1]) > bounds.y) {
        positionAttr.array[i3 + 1] = -Math.sign(positionAttr.array[i3 + 1]) * bounds.y;
      }
      if (Math.abs(positionAttr.array[i3 + 2]) > bounds.z) {
        positionAttr.array[i3 + 2] = -Math.sign(positionAttr.array[i3 + 2]) * bounds.z;
      }
    }
    
    positionAttr.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  const effectiveIntensity = Math.max(0.05, intensity);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05 * effectiveIntensity}
        color="#00ffcc"
        transparent
        opacity={effectiveIntensity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

