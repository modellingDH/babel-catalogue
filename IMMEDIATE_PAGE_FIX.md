# Immediate Page Rendering Fix

## Try These Quick Fixes in Order

### Fix #1: Increase Opacity + Disable Depth Write

```javascript
// In babelCatalogue.js, line ~196
const pageMat = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,
  transparent: true,
  opacity: 0.5,  // CHANGE from 0.15 to 0.5
  side: THREE.DoubleSide,
  depthWrite: false,  // ADD THIS - critical for transparency
  emissive: 0x00ffcc,
  emissiveIntensity: 0,
});
```

### Fix #2: Add Renderer Configuration

```javascript
// In babelCatalogue.js, after renderer creation (~line 130)
renderer.sortObjects = true;  // ADD THIS
renderer.outputColorSpace = THREE.SRGBColorSpace;  // ADD THIS
```

### Fix #3: Set Render Order

```javascript
// In page creation loop (~line 270)
pageMesh.renderOrder = 1;  // ADD THIS after mesh creation

// For covers (~line 222, 235)
frontCover.renderOrder = 2;
backCover.renderOrder = 2;
```

### Fix #4: Force Page Visibility

```javascript
// Add this in the animation loop (~line 930)
pages.forEach(page => {
  page.visible = true;
  if (page.children[0]) page.children[0].visible = true;
});
```

### Fix #5: Add Debug Logging

```javascript
// Add after page creation (~line 300)
console.log('=== PAGE DEBUG ===');
console.log('Total pages:', pages.length);
console.log('Page 0:', {
  position: pages[0].position.toArray(),
  visible: pages[0].visible,
  children: pages[0].children.length
});
if (pageMeshes[0]) {
  console.log('Page mesh 0:', {
    position: pageMeshes[0].position.toArray(),
    visible: pageMeshes[0].visible,
    material: {
      opacity: pageMat.opacity,
      transparent: pageMat.transparent,
      side: pageMat.side,
      depthWrite: pageMat.depthWrite
    }
  });
}
```

## Test Procedure

1. Apply fixes above
2. Run `npm run dev`
3. Open http://localhost:3000/dev
4. Check browser console for debug output
5. Open covers (Front/Back sliders to 1.57)
6. Look for cyan pages

## Expected Console Output

```
=== PAGE DEBUG ===
Total pages: 15
Page 0: { position: [0.06, 0, -0.25], visible: true, children: 1 }
Page mesh 0: { 
  position: [1.4, 0, 0], 
  visible: true,
  material: { 
    opacity: 0.5, 
    transparent: true, 
    side: 2,  // DoubleSide
    depthWrite: false 
  }
}
```

## If Still Not Visible

Try increasing opacity even more:
```javascript
opacity: 0.8  // Very visible
```

Or change color to something obvious:
```javascript
color: 0xff0000  // Bright red - can't miss it!
```

