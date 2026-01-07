/**
 * Standalone Example - Babel Catalogue Book Component
 * 
 * This is a self-contained example showcasing the use of the babel-catalogue module
 * with a specific configuration. This file can be used as a reference or directly
 * integrated into your React application.
 * 
 * Configuration:
 * - 30 pages, opened to page 15
 * - Dimensions: height 4, width 3, depth 0.6
 * - Cyan page color (#00ffcc)
 * - Dark brown cover (#2b1e16) with full opacity
 * - Dark spine (#1a0f0a)
 * - Particles enabled with intensity 0.7
 * - Camera position: [6, 4, 10], FOV: 45
 * - Book position: [0, 0, 0]
 * - Rotation: spineRotation 0.5, tilt 0.2
 */

import { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

/**
 * Book Configuration Component
 * 
 * This component initializes the book with the specified configuration
 * and automatically opens the book after setup.
 */
function BookConfigurator() {
  const {
    setPageCount,
    setCurrentPage,
    setDimensions,
    setSpineRotation,
    setTilt,
    setScale,
    setPosition,
    setFrontHinge,
    setBackHinge,
    setPageOpacity,
    setPageColor,
    setGlowIntensity,
    setCoverColor,
    setCoverOpacity,
    setSpineColor,
    setFrontCoverText,
    setBackCoverText,
    setCoverTextColor,
    setParticlesEnabled,
    setParticleIntensity,
    openBook,
  } = useBookStore();

  useEffect(() => {
    // Apply all configuration values
    setPageCount(30);
    setCurrentPage(15);
    setDimensions({
      height: 4,
      width: 3,
      depth: 0.6,
    });
    setSpineRotation(0.5);
    setTilt(0.2);
    setScale(1);
    setPosition([0, 0, 0]);
    setFrontHinge(1.2566370614359172);
    setBackHinge(1.2566370614359172);
    setPageOpacity(0.15);
    setPageColor('#00ffcc');
    setGlowIntensity(0);
    setCoverColor('#2b1e16');
    setCoverOpacity(1);
    setSpineColor('#1a0f0a');
    setFrontCoverText('');
    setBackCoverText('');
    setCoverTextColor('#c9a876');
    setParticlesEnabled(true);
    setParticleIntensity(0.7);

    // Open the book after a short delay to allow configuration to apply
    setTimeout(() => {
      openBook(1500);
    }, 500);
  }, [
    setPageCount,
    setCurrentPage,
    setDimensions,
    setSpineRotation,
    setTilt,
    setScale,
    setPosition,
    setFrontHinge,
    setBackHinge,
    setPageOpacity,
    setPageColor,
    setGlowIntensity,
    setCoverColor,
    setCoverOpacity,
    setSpineColor,
    setFrontCoverText,
    setBackCoverText,
    setCoverTextColor,
    setParticlesEnabled,
    setParticleIntensity,
    openBook,
  ]);

  return null;
}

/**
 * Main App Component
 * 
 * This is the main component that renders the 3D book scene.
 * It sets up the React Three Fiber Canvas with appropriate camera settings
 * and includes the Book component within a Scene.
 */
export default function StandaloneExample() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [6, 4, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <Scene>
            <Book />
          </Scene>
        </Suspense>
      </Canvas>
      <BookConfigurator />
    </div>
  );
}

