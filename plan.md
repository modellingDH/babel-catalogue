# Implementation Plan: The Sentient Catalogue

## Overview

This plan outlines the evolution of the Babel Catalogue from a static 3D book into a dynamic, responsive visualization system that represents AI cognitive states through visual, auditory, and physical feedback.

---

## Phase 1: Dynamic Data Visualization

**Objective**: Add internal "life" to the pages during AI computation, making the book feel alive and responsive to processing states.

### 1.1 Luminous Search (Glow Intensity)

**Feature**: Page material emissive properties linked to flipping speed and AI confidence.

**Technical Implementation**:
- **Material Enhancement**: Convert `pageMat` from `MeshStandardMaterial` to `MeshPhysicalMaterial` to enable emissive properties
- **Emissive Intensity Calculation**: 
  - Track page flip velocity: `flipVelocity = abs(currentAngle - previousAngle) / deltaTime`
  - Map velocity to emissive intensity: `emissiveIntensity = clamp(flipVelocity * 0.1, 0.0, 2.0)`
  - Apply to all page materials: `pageMat.emissive.setHex(0x00ffcc)` and `pageMat.emissiveIntensity = emissiveIntensity`
- **API Addition**:
  ```javascript
  setGlowIntensity(intensity: number) // 0.0 to 2.0
  setConfidenceScore(score: number)   // 0.0 to 1.0, maps to glow
  ```
- **Animation**: Smooth transitions using TWEEN.js to avoid flickering
- **Performance**: Update emissive only when pages are moving (optimization)

**Files to Modify**:
- `babelCatalogue.js`: 
  - Update page material creation (line ~108)
  - Add velocity tracking in `flipPages()` method
  - Add new API methods to public interface

**Testing**:
- Verify glow increases during rapid page flips
- Test smooth transitions when flipping stops
- Check performance impact (should be minimal, emissive is cheap)

---

### 1.2 The Particle "Data Stream"

**Feature**: GPU-accelerated particle system that flows upward from open pages, representing data retrieval.

**Technical Implementation**:
- **Particle System Setup**:
  - Use `THREE.BufferGeometry` with `Float32Array` for positions (GPU-friendly)
  - Create `THREE.Points` with `THREE.PointsMaterial`
  - Initial particle count: 1000-2000 (configurable via options)
- **Spawn Logic**:
  - Only spawn when `frontHingeAngle > 0.5` OR `backHingeAngle > 0.5` (book is open)
  - Spawn point: Base of open pages (z-position near page stack)
  - Spawn rate: Dynamic based on `confidenceScore` (0-1) → particles per frame
- **Particle Behavior**:
  - Velocity: Upward (Y+) with slight random X/Z drift
  - Lifetime: 2-4 seconds, then respawn at base
  - Color: Match page emissive color (0x00ffcc) with opacity fade
  - Size: 0.01-0.03 units, randomized per particle
- **Intensity Mapping**:
  - `particleIntensity = confidenceScore * maxParticles`
  - When confidence = 0: No particles
  - When confidence = 1: Full particle stream
- **API Addition**:
  ```javascript
  setParticleIntensity(intensity: number) // 0.0 to 1.0
  setConfidenceScore(score: number)      // Also affects particles
  enableParticles(enabled: boolean)       // Toggle system
  ```
- **Performance Optimization**:
  - Use instanced rendering if particle count > 2000
  - Update only visible particles (frustum culling)
  - Reuse geometry buffers (don't recreate on each frame)

**Files to Modify**:
- `babelCatalogue.js`:
  - Add particle system initialization after page creation
  - Add particle update logic in animation loop
  - Add spawn/despawn logic based on hinge angles

**Testing**:
- Verify particles only appear when book is open
- Test intensity scaling with confidence score
- Performance test with 2000+ particles (target: 60fps)

---

### 1.3 Canvas Texture Page Content

**Feature**: Dynamic text/glyphs rendered on transparent pages using CanvasTexture, mimicking the "infinite" Babel Library.

**Technical Implementation**:
- **Canvas Setup**:
  - Create `HTMLCanvasElement` (512x512 or 1024x1024 for quality)
  - Use 2D context for text rendering
  - Create `THREE.CanvasTexture` from canvas
- **Text Rendering**:
  - Font: Monospace, small size (8-12px on canvas)
  - Content: Procedurally generated glyphs/symbols (Unicode blocks, mathematical symbols)
  - Color: Subtle cyan/white (0x00ffcc with low opacity)
  - Layout: Vertical columns, multiple lines
- **Scrolling Animation**:
  - Vertical scroll: `scrollOffset += scrollSpeed * deltaTime`
  - Wrap-around: When text reaches bottom, reset to top with new content
  - Speed: Configurable, default 0.5-2.0 pixels per frame
- **Content Generation**:
  - Option 1: Pre-generated symbol arrays (fast, static)
  - Option 2: Procedural generation (more dynamic, CPU cost)
  - Option 3: External data source (for real-time AI token streaming)
- **Material Application**:
  - Apply texture to `pageMat.map`
  - Use `pageMat.transparent = true` and `pageMat.opacity = 0.3-0.5`
  - Blend mode: `THREE.AdditiveBlending` for glow effect
- **API Addition**:
  ```javascript
  setPageContent(text: string)           // Set static text
  setScrollSpeed(speed: number)          // Pixels per frame
  enablePageContent(enabled: boolean)     // Toggle rendering
  updatePageContent(tokens: string[])    // For streaming AI tokens
  ```

**Files to Modify**:
- `babelCatalogue.js`:
  - Add canvas/texture creation in initialization
  - Add scroll update in animation loop
  - Add text rendering function

**Testing**:
- Verify text scrolls smoothly
- Test with different scroll speeds
- Check performance impact (canvas updates can be expensive)
- Test with real AI token streams

---

## Phase 2: Material & Sound Synesthesia

**Objective**: Expand sensory feedback to create a richer, more immersive representation of different knowledge types.

### 2.1 Procedural Audio Integration

**Feature**: Web Audio API synthesis for every movement, creating an audio landscape that matches visual states.

**Technical Implementation**:
- **Audio Context Setup**:
  - Create `AudioContext` (lazy initialization on first interaction for autoplay compliance)
  - Master gain node for volume control
  - Separate gain nodes for each sound type (hinge, pages, hum)
- **Sound Types**:

  **A. Hinge Creak**:
  - Trigger: When `setFrontHinge()` or `setBackHinge()` is called with angle change
  - Synthesis: Low-frequency triangle wave (80-120Hz)
  - Envelope: Attack 0.1s, decay 0.3s, sustain 0.2, release 0.5s
  - Modulation: Slight frequency wobble based on hinge velocity
  - Volume: Proportional to hinge angle change speed

  **B. Page Rustle**:
  - Trigger: During `flipPages()` animation
  - Synthesis: High-pass filtered white noise bursts
  - Envelope: Short attack (0.05s), quick decay (0.2s)
  - Timing: One burst per page flip (staggered with page animation delays)
  - Filter: High-pass at 2000Hz, resonance Q=2

  **C. Babel Hum**:
  - Trigger: Continuous while book is open (`frontHingeAngle > 0.5` OR `backHingeAngle > 0.5`)
  - Synthesis: Constant 110Hz sine wave
  - Modulation: Slight amplitude modulation (tremolo) at 0.5Hz for "breathing" effect
  - Volume: Base level 0.1, increases with particle intensity
  - Spatial: Optional stereo panning based on book position

  **D. Material Change Ping**:
  - Trigger: On `morphMaterial()` call
  - Synthesis: High-frequency sine wave burst
  - Frequency: Material-specific (leather: 150Hz, metal: 880Hz, glass: 1200Hz)
  - Envelope: Very short (0.1s total)

- **API Addition**:
  ```javascript
  setAudioEnabled(enabled: boolean)      // Master audio toggle
  setMasterVolume(volume: number)       // 0.0 to 1.0
  setHingeCreakVolume(volume: number)    // Per-sound controls
  setPageRustleVolume(volume: number)
  setBabelHumVolume(volume: number)
  ```

**Files to Modify**:
- `babelCatalogue.js`:
  - Add audio context initialization
  - Add sound synthesis functions
  - Integrate audio triggers into existing methods
  - Add audio cleanup in `dispose()`

**Testing**:
- Test all sound types individually
- Verify audio respects browser autoplay policies
- Test volume controls
- Performance: Audio should not impact frame rate

---

### 2.2 PBR Material Textures

**Feature**: Upgrade from simple color materials to full Physically Based Rendering with normal maps and roughness maps.

**Technical Implementation**:
- **Texture Generation**:
  - **Leather Normal Map**: 
    - Procedural generation using Perlin noise or similar
    - Create canvas, draw noise pattern, convert to normal map format
    - Alternative: Use pre-generated texture image
  - **Metal Roughness Map**:
    - Micro-scratches pattern (procedural or image)
    - Roughness values: 0.1-0.3 for polished metal, 0.4-0.7 for brushed
  - **Glass Iridescence**:
    - Thin-film interference effect using `MeshPhysicalMaterial.iridescence`
    - Iridescence map or uniform value

- **Material Upgrades**:
  - Convert `coverMat` to `MeshPhysicalMaterial`
  - Add texture loading/creation:
    ```javascript
    const normalMap = new THREE.TextureLoader().load('leather-normal.jpg');
    const roughnessMap = new THREE.TextureLoader().load('leather-roughness.jpg');
    coverMat.normalMap = normalMap;
    coverMat.roughnessMap = roughnessMap;
    coverMat.metalness = 0.0; // for leather
    ```

- **Material Presets**:
  - **Leather**: 
    - Normal map: Grainy texture
    - Roughness: 0.8-0.9
    - Metalness: 0.0
  - **Metal**:
    - Normal map: Micro-scratches
    - Roughness: 0.2-0.3
    - Metalness: 1.0
  - **Glass**:
    - Iridescence: 1.0
    - Roughness: 0.0
    - Transmission: 1.0

- **API Addition**:
  ```javascript
  setMaterialTexture(type: string, textureUrl: string)  // Custom textures
  setMaterialRoughness(roughness: number)                // Override roughness
  setMaterialMetalness(metalness: number)               // Override metalness
  ```

**Files to Modify**:
- `babelCatalogue.js`:
  - Update material creation
  - Add texture loading logic
  - Update `morphMaterial()` to apply textures

**Assets Needed**:
- Normal map textures (or procedural generation code)
- Roughness map textures (or procedural generation code)

**Testing**:
- Verify textures load correctly
- Test material switching performance
- Check visual quality on different devices

---

## Phase 3: Physical Environment Logic

**Objective**: Make the book interact naturally with simulated physics, enhancing the "External Observer" realism.

### 3.1 Gravity & Page Sag

**Feature**: Procedural deformation of page geometry based on book tilt, simulating the weight of paper/glass.

**Technical Implementation**:
- **Geometry Deformation**:
  - Current: Pages use `PlaneGeometry` (static vertices)
  - New: Use `BufferGeometry` with mutable vertex positions
  - Access vertices: `geometry.attributes.position.array`
- **Sag Calculation**:
  - Input: Book tilt angles (`bookGroup.rotation.x` and `bookGroup.rotation.z`)
  - For each page:
    - Calculate gravity vector in local space
    - Apply sag offset: `sagOffset = gravityComponent * sagAmount * distanceFromSpine`
    - Sag amount: Configurable (default 0.05-0.15 units)
  - Vertex displacement:
    ```javascript
    for (let i = 0; i < vertexCount; i++) {
      const y = originalY + sagOffset * (1 - abs(x / pageWidth))
      positionArray[i * 3 + 1] = y; // Y component
    }
    ```
- **Animation**:
  - Smooth transitions when tilt changes (use TWEEN for vertex positions)
  - Update only when tilt changes (performance optimization)
- **Constraints**:
  - Pages attached to spine don't sag (x = 0)
  - Maximum sag at page edge (x = pageWidth)
  - Sag only affects Y-axis (vertical droop)

- **API Addition**:
  ```javascript
  setGravityEnabled(enabled: boolean)    // Toggle physics
  setSagAmount(amount: number)           // 0.0 to 0.3
  setGravityStrength(strength: number)   // Multiplier for gravity effect
  ```

**Files to Modify**:
- `babelCatalogue.js`:
  - Convert page geometry to BufferGeometry with mutable vertices
  - Add sag calculation function
  - Update sag in animation loop (only when tilt changes)
  - Store original vertex positions for reset

**Performance Considerations**:
- Update vertices only when tilt changes (not every frame)
- Use `geometry.attributes.position.needsUpdate = true` only when modified
- Consider using compute shaders for GPU acceleration if needed

**Testing**:
- Verify sag appears when book is tilted
- Test smooth transitions
- Check performance impact (vertex updates can be expensive)
- Test edge cases (extreme tilts, rapid changes)

---

### 3.2 Spine Anchor Logic (Pivot Refinement)

**Feature**: Toggle between spine-based pivot (for presenting) and center-based pivot (for inspecting).

**Technical Implementation**:
- **Pivot System**:
  - Current: Book rotates around its center (bookGroup origin)
  - New: Support two pivot modes:
    - **Spine Pivot**: Rotation around spine center (x=0, y=0, z=0 in bookGroup)
    - **Center Pivot**: Rotation around book center (current behavior)
- **Implementation**:
  - Add pivot group wrapper:
    ```javascript
    const pivotGroup = new THREE.Group();
    const bookContent = new THREE.Group(); // Contains all book parts
    pivotGroup.add(bookContent);
    scene.add(pivotGroup);
    ```
  - Spine pivot: `bookContent.position.set(-1.5, 0, 0)` (offset to spine)
  - Center pivot: `bookContent.position.set(0, 0, 0)`
  - Smooth transition between pivots using TWEEN
- **Use Cases**:
  - **Spine Pivot**: Better for "presenting" the book (opens like a real book)
  - **Center Pivot**: Better for "inspecting" (rotates in place)

- **API Addition**:
  ```javascript
  setPivotMode(mode: 'spine' | 'center')
  getPivotMode(): 'spine' | 'center'
  ```

**Files to Modify**:
- `babelCatalogue.js`:
  - Restructure scene graph to support pivot switching
  - Add pivot mode state
  - Add pivot transition logic

**Testing**:
- Verify smooth transition between pivot modes
- Test rotation behavior in each mode
- Check that all animations work correctly in both modes

---

## Strategic Signpost Mapping (For Animation)

This table maps visual/audio features to AI cognitive states for use in animation scripting:

| Feature | Animation Usage | AI Cognitive State | Implementation Trigger |
|---------|----------------|-------------------|---------------------|
| **Glow Pulse** | Breathing light while idle | AI is "pondering" or waiting for user input | `setGlowIntensity()` with sine wave modulation (0.3-0.7 range) |
| **Data Stream** | High-velocity particles | AI is scanning billions of records (Search Phase) | `setParticleIntensity(1.0)` + `setConfidenceScore(1.0)` |
| **Page Sag** | Subtle droop when tilted | AI is "tired" or processing a heavy, melancholic truth | `setTilt()` with negative X rotation + `setGravityEnabled(true)` |
| **Sound Ping** | High-pitch chime on material change | AI has successfully shifted context (e.g., Science to Art) | `morphMaterial()` automatically triggers ping |
| **Hinge Creak** | Slow, deliberate cover movement | AI is carefully considering or hesitating | `setFrontHinge()` with slow TWEEN duration (2000ms+) |
| **Rapid Page Flip** | Fast, staccato page turns | AI is rapidly processing multiple concepts | `flipPages()` with reduced delay between pages (20ms vs 60ms) |
| **Glitch Effect** | Violent tremor and position shake | AI encounters contradiction or error | `glitch()` method (already implemented) |

---

## Implementation Order & Dependencies

### Recommended Sequence:

1. **Phase 1.1 (Luminous Search)** - Foundation for visual feedback
2. **Phase 1.2 (Particle Data Stream)** - Builds on glow system
3. **Phase 1.3 (Canvas Texture)** - Independent, can be done in parallel
4. **Phase 2.1 (Procedural Audio)** - Enhances all existing features
5. **Phase 2.2 (PBR Materials)** - Visual polish
6. **Phase 3.1 (Gravity & Page Sag)** - Requires geometry refactoring
7. **Phase 3.2 (Spine Anchor)** - Scene graph restructuring

### Critical Path:
- Phase 1 features are independent and can be developed in parallel
- Phase 2 requires Phase 1 completion for full integration
- Phase 3 requires careful scene graph planning

---

## API Summary (Post-Implementation)

After all phases, the `createBabelCatalogue` function will return:

```javascript
{
  // Existing methods
  setSpineRotation, setTilt, setScale,
  setFrontHinge, setBackHinge,
  flipPages, resetPages,
  morphMaterial, glitch, toggleHover,
  getState, resize, dispose,
  bookGroup,
  
  // Phase 1 additions
  setGlowIntensity,           // 0.0 to 2.0
  setConfidenceScore,         // 0.0 to 1.0 (affects glow + particles)
  setParticleIntensity,       // 0.0 to 1.0
  enableParticles,            // boolean
  setPageContent,             // string
  setScrollSpeed,             // number (pixels per frame)
  enablePageContent,          // boolean
  updatePageContent,          // string[] (for streaming)
  
  // Phase 2 additions
  setAudioEnabled,            // boolean
  setMasterVolume,            // 0.0 to 1.0
  setHingeCreakVolume,        // 0.0 to 1.0
  setPageRustleVolume,        // 0.0 to 1.0
  setBabelHumVolume,          // 0.0 to 1.0
  setMaterialTexture,         // (type, url)
  setMaterialRoughness,      // number
  setMaterialMetalness,       // number
  
  // Phase 3 additions
  setGravityEnabled,         // boolean
  setSagAmount,               // 0.0 to 0.3
  setGravityStrength,         // number (multiplier)
  setPivotMode,               // 'spine' | 'center'
  getPivotMode                // () => 'spine' | 'center'
}
```

---

## Testing Strategy

### Unit Tests (Per Feature):
- Verify each new API method works correctly
- Test edge cases (extreme values, rapid changes)
- Verify state management (getState() returns correct values)

### Integration Tests:
- Test feature interactions (e.g., particles + glow + audio)
- Verify performance under load (2000 particles + scrolling text)
- Test browser compatibility (Chrome, Firefox, Safari)

### Performance Benchmarks:
- Target: 60fps with all features enabled
- Memory: Monitor for leaks during long sessions
- CPU: Profile audio synthesis overhead

### User Experience Tests:
- Verify signpost mapping feels natural
- Test with real LLM integration
- Gather feedback on audio/visual balance

---

## Notes & Considerations

- **Performance**: Some features (particles, vertex deformation) can be expensive. Consider feature flags for low-end devices.
- **Browser Compatibility**: Web Audio API and WebGL features vary. Add feature detection and fallbacks.
- **Accessibility**: Consider audio volume controls and visual-only modes for users with sensitivities.
- **Modularity**: Each phase should be independently toggleable via options to maintain reusability.
