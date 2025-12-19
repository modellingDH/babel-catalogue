import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef(null);
  const catalogueRef = useRef(null);
  const [config, setConfig] = useState({
    pageCount: 15,
    initialSpineRotation: 0.5,
    initialTilt: 0.2,
    initialScale: 1,
    initialFrontHinge: 0,
    initialBackHinge: 0,
    initialMaterial: 'leather',
    initialHover: false,
    initialGlowIntensity: 0.0,
    initialConfidenceScore: 0.0,
    initialParticleIntensity: 0.0,
    enableParticlesOption: true,
    enablePageContentOption: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import the module
    import('../babelCatalogue.js').then(({ createBabelCatalogue }) => {
      const catalogue = createBabelCatalogue({
        container: containerRef.current,
        ...config,
      });
      
      catalogueRef.current = catalogue;
      
      // Expose to window for debugging
      if (typeof window !== 'undefined') {
        window.babelCatalogue = catalogue;
      }
    }).catch(err => {
      console.error('Failed to load Babel Catalogue:', err);
    });

    return () => {
      if (catalogueRef.current) {
        catalogueRef.current.dispose();
      }
    };
  }, []);

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (catalogueRef.current) {
      if (key === 'initialSpineRotation') catalogueRef.current.setSpineRotation(value);
      if (key === 'initialTilt') catalogueRef.current.setTilt(value);
      if (key === 'initialScale') catalogueRef.current.setScale(value);
      if (key === 'initialFrontHinge') catalogueRef.current.setFrontHinge(value);
      if (key === 'initialBackHinge') catalogueRef.current.setBackHinge(value);
      if (key === 'initialMaterial') catalogueRef.current.morphMaterial(value);
      if (key === 'initialGlowIntensity') catalogueRef.current.setGlowIntensity(value);
      if (key === 'initialConfidenceScore') catalogueRef.current.setConfidenceScore(value);
      if (key === 'initialParticleIntensity') catalogueRef.current.setParticleIntensity(value);
    }
  };

  return (
    <>
      <Head>
        <title>Babel Catalogue - Dev Interface</title>
        <meta name="description" content="Babel Catalogue Development Interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <div
          ref={containerRef}
          style={{
            flex: 1,
            background: '#020202',
            position: 'relative',
          }}
        />
        <div
          style={{
            width: '300px',
            background: 'rgba(0,0,0,0.9)',
            color: '#00ffcc',
            padding: '15px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '11px',
            borderLeft: '1px solid #333',
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>BABEL v10.3</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Spine Rotation
            </label>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={config.initialSpineRotation}
              onChange={(e) => updateConfig('initialSpineRotation', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Tilt
            </label>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.01"
              value={config.initialTilt}
              onChange={(e) => updateConfig('initialTilt', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Scale
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              value={config.initialScale}
              onChange={(e) => updateConfig('initialScale', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Front Hinge
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={config.initialFrontHinge}
              onChange={(e) => updateConfig('initialFrontHinge', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Back Hinge
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={config.initialBackHinge}
              onChange={(e) => updateConfig('initialBackHinge', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Material
            </label>
            <select
              value={config.initialMaterial}
              onChange={(e) => updateConfig('initialMaterial', e.target.value)}
              style={{
                width: '100%',
                background: '#000',
                color: '#0f0',
                border: '1px solid #444',
                padding: '5px',
              }}
            >
              <option value="leather">Ancient Leather</option>
              <option value="metal">Systemic Metal</option>
              <option value="glass">Conceptual Glass</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Confidence Score
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.initialConfidenceScore}
              onChange={(e) => updateConfig('initialConfidenceScore', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Glow Intensity
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.initialGlowIntensity}
              onChange={(e) => updateConfig('initialGlowIntensity', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Particle Intensity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.initialParticleIntensity}
              onChange={(e) => updateConfig('initialParticleIntensity', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => {
                if (catalogueRef.current) {
                  catalogueRef.current.toggleHover();
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#111',
                color: '#00ffcc',
                border: '1px solid #444',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              Toggle Hover
            </button>
            <button
              onClick={() => {
                if (catalogueRef.current) {
                  catalogueRef.current.flipPages('f');
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#111',
                color: '#00ffcc',
                border: '1px solid #444',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              Flip Pages Forward
            </button>
            <button
              onClick={() => {
                if (catalogueRef.current) {
                  catalogueRef.current.flipPages('b');
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#111',
                color: '#00ffcc',
                border: '1px solid #444',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              Flip Pages Backward
            </button>
            <button
              onClick={() => {
                if (catalogueRef.current) {
                  catalogueRef.current.resetPages();
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#111',
                color: '#00ffcc',
                border: '1px solid #444',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              Reset Pages
            </button>
            <button
              onClick={() => {
                if (catalogueRef.current) {
                  catalogueRef.current.glitch();
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: '#111',
                color: '#ff3366',
                border: '1px solid #444',
                cursor: 'pointer',
              }}
            >
              Trigger Glitch
            </button>
          </div>

          <div style={{ marginTop: '20px', padding: '10px', background: '#000', borderRadius: '4px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Config JSON
            </label>
            <pre style={{ fontSize: '9px', overflow: 'auto', maxHeight: '200px', color: '#0f0' }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

