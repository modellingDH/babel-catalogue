/**
 * Simple Scene Component for the example
 * Basic lighting setup without OrbitControls to avoid initialization issues
 * 
 * To add camera controls, you can import OrbitControls from @react-three/drei
 * and add it inside this component:
 * 
 * import { OrbitControls } from '@react-three/drei';
 * 
 * Then add inside the return:
 * <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
 */
export function SimpleScene({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.8} />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={1} 
        distance={50}
        color="#00ffcc"
      />
      
      {/* Book content */}
      {children}
    </>
  );
}

