/**
 * Scene Component
 * Sets up lights, camera, and environment
 */
import { OrbitControls } from '@react-three/drei';

export function Scene({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Lights - matching concept.html */}
      <ambientLight intensity={0.8} />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={1} 
        distance={50}
        color="#00ffcc"
      />
      
      {/* Camera controls */}
      <OrbitControls 
        makeDefault
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Book content */}
      {children}
    </>
  );
}

