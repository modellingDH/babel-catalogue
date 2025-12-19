import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function DevInterface() {
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
    bookDimensions: { height: 4, width: 3, depth: 0.7 },
    frontCoverText: '',
    backCoverText: '',
    enableGestures: true,
    coverTransparency: 1.0,
    pageTransparency: 0.6,
    coverColor: '#3d2e20',
    pageColor: '#00ffcc',
    debug: false,
  });
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 60, avgFrameTime: 16.67 });

  useEffect(() => {
    if (!containerRef.current) return;

    import('../babelCatalogue.js').then(({ createBabelCatalogue }) => {
      const catalogue = createBabelCatalogue({
        container: containerRef.current,
        pageCount: config.pageCount,
        initialSpineRotation: config.initialSpineRotation,
        initialTilt: config.initialTilt,
        initialScale: config.initialScale,
        initialFrontHinge: config.initialFrontHinge,
        initialBackHinge: config.initialBackHinge,
        initialMaterial: config.initialMaterial,
        initialHover: config.initialHover,
        initialGlowIntensity: config.initialGlowIntensity,
        initialConfidenceScore: config.initialConfidenceScore,
        initialParticleIntensity: config.initialParticleIntensity,
        enableParticlesOption: config.enableParticlesOption,
        enablePageContentOption: config.enablePageContentOption,
        bookDimensions: config.bookDimensions,
        frontCoverText: config.frontCoverText,
        backCoverText: config.backCoverText,
        enableGestures: config.enableGestures,
        debug: config.debug,
      });
      
      // Apply initial transparency and colors after creation
      if (catalogue) {
        catalogue.setCoverTransparency(config.coverTransparency);
        catalogue.setPageTransparency(config.pageTransparency);
        catalogue.setCoverColor(config.coverColor);
        catalogue.setPageColor(config.pageColor);
      }
      
      catalogueRef.current = catalogue;
      window.babelCatalogue = catalogue;
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
      // Update catalogue with new value
      if (key === 'initialSpineRotation') catalogueRef.current.setSpineRotation(value);
      if (key === 'initialTilt') catalogueRef.current.setTilt(value);
      if (key === 'initialScale') catalogueRef.current.setScale(value);
      if (key === 'initialFrontHinge') catalogueRef.current.setFrontHinge(value);
      if (key === 'initialBackHinge') catalogueRef.current.setBackHinge(value);
      if (key === 'initialMaterial') catalogueRef.current.morphMaterial(value);
      if (key === 'initialGlowIntensity') catalogueRef.current.setGlowIntensity(value);
      if (key === 'initialConfidenceScore') catalogueRef.current.setConfidenceScore(value);
      if (key === 'initialParticleIntensity') catalogueRef.current.setParticleIntensity(value);
      if (key === 'bookDimensions') catalogueRef.current.setBookDimensions(value);
      if (key === 'frontCoverText') catalogueRef.current.setFrontCoverText(value);
      if (key === 'backCoverText') catalogueRef.current.setBackCoverText(value);
      if (key === 'coverTransparency') catalogueRef.current.setCoverTransparency(value);
      if (key === 'pageTransparency') catalogueRef.current.setPageTransparency(value);
      if (key === 'coverColor') catalogueRef.current.setCoverColor(value);
      if (key === 'pageColor') catalogueRef.current.setPageColor(value);
    }
  };

  return (
    <>
      <Head>
        <title>Babel Catalogue - Dev Interface</title>
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
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>BABEL v10.3</h3>
            
            <div style={{ marginBottom: '20px', padding: '10px', background: '#000', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>PERFORMANCE</div>
              <div style={{ fontSize: '16px', color: '#00ffcc', fontWeight: 'bold' }}>
                {performanceMetrics.fps} FPS
              </div>
              <div style={{ fontSize: '8px', color: '#666' }}>
                {performanceMetrics.avgFrameTime}ms
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.debug}
                  onChange={(e) => updateConfig('debug', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Debug Mode (wireframes, axes, logging)
              </label>
            </div>
          
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
              Front Cover (Open/Close): {config.initialFrontHinge.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="3.14"
              step="0.01"
              value={config.initialFrontHinge}
              onChange={(e) => updateConfig('initialFrontHinge', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Back Cover (Open/Close): {config.initialBackHinge.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="3.14"
              step="0.01"
              value={config.initialBackHinge}
              onChange={(e) => updateConfig('initialBackHinge', parseFloat(e.target.value))}
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

          <div style={{ marginBottom: '15px', padding: '10px', background: '#001a1a', borderRadius: '4px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px', color: '#00ffcc', fontWeight: 'bold' }}>
              💫 Glow Intensity: {config.initialGlowIntensity.toFixed(2)}
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
            <div style={{ fontSize: '8px', color: '#666', marginTop: '5px' }}>
              0 = no glow (pages visible) | 1.0 = strong glow
            </div>
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
              Flip All Pages Forward
            </button>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
                Page Index (0-{config.pageCount - 1})
              </label>
              <input
                type="number"
                min="0"
                max={config.pageCount - 1}
                value={selectedPageIndex}
                onChange={(e) => setSelectedPageIndex(parseInt(e.target.value) || 0)}
                style={{ width: '100%', padding: '4px', background: '#111', color: '#00ffcc', border: '1px solid #444' }}
              />
              <button
                onClick={() => {
                  if (catalogueRef.current) {
                    catalogueRef.current.flipSinglePage(selectedPageIndex, 'f');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#111',
                  color: '#00ffcc',
                  border: '1px solid #444',
                  cursor: 'pointer',
                  marginTop: '5px',
                }}
              >
                Flip Single Page
              </button>
            </div>
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Book Height
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={config.bookDimensions.height}
              onChange={(e) => updateConfig('bookDimensions', { ...config.bookDimensions, height: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Book Width
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={config.bookDimensions.width}
              onChange={(e) => updateConfig('bookDimensions', { ...config.bookDimensions, width: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Book Depth (Thickness)
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.05"
              value={config.bookDimensions.depth}
              onChange={(e) => updateConfig('bookDimensions', { ...config.bookDimensions, depth: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px', padding: '10px', background: '#111', borderRadius: '4px', border: '1px solid #333' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', color: '#00ffcc' }}>
              Front Cover Text
            </label>
            <textarea
              value={config.frontCoverText}
              onChange={(e) => updateConfig('frontCoverText', e.target.value)}
              placeholder="Enter text for the front cover..."
              rows={4}
              style={{ 
                width: '100%', 
                padding: '6px', 
                background: '#000', 
                color: '#00ffcc', 
                border: '1px solid #444',
                borderRadius: '2px',
                fontFamily: 'monospace',
                fontSize: '10px',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '5px', fontSize: '8px', color: '#666' }}>
              {config.frontCoverText.length} characters
            </div>
          </div>

          <div style={{ marginBottom: '15px', padding: '10px', background: '#111', borderRadius: '4px', border: '1px solid #333' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', color: '#00ffcc' }}>
              Back Cover Text
            </label>
            <textarea
              value={config.backCoverText}
              onChange={(e) => updateConfig('backCoverText', e.target.value)}
              placeholder="Enter text for the back cover..."
              rows={4}
              style={{ 
                width: '100%', 
                padding: '6px', 
                background: '#000', 
                color: '#00ffcc', 
                border: '1px solid #444',
                borderRadius: '2px',
                fontFamily: 'monospace',
                fontSize: '10px',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '5px', fontSize: '8px', color: '#666' }}>
              {config.backCoverText.length} characters
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Cover Transparency: {config.coverTransparency.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.coverTransparency}
              onChange={(e) => updateConfig('coverTransparency', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px', padding: '10px', background: '#001a1a', borderRadius: '4px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px', color: '#00ffcc', fontWeight: 'bold' }}>
              ⚡ Page Opacity: {config.pageTransparency.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={config.pageTransparency}
              onChange={(e) => updateConfig('pageTransparency', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '8px', color: '#666', marginTop: '5px' }}>
              0.15 = concept.html | 0.5 = visible | 1.0 = opaque
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Cover Color
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input
                type="color"
                value={config.coverColor}
                onChange={(e) => updateConfig('coverColor', e.target.value)}
                style={{ width: '60px', height: '30px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={config.coverColor}
                onChange={(e) => updateConfig('coverColor', e.target.value)}
                placeholder="#3d2e20"
                style={{ flex: 1, padding: '4px', background: '#111', color: '#00ffcc', border: '1px solid #444' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Page Color
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input
                type="color"
                value={config.pageColor}
                onChange={(e) => updateConfig('pageColor', e.target.value)}
                style={{ width: '60px', height: '30px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={config.pageColor}
                onChange={(e) => updateConfig('pageColor', e.target.value)}
                placeholder="#00ffcc"
                style={{ flex: 1, padding: '4px', background: '#111', color: '#00ffcc', border: '1px solid #444' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '10px', background: '#000', borderRadius: '4px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px' }}>
              Config JSON
            </label>
            <pre style={{ fontSize: '9px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

