/**
 * R3F Dev Interface
 * New development interface using React Three Fiber
 */
import { Canvas } from '@react-three/fiber';
import { Leva, useControls } from 'leva';
import { Stats, PerformanceMonitor } from '@react-three/drei';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Scene } from '../components/Book/Scene';
import { Book } from '../components/Book/Book';
import { useBookStore } from '../stores/bookStore';

export default function R3FDevInterface() {
  // Get store actions
  const {
    setPageCount,
    setCurrentPage,
    flipPage,
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
    setFrontCoverText,
    setBackCoverText,
    setCoverTextColor,
    setParticlesEnabled,
    setParticleIntensity,
    setDebug,
  } = useBookStore();
  
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
    
    'Flip Forward': {
      value: () => flipPage('forward'),
      label: '→ Next Page'
    },
    
    'Flip Backward': {
      value: () => flipPage('backward'),
      label: '← Previous Page'
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
        <Link href="/dev" style={{
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.8)',
          color: '#00ffcc',
          textDecoration: 'none',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          ← Old Interface
        </Link>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.8)',
          color: '#00ffcc',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          R3F Interface
        </div>
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
        
        {/* Stats */}
        <Stats />
      </Canvas>
    </>
  );
}

