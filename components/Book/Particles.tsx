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
    
    // Initialize particles emanating from page area toward the front
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Start particles from page area (near spine, within book depth)
      positions[i3] = (Math.random() - 0.5) * width * 0.5; // Near center (spine area)
      positions[i3 + 1] = (Math.random() - 0.5) * height; // Full height
      positions[i3 + 2] = (Math.random() - 0.5) * depth; // Within spine depth
      
      // Velocities: flow forward (positive X), slightly upward and outward
      velocities[i3] = 0.01 + Math.random() * 0.02; // Forward (toward front of book)
      velocities[i3 + 1] = Math.random() * 0.01; // Slightly upward
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005; // Slight Z spread
    }
    
    return { positions, velocities };
  }, [count, bookDimensions]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current || !enabled) return;
    
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    const { height, width, depth } = bookDimensions;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions - particles flow forward
      positionAttr.array[i3] += velocities[i3] * intensity; // Speed affected by intensity
      positionAttr.array[i3 + 1] += velocities[i3 + 1] * intensity;
      positionAttr.array[i3 + 2] += velocities[i3 + 2] * intensity;
      
      // Respawn at page source when particle moves too far forward
      if (positionAttr.array[i3] > width * 2) {
        // Respawn at page area
        positionAttr.array[i3] = (Math.random() - 0.5) * width * 0.5; // Near spine
        positionAttr.array[i3 + 1] = (Math.random() - 0.5) * height;
        positionAttr.array[i3 + 2] = (Math.random() - 0.5) * depth;
      }
      
      // Wrap Y and Z
      if (Math.abs(positionAttr.array[i3 + 1]) > height * 1.5) {
        positionAttr.array[i3 + 1] = (Math.random() - 0.5) * height;
      }
      if (Math.abs(positionAttr.array[i3 + 2]) > depth * 1.5) {
        positionAttr.array[i3 + 2] = (Math.random() - 0.5) * depth;
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

