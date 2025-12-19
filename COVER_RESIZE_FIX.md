# Cover Resize Fix - Anchored to Spine

## Problem
When resizing book width, covers were moving away from the spine because they were positioned at a fixed value (x = 1.5) instead of being dynamically calculated based on book width.

## Solution

### Understanding BoxGeometry Centering
Three.js `BoxGeometry` is **centered at its origin**. For a box with width W:
- Left edge: `-W/2`
- Center: `0`
- Right edge: `+W/2`

### The Fix

#### Initial Setup (covers anchored)
```javascript
// Pivot at spine edge (NEVER changes)
frontPivot.position.set(0.05, 0, 0.3);

// Cover mesh positioned so LEFT EDGE is at pivot (spine)
frontCover.position.x = bookWidth / 2;
```

**Why `bookWidth / 2`?**
- BoxGeometry center is at origin
- Left edge is at `-bookWidth/2` relative to center
- To align left edge with pivot (x=0), shift by `+bookWidth/2`
- Result: Left edge at x=0 (spine), right edge at x=bookWidth (free edge)

#### When Resizing
```javascript
setBookDimensions({ width: newWidth }) {
  // Update geometry with new width
  frontCover.geometry = new THREE.BoxGeometry(newWidth, bookHeight, coverThickness);
  
  // Update position to keep left edge at spine
  frontCover.position.x = newWidth / 2;
  
  // Pivot NEVER moves - stays at (0.05, 0, 0.3)
}
```

### Visual Diagram

#### Before (WRONG - fixed position):
```
Spine at 0.05
|
v
[S]-------[Cover at x=1.5]-------
   
When width = 2.0: [S]---[C]--- (gap!)
When width = 4.0: [S]---[C]--- (gap!)
```

#### After (CORRECT - dynamic position):
```
Spine at 0.05
|
v
[S][Cover from 0 to bookWidth]
   ^                          ^
   Left edge (anchored)       Right edge (grows)

When width = 2.0: [S][Cover 2.0 wide]
When width = 4.0: [S][Cover 4.0 wide]
```

## Code Changes

### 1. Initial Cover Creation
```javascript
// Line 217-237
frontCover.position.x = bookWidth / 2;  // Was: 1.5
backCover.position.x = bookWidth / 2;   // Was: 1.5
```

### 2. Resize Function
```javascript
// Line 561-571
frontCover.geometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
frontCover.position.x = bookWidth / 2;  // NEW: Update position

backCover.geometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
backCover.position.x = bookWidth / 2;   // NEW: Update position
```

## Testing

### Test Procedure
1. Open dev interface: `npm run dev`
2. Set Book Width to different values:
   - 1.0 (narrow)
   - 3.0 (default)
   - 6.0 (wide)
3. Verify covers stay attached to spine

### Expected Behavior
```
Width = 1.0:  [S][C]
Width = 3.0:  [S][Cover]
Width = 6.0:  [S][---Cover---]
```

**Spine edge NEVER moves, only free edge extends**

### Verification Points
- ✅ Pivot position stays at (0.05, 0, ±0.3)
- ✅ Cover left edge always at x=0 (relative to pivot)
- ✅ Cover right edge at x=bookWidth (relative to pivot)
- ✅ No gap between spine and covers
- ✅ Covers rotate correctly around spine hinge

## Why Concept.html Used 1.5

In `concept.html`:
```javascript
const bookWidth = 3;  // Fixed width
fMesh.position.x = 1.5;  // = bookWidth / 2
```

This works because the width is **hardcoded at 3.0**. 

When we made width **dynamic**, we need to calculate `bookWidth / 2` instead of using a magic number.

## Math Explanation

### Goal
Keep left edge of cover at x=0 (relative to pivot)

### Given
- BoxGeometry width = W
- Center at origin (0, 0, 0)
- Left edge at x = -W/2
- Right edge at x = +W/2

### Calculation
To move left edge from -W/2 to 0:
```
Target position = 0
Current left edge = -W/2
Offset needed = 0 - (-W/2) = +W/2
```

Therefore: `cover.position.x = W/2 = bookWidth/2`

### Verification
With `position.x = bookWidth/2`:
- Left edge: `bookWidth/2 + (-bookWidth/2)` = 0 ✅
- Right edge: `bookWidth/2 + (bookWidth/2)` = bookWidth ✅

## Alternative Approaches Considered

### Option 1: Move Pivot (❌ WRONG)
```javascript
frontPivot.position.x = 0.05 + bookWidth/2;  // BAD!
frontCover.position.x = 0;
```
**Problem**: Hinge moves, breaks rotation axis

### Option 2: Asymmetric Geometry (❌ COMPLEX)
```javascript
// Create custom geometry with left edge at origin
// Too complex, not worth it
```

### Option 3: Dynamic Position (✅ CHOSEN)
```javascript
frontPivot.position.x = 0.05;  // Fixed hinge
frontCover.position.x = bookWidth/2;  // Dynamic offset
```
**Advantage**: Simple, clean, mathematically correct

## Impact on Other Features

### Hinge Rotation ✅
Still works - pivot is the rotation axis

### Cover Text ✅
Texture mapping unaffected by position

### Particles ✅
Occlusion logic uses cover dimensions, not position

### Debug Mode ✅
Wireframes show correct geometry

## Files Modified

1. **babelCatalogue.js**:
   - Line 224: `frontCover.position.x = bookWidth / 2;`
   - Line 235: `backCover.position.x = bookWidth / 2;`
   - Line 564: Added `frontCover.position.x = bookWidth / 2;` in setBookDimensions
   - Line 570: Added `backCover.position.x = bookWidth / 2;` in setBookDimensions

## Summary

**Before**: Covers at fixed position (1.5), created gap when width changed  
**After**: Covers at dynamic position (bookWidth/2), left edge always anchored to spine  

The fix ensures the **spine acts as a true hinge** - it never moves, and only the free edge of the covers extends when width increases.

