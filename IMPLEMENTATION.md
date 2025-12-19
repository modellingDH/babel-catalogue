# Implementation Strategy: Enhanced Babel Catalogue

## Requirements Analysis

### 1. Pages Visibility Issue
**Problem**: Pages are not visible
**Root Cause Analysis**:
- Pages use `MeshPhysicalMaterial` with opacity 0.6
- Pages are rotated `Math.PI / 2` which may cause them to face away from camera
- In concept.html, pages don't have rotation - they're positioned directly
- Need to check if pages are behind covers or facing wrong direction

**Solution**:
- Remove page rotation (match concept.html)
- Ensure pages are visible with proper opacity
- Verify page positioning relative to camera

### 2. Gesture Controls
**Requirements**:
- Zoom in/out (mouse wheel, pinch gesture)
- Rotate spine in different directions (mouse drag, touch drag)

**Implementation Strategy**:
- Use OrbitControls from three.js for camera manipulation
- Or implement custom gesture handlers
- Track mouse/touch events on canvas
- Update camera position/rotation based on gestures

### 3. Particle Occlusion
**Requirement**: Particles should not be visible behind non-transparent covers

**Implementation Strategy**:
- Check cover material transparency
- Use raycasting or bounding box checks
- Hide particles that are behind covers (z-position check)
- Only show particles when covers are open AND transparent

### 4. Single Page Flip
**Requirement**: Flip one page at a time instead of all pages

**Implementation Strategy**:
- Add `flipSinglePage(index, direction)` method
- Track which pages have been flipped
- Animate only the specified page
- Update page state tracking

### 5. Cover Text Controls
**Requirement**: Add text to front and back covers

**Implementation Strategy**:
- Create canvas textures for front and back covers
- Add `setFrontCoverText(text)` and `setBackCoverText(text)` methods
- Render text on canvas, apply as texture to covers
- Support font size, color, position customization

### 6. Book Dimensions
**Requirement**: Control book size (height, width, depth/thickness)

**Implementation Strategy**:
- Add `setBookDimensions({ height, width, depth })` method
- Update all geometry (spine, covers, pages) based on dimensions
- Maintain proportions and relationships
- Recreate geometries when dimensions change

## Implementation Order

1. **Fix Pages Visibility** (Critical - blocks testing)
2. **Book Dimensions** (Foundation - affects all geometry)
3. **Cover Text** (Visual enhancement)
4. **Single Page Flip** (Interaction improvement)
5. **Gesture Controls** (UX enhancement)
6. **Particle Occlusion** (Visual polish)

## Technical Considerations

- **Performance**: Book dimension changes require geometry recreation - use object pooling or efficient updates
- **Gestures**: Use OrbitControls for reliable camera control
- **Particle Occlusion**: Use spatial queries or simple z-depth checks
- **Cover Text**: Canvas textures need proper sizing and UV mapping

