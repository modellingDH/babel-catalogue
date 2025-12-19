/**
 * Main Book Component
 * Composes all book parts with proper physics
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useBookStore } from '../../stores/bookStore';
import { Page } from './Page';
import { Cover } from './Cover';
import { Spine } from './Spine';
import { Particles } from './Particles';
import { Html } from '@react-three/drei';

export function Book() {
  const bookGroupRef = useRef<Group>(null);
  
  // Get state from store
  const {
    pageCount,
    currentPage,
    dimensions,
    spineRotation,
    tilt,
    scale,
    frontHinge,
    backHinge,
    pageOpacity,
    pageColor,
    glowIntensity,
    coverColor,
    coverOpacity,
    frontCoverText,
    backCoverText,
    coverTextColor,
    particlesEnabled,
    particleIntensity,
    debug,
    testPageFlipAngle,
    flippingPageIndex,
    flipProgress,
  } = useBookStore();
  
  // Spine parameters - FIXED for proper book physics
  const spineWidth = 0.1;
  const spineDepth = 0.6;
  const coverThickness = 0.05;
  
  // Apply transformations to book group
  useFrame(() => {
    if (bookGroupRef.current) {
      bookGroupRef.current.rotation.y = spineRotation;
      bookGroupRef.current.rotation.z = tilt; // Tilt controls horizontality (lean left/right)
      bookGroupRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group ref={bookGroupRef}>
      {/* Debug helpers */}
      {debug && (
        <>
          <axesHelper args={[2]} />
          <gridHelper args={[10, 10]} />
          <Html position={[0, dimensions.height / 2 + 0.5, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: '#00ffcc',
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              <div>Total Pages: {pageCount}</div>
              <div>Current Page: {currentPage}</div>
              <div>Spine: {spineWidth} × {spineDepth}</div>
              <div>Back Pages: {currentPage}</div>
              <div>Front Pages: {pageCount - currentPage}</div>
              <div>Cover Width: {dimensions.width.toFixed(2)}</div>
            </div>
          </Html>
        </>
      )}
      
      {/* Spine - centered at origin */}
      <Spine
        width={spineWidth}
        height={dimensions.height}
        depth={spineDepth}
        pageCount={pageCount}
      />
      
      {/* Covers - pivot at spine edges */}
      <Cover
        side="front"
        width={dimensions.width}
        height={dimensions.height}
        hinge={frontHinge}
        text={frontCoverText}
        textColor={coverTextColor}
        color={coverColor}
        opacity={coverOpacity}
      />
      <Cover
        side="back"
        width={dimensions.width}
        height={dimensions.height}
        hinge={backHinge}
        text={backCoverText}
        textColor={coverTextColor}
        color={coverColor}
        opacity={coverOpacity}
      />
      
      {/* Back cover pages - attached to INSIDE face of back cover */}
      {/* Group at back cover pivot, pages extend inward (toward front) */}
      <group 
        position={[spineWidth / 2, 0, -spineDepth / 2]} 
        rotation={[0, backHinge, 0]}
      >
        {/* Pages positioned at inside face of cover (toward the front) */}
        <group position={[0, 0, coverThickness / 2]}>
          {Array.from({ length: currentPage }, (_, i) => {
            // Skip the page that's currently flipping forward
            if (i === flippingPageIndex && flipProgress > 0) return null;
            
            return (
              <Page
                key={`back-${i}`}
                index={i}
                totalPages={pageCount}
                currentPage={currentPage}
                opacity={pageOpacity}
                color={pageColor}
                glow={glowIntensity}
                coverWidth={dimensions.width}
                coverHeight={dimensions.height}
              />
            );
          })}
        </group>
      </group>
      
      {/* Front cover pages - attached to INSIDE face of front cover */}
      {/* Group at front cover pivot, pages extend inward (toward back) */}
      <group 
        position={[spineWidth / 2, 0, spineDepth / 2]} 
        rotation={[0, -frontHinge, 0]}
      >
        {/* Pages positioned at inside face of cover (toward the back) */}
        <group position={[0, 0, -coverThickness / 2]}>
          {Array.from({ length: pageCount - currentPage }, (_, i) => {
            const pageIndex = i + currentPage;
            // Skip the page that's currently flipping (when flipping backward)
            if (pageIndex === flippingPageIndex && flipProgress > 0) return null;
            
            return (
              <Page
                key={`front-${pageIndex}`}
                index={pageIndex}
                totalPages={pageCount}
                currentPage={currentPage}
                opacity={pageOpacity}
                color={pageColor}
                glow={glowIntensity}
                coverWidth={dimensions.width}
                coverHeight={dimensions.height}
              />
            );
          })}
        </group>
      </group>
      
      {/* Flipping page - rendered separately with animation */}
      {flippingPageIndex !== null && flipProgress > 0 && (() => {
        // Both forward and backward animate from back to front (0 to 180)
        // The difference is which page is selected, not the animation direction
        // Always rotate from backHinge to -frontHinge
        const pageRotation = backHinge + flipProgress * (-frontHinge - backHinge);
        
        return (
          <group 
            position={[spineWidth / 2, 0, 0]} 
            rotation={[0, pageRotation, 0]}
          >
            {/* Flipping page with normal appearance */}
            <mesh position={[dimensions.width * 0.93 / 2, 0, 0]}>
              <planeGeometry args={[dimensions.width * 0.93, dimensions.height * 0.95]} />
              <meshStandardMaterial
                color={pageColor}
                transparent
                opacity={pageOpacity}
                side={THREE.DoubleSide}
                emissive={pageColor}
                emissiveIntensity={glowIntensity}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })()}
      
      {/* Particles */}
      <Particles
        count={200}
        intensity={particleIntensity}
        enabled={particlesEnabled}
        bookDimensions={{
          ...dimensions,
          depth: spineDepth
        }}
      />
      
      {/* Debug: Manual test page that flips */}
      {testPageFlipAngle > 0 && (() => {
        // Calculate page rotation between the two cover angles
        // 0° = back cover angle (backHinge)
        // 180° = front cover angle (-frontHinge)
        const progress = testPageFlipAngle / 180; // 0 to 1
        const pageRotation = backHinge + progress * (-frontHinge - backHinge);
        
        return (
          <group 
            position={[spineWidth / 2, 0, 0]} 
            rotation={[0, pageRotation, 0]}
          >
            {/* Page positioned so its EDGE is at pivot point (spine edge) */}
            <mesh position={[dimensions.width / 2, 0, 0]}>
              <planeGeometry args={[dimensions.width, dimensions.height]} />
              <meshStandardMaterial
                color="#ff0000"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                emissive="#ff0000"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
}
