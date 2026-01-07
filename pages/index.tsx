/**
 * R3F Dev Interface
 * New development interface using React Three Fiber
 */
import { Canvas } from '@react-three/fiber';
import { Leva, useControls, button } from 'leva';
import { Stats, PerformanceMonitor } from '@react-three/drei';
import { useEffect } from 'react';
import Head from 'next/head';
import { Scene } from '../components/Book/Scene';
import { Book } from '../components/Book/Book';
import { BookProvider, useBookStore } from '../components/Book/BookContext';

function DevContent() {
  // Get store state and actions
  const bookState = useBookStore(state => state);
  const {
    setPageCount,
    setCurrentPage,
    flipPage,
    flipPages,
    toggleContinuousFlip,
    isFlippingContinuously,
    continuousDirection,
    setDimensions,
    setSpineRotation,
    setTilt,
    setScale,
    setFrontHinge,
    setBackHinge,
    setBothHinges,
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
    setDebug,
    setTestPageFlipAngle,
    // Animated actions
    openBook,
    closeBook,
    triggerEmotion,
    morphMaterial,
  } = useBookStore(state => state);

  // Leva controls - automatic GUI
  const controls = useControls('Book Controls', {
    // Core - Pages
    pageCount: {
      value: 30,
      min: 10,
      max: 100,
      step: 1,
      label: 'Page Density (more = denser)',
      onChange: (v) => setPageCount(v)
    },

    currentPage: {
      value: 15,
      min: 0,
      max: 99,
      step: 1,
      label: 'Current Page (book opens here)',
      onChange: (v) => setCurrentPage(v)
    },

    // Dimensions (spine depth auto-calculated from pageCount)
    dimensions: {
      value: { height: 4, width: 3 },
      label: 'Cover Size (height, width)',
      onChange: (v) => setDimensions(v)
    },

    // Transformations
    spineRotation: {
      value: 0.5,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      onChange: (v) => setSpineRotation(v)
    },
    tilt: {
      value: 0.2,
      min: -1.5,
      max: 1.5,
      step: 0.01,
      onChange: (v) => setTilt(v)
    },
    scale: {
      value: 1,
      min: 0.5,
      max: 2,
      step: 0.01,
      onChange: (v) => setScale(v)
    },

    // Hinges - Symmetric Control
    'Open/Close Book': {
      value: 0,
      min: 0,
      max: Math.PI,
      step: 0.01,
      label: '📖 Both Covers (Symmetric)',
      onChange: (v) => setBothHinges(v)
    },

    // Individual Hinge Controls
    frontHinge: {
      value: 0,
      min: 0,
      max: Math.PI,
      step: 0.01,
      label: 'Front Cover Only',
      onChange: (v) => setFrontHinge(v)
    },
    backHinge: {
      value: 0,
      min: 0,
      max: Math.PI,
      step: 0.01,
      label: 'Back Cover Only',
      onChange: (v) => setBackHinge(v)
    },
  });

  const appearance = useControls('Appearance', {
    // Pages
    pageOpacity: {
      value: 0.15,
      min: 0.05,
      max: 1,
      step: 0.05,
      onChange: (v) => setPageOpacity(v)
    },
    pageColor: {
      value: '#00ffcc',
      onChange: (v) => setPageColor(v)
    },
    glowIntensity: {
      value: 0,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (v) => setGlowIntensity(v)
    },

    // Covers
    coverColor: {
      value: '#2b1e16',
      onChange: (v) => setCoverColor(v)
    },
    coverOpacity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => setCoverOpacity(v)
    },
    spineColor: {
      value: '#1a0f0a',
      onChange: (v) => setSpineColor(v)
    },
  });

  const text = useControls('Cover Text', {
    coverTextColor: {
      value: '#c9a876',
      label: 'Text Color',
      onChange: (v) => setCoverTextColor(v)
    },

    frontCoverText: {
      value: '',
      label: 'Front Cover Text',
      onChange: (v) => setFrontCoverText(v)
    },
    backCoverText: {
      value: '',
      label: 'Back Cover Text',
      onChange: (v) => setBackCoverText(v)
    },
  });

  const features = useControls('Features', {
    particlesEnabled: {
      value: true,
      onChange: (v) => setParticlesEnabled(v)
    },
    particleIntensity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (v) => setParticleIntensity(v)
    },
    debug: {
      value: false,
      onChange: (v) => setDebug(v)
    },
  });

  // Debug: Manual Page Flip Test
  useControls('🔧 Debug: Manual Page Flip', {
    'Test Page Flip Angle': {
      value: 0,
      min: 0,
      max: 180,
      step: 1,
      label: '📄 Flip Angle (0=back, 180=front)',
      onChange: (v) => setTestPageFlipAngle(v)
    },
  });

  // Animated Actions
  useControls('📖 Animated Actions', {
    'Open Book': button(() => openBook(1000)),
    'Close Book': button(() => closeBook(1000)),

    // Page flipping
    'Flip Forward': button(() => flipPage('forward')),
    'Flip Backward': button(() => flipPage('backward')),
    'Flip 5 Forward': button(() => flipPages(5, 'forward')),
    'Flip 5 Backward': button(() => flipPages(5, 'backward')),

    // Continuous flipping
    'Continuous Forward': button(
      () => toggleContinuousFlip('forward')
    ),
    'Continuous Backward': button(
      () => toggleContinuousFlip('backward')
    ),
  });

  // Emotions (from README concept)
  useControls('🎭 Emotions', {
    'Focus': button(() => triggerEmotion('focus')),
    'Drift': button(() => triggerEmotion('drift')),
    'Paradox': button(() => triggerEmotion('paradox')),
  });

  // Material Morphing (from README concept)
  useControls('🎨 Materials', {
    'Leather': button(() => morphMaterial('leather')),
    'Metal': button(() => morphMaterial('metal')),
    'Glass': button(() => morphMaterial('glass')),
  });

  return (
    <>
      <Head>
        <title>Babel Catalogue - R3F Dev Interface</title>
      </Head>

      {/* Leva GUI */}
      <Leva
        collapsed={false}
        oneLineLabels
        theme={{
          colors: {
            elevation1: '#020202',
            elevation2: '#111',
            elevation3: '#222',
            accent1: '#00ffcc',
            accent2: '#00aa88',
            accent3: '#006655',
            highlight1: '#00ffcc',
            highlight2: '#00aa88',
            highlight3: '#006655',
          },
          fonts: {
            mono: 'Monaco, monospace',
          }
        }}
      />

      {/* Navigation */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.8)',
          color: '#00ffcc',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          📖 Babel Catalogue
        </div>
      </div>

      {/* Configuration JSON Display */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto',
        padding: '16px',
        background: 'rgba(0,0,0,0.9)',
        color: '#00ffcc',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        border: '1px solid #00ffcc',
        zIndex: 1000
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
          📋 Configuration JSON
        </div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify({
            pageCount: bookState.pageCount,
            currentPage: bookState.currentPage,
            dimensions: bookState.dimensions,
            // Rotation angles (in radians)
            spineRotation: bookState.spineRotation,
            tilt: bookState.tilt,
            // Rotation angles (in degrees) for easier reading
            rotation: {
              y: (bookState.spineRotation * 180) / Math.PI,
              z: (bookState.tilt * 180) / Math.PI
            },
            // Position and scale
            position: [0, 0, 0], // Book position in 3D space
            scale: bookState.scale,
            // Camera position
            cameraPosition: [6, 4, 10],
            cameraFov: 45,
            // Cover hinges
            frontHinge: bookState.frontHinge,
            backHinge: bookState.backHinge,
            // Appearance
            pageOpacity: bookState.pageOpacity,
            pageColor: bookState.pageColor,
            glowIntensity: bookState.glowIntensity,
            coverColor: bookState.coverColor,
            coverOpacity: bookState.coverOpacity,
            spineColor: bookState.spineColor,
            frontCoverText: bookState.frontCoverText,
            backCoverText: bookState.backCoverText,
            coverTextColor: bookState.coverTextColor,
            particlesEnabled: bookState.particlesEnabled,
            particleIntensity: bookState.particleIntensity
          }, null, 2)}
        </pre>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [6, 4, 10], fov: 45 }}
        shadows
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Performance monitoring */}
        <PerformanceMonitor>
          <Scene>
            <Book />
          </Scene>
        </PerformanceMonitor>

        <Stats />
      </Canvas>
    </>
  );
}

export default function R3FDevInterface() {
  return (
    <BookProvider>
      <DevContent />
    </BookProvider>
  );
}

