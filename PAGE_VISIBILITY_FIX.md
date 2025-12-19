# Page Visibility Fix

## Problem
Pages appear as:
- **Black hole** when not transparent
- **Invisible** when transparent

## Root Cause Analysis

### Material Issues
1. **Opacity too low** - 0.3 or 0.6 makes pages nearly invisible
2. **Emissive intensity too high** - Can wash out the material color
3. **Missing DoubleSide** - Only one side would be visible

### Rendering Issues
1. **PlaneGeometry orientation** - Faces +Z by default
2. **Camera position** - At (6, 4, 10) looking at origin
3. **Depth write** - Can cause z-fighting with transparent objects

## Solution Applied

### 1. Exact Material Match to concept.html
```javascript
const pageMat = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,           // Cyan color
  transparent: true,
  opacity: 0.15,             // EXACT from concept.html
  side: THREE.DoubleSide,    // Render both front and back
  emissive: 0x00ffcc,        // For glow effects
  emissiveIntensity: 0,      // Start at 0 for visibility
});
```

### 2. No Rotation
Pages are NOT rotated - PlaneGeometry default orientation works correctly with DoubleSide

### 3. Exact Positioning
```javascript
// Pivot
pagePivot.position.set(0.06, 0, -0.25 + (i * 0.035));

// Mesh
pageMesh.position.x = 1.4;
```

### 4. Simplified Lighting
```javascript
// Match concept.html
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.PointLight(0x00ffcc, 1, 50);
light.position.set(5, 5, 5);
```

## Why Pages Were Not Visible

### Black Hole Effect
- **Cause**: Emissive intensity too high (> 0.3)
- **Effect**: Material appears to glow so bright it becomes opaque black
- **Fix**: Set emissiveIntensity to 0 initially

### Invisible When Transparent
- **Cause**: Opacity too low (0.6 with high emissive)
- **Effect**: Pages blend into background
- **Fix**: Use opacity 0.15 (concept.html value) with emissiveIntensity 0

## Testing

### Enable Debug Mode
1. Check "Debug Mode" in dev interface
2. Look for magenta wireframes on pages
3. Check console for page positions

### Adjust Opacity
Use "Page Transparency" slider:
- 0.15 = concept.html default (visible but transparent)
- 0.3-0.5 = more visible
- 1.0 = fully opaque

### Check Glow
Use "Glow Intensity" slider:
- 0 = no glow (pages use base color only)
- 0.5 = subtle glow
- 2.0 = maximum glow

## Verification Checklist

- [ ] Pages visible as cyan translucent planes
- [ ] Pages visible from all camera angles
- [ ] Pages don't appear as black holes
- [ ] Wireframes visible in debug mode
- [ ] Opacity slider changes page transparency
- [ ] Pages positioned between covers
- [ ] No z-fighting or flickering

## Common Issues

### Still Not Visible?
1. **Check camera position**: Should be at (6, 4, 10)
2. **Open covers**: Set Front/Back Cover sliders to ~1.57 (90°)
3. **Check opacity**: Must be > 0
4. **Enable debug mode**: See wireframes even if material invisible

### Black Appearance?
1. **Reduce glow intensity** to 0
2. **Check emissiveIntensity** - should be 0 initially
3. **Verify side**: Must be THREE.DoubleSide

### Flickering?
1. **Disable depthWrite**: `depthWrite: false` for transparent objects
2. **Check z positions**: Pages should be evenly spaced
3. **Transparent render order**: May need to set `renderOrder`

## Technical Details

### PlaneGeometry Orientation
- **Default**: Faces +Z direction (positive Z axis)
- **Normal**: Points toward +Z
- **DoubleSide**: Renders both +Z and -Z faces

### Camera View
- **Position**: (6, 4, 10) = positive Z
- **LookAt**: (0, 0, 0) = origin
- **View Direction**: From +Z toward origin (-Z direction)
- **Result**: Camera sees FRONT face of planes (which face +Z)

### Material Rendering
- **transparent: true**: Enables alpha blending
- **opacity: 0.15**: 15% opaque, 85% transparent
- **side: DoubleSide**: Both sides visible
- **emissive**: Self-illumination color
- **emissiveIntensity**: How much self-illumination (0 = none)

## Final Configuration

This configuration matches concept.html exactly and ensures pages are visible:

```javascript
// Material
opacity: 0.15
side: THREE.DoubleSide
emissiveIntensity: 0 (initially)

// Position
pivot: (0.06, 0, -0.25 + i*0.035)
mesh: (1.4, 0, 0) relative to pivot

// No rotation
rotation: (0, 0, 0)

// Lighting
Ambient: 0xffffff, intensity 0.8
Point: 0x00ffcc, intensity 1.0, distance 50
```

Pages should now be visible as cyan translucent surfaces between the book covers.

