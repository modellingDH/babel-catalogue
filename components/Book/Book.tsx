/**
 * Main Book Component
 * Composes all book parts with proper physics
 */
import { useRef } from 'react';
import * as THREE from 'three';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useBookStore } from './BookContext';
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
    lean,
    scale,
    position,
    frontHinge,
    backHinge,
    pageOpacity,
    pageColor,
    glowIntensity,
    coverColor,
    coverOpacity,
    spineColor,
    frontCoverText,
    backCoverText,
    coverTextColor,
    coverOutlineColor,
    coverOutlineWidth,
    particlesEnabled,
    particleIntensity,
    debug,
    testPageFlipAngle,
    flippingPageIndex,
    flipProgress,
    flipDirection,
    fontFamily
  } = useBookStore(state => state);

  // Spine parameters - FIXED for proper book physics
  const spineWidth = 0.1;
  const spineDepth = 0.6;
  const coverThickness = 0.05;

  // Apply transformations to book group
  useFrame(() => {
    if (bookGroupRef.current) {
      // Rotation Order: 'XZY'
      // 1. Y (Spine Twist) - Applied first (Intrinsic)
      // 2. Z (Tilt) - Applied second
      // 3. X (Lean) - Applied last (Global/Horizontal)
      bookGroupRef.current.rotation.order = 'XZY';

      bookGroupRef.current.rotation.x = lean || 0;
      bookGroupRef.current.rotation.y = spineRotation;
      bookGroupRef.current.rotation.z = tilt;

      bookGroupRef.current.scale.setScalar(scale);
      const safePosition = position || [0, 0, 0];
      bookGroupRef.current.position.set(safePosition[0], safePosition[1], safePosition[2]);
    }
  });

  return (
    <>
      {/* Global Axes (World) - Positioned at origin */}
      {debug && <axesHelper args={[5]} />}

      {/* Reference Horizontal Plane (Floor) */}
      {debug && (
        <group position={[0, -dimensions.height / 2, 0]}>
          {/* Main Grid */}
          <gridHelper args={[20, 20, 0x666666, 0x222222]} />
          {/* Semi-transparent ground for perspective depth */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      <group ref={bookGroupRef}>
        {/* Local Axes (Book/Spine) */}
        {debug && <axesHelper args={[2]} />}

        {/* Debug helpers labeling */}
        {debug && (
          <Html position={[0, dimensions.height / 2 + 0.5, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: '#00ffcc',
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ color: '#ff6666' }}>X: Width/Horizontal</div>
              <div style={{ color: '#66ff66' }}>Y: Height/Vertical</div>
              <div style={{ color: '#6666ff' }}>Z: Depth</div>
              <div style={{ borderTop: '1px solid #444', margin: '4px 0' }}></div>
              <div>Pages: {pageCount} ({currentPage} / {pageCount - currentPage})</div>
              <div>Spine Twist (Y): {(spineRotation * 180 / Math.PI).toFixed(0)}°</div>
              <div>Tilt (Z): {(tilt * 180 / Math.PI).toFixed(0)}°</div>
              <div>Lean (X): {(lean * 180 / Math.PI).toFixed(0)}°</div>
            </div>
          </Html>
        )}

        {/* Spine - centered at origin */}
        <Spine
          width={spineWidth}
          height={dimensions.height}
          depth={spineDepth}
          color={spineColor}
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
          outlineColor={coverOutlineColor}
          outlineWidth={coverOutlineWidth}
          color={coverColor}
          opacity={coverOpacity}
          fontFamily={fontFamily}
        />
        <Cover
          side="back"
          width={dimensions.width}
          height={dimensions.height}
          hinge={backHinge}
          text={backCoverText}
          textColor={coverTextColor}
          outlineColor={coverOutlineColor}
          outlineWidth={coverOutlineWidth}
          color={coverColor}
          opacity={coverOpacity}
          fontFamily={fontFamily}
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
          // Forward: Flip from FRONT to BACK (180 to 0)
          // Backward: Flip from BACK to FRONT (0 to 180)
          const pageRotation = flipDirection === 'forward'
            ? -frontHinge + flipProgress * (backHinge - (-frontHinge))  // 180° → 0°
            : backHinge + flipProgress * (-frontHinge - backHinge);  // 0° → 180°

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
    </>
  );
}
