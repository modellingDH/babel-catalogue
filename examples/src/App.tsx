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

import { useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, useBookStore, BookProvider } from 'babel-catalogue';
import { SimpleScene } from './SimpleScene';

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
  } = useBookStore(state => state);

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
 * Position Controls Component
 * 
 * Provides editable input fields for the book's position in 3D space.
 */
function PositionControls() {
  const { position, setPosition } = useBookStore(state => state);
  // Default to [0, 0, 0] if position is undefined
  const safePosition: [number, number, number] = position || [0, 0, 0];
  const [localPosition, setLocalPosition] = useState<[number, number, number]>(safePosition);

  useEffect(() => {
    if (position) {
      setLocalPosition(position);
    }
  }, [position]);

  const handleChange = (index: 0 | 1 | 2, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newPosition: [number, number, number] = [...localPosition];
    newPosition[index] = numValue;
    setLocalPosition(newPosition);
    setPosition(newPosition);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#00ffcc',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      border: '1px solid #00ffcc',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
        📍 Book Position
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '20px', color: '#00ffcc' }}>X:</label>
          <input
            type="number"
            step="0.1"
            value={localPosition[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            style={{
              flex: 1,
              padding: '4px 8px',
              background: 'rgba(0, 255, 204, 0.1)',
              border: '1px solid #00ffcc',
              borderRadius: '4px',
              color: '#00ffcc',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '20px', color: '#00ffcc' }}>Y:</label>
          <input
            type="number"
            step="0.1"
            value={localPosition[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            style={{
              flex: 1,
              padding: '4px 8px',
              background: 'rgba(0, 255, 204, 0.1)',
              border: '1px solid #00ffcc',
              borderRadius: '4px',
              color: '#00ffcc',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '20px', color: '#00ffcc' }}>Z:</label>
          <input
            type="number"
            step="0.1"
            value={localPosition[2]}
            onChange={(e) => handleChange(2, e.target.value)}
            style={{
              flex: 1,
              padding: '4px 8px',
              background: 'rgba(0, 255, 204, 0.1)',
              border: '1px solid #00ffcc',
              borderRadius: '4px',
              color: '#00ffcc',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Main App Component
 * 
 * This is the main component that renders the 3D book scene.
 * It sets up the React Three Fiber Canvas with appropriate camera settings
 * and includes the Book component within a Scene.
 */
// Main App Component already wrapped below

function AppContent() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [6, 4, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#000000' }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <SimpleScene>
            <Book />
          </SimpleScene>
        </Suspense>
      </Canvas>
      <BookConfigurator />
      <PositionControls />
    </div>
  );
}

function App() {
  return (
    <BookProvider>
      <AppContent />
    </BookProvider>
  );
}

export default App;

