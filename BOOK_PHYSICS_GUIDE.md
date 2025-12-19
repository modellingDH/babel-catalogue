# Book Physics Guide

## Correct Physical Model

### Spine (The Container)
```
Position: (0, 0, 0) - centered at origin
Dimensions:
  - Width: 0.1 (x: -0.05 to +0.05)
  - Depth: 0.6 (z: -0.3 to +0.3)
  - Height: 4 (y: -2 to +2)

The spine is the CONTAINER that holds everything.
```

### Covers (The Doors)
```
Front Cover:
  Pivot: (0.05, 0, 0.3)  [RIGHT edge of spine, FRONT face]
  Mesh Position: (width/2, 0, 0) [extends outward from pivot]
  Rotation: -hinge (negative = opens forward)

Back Cover:
  Pivot: (0.05, 0, -0.3) [RIGHT edge of spine, BACK face]
  Mesh Position: (width/2, 0, 0) [extends outward from pivot]
  Rotation: +hinge (positive = opens backward)

Covers are HINGED at spine edges, like real book covers.
```

### Pages (The Content)
```
Back Pages Group:
  Position: (0.05, 0, -0.3) [at back cover pivot]
  Rotation: +backHinge [rotates WITH back cover]
  Pages within: distributed from z=-0.3 to z=0

Front Pages Group:
  Position: (0.05, 0, 0.3) [at front cover pivot]
  Rotation: -frontHinge [rotates WITH front cover]
  Pages within: distributed from z=0 to z=0.3

Pages are ATTACHED to covers and move with them.
Each page starts at x=0.06 (just inside spine edge).
```

## Physics Relationships

### 1. Spine Defines Space
```
Spine depth = 0.6
Cover separation = spine depth = 0.6

Front cover pivot: z = +spineDepth/2 = +0.3
Back cover pivot:  z = -spineDepth/2 = -0.3
```

### 2. Covers Pivot at Edges
```
Spine width = 0.1
Spine right edge = +0.05
Both cover pivots at x = +0.05 (spine edge)

Cover extends: x = pivot + width/2
```

### 3. Pages Inside Covers
```
Pages start: x = 0.06 (just inside spine)
Pages distribute: within spine depth (±0.3)

Back pages: z from -0.3 (back edge) toward 0 (center)
Front pages: z from 0 (center) toward +0.3 (front edge)
```

## Coordinate System

```
      Y (up)
      |
      |
      +---- X (right)
     /
    Z (forward/toward you)

Spine centered at origin (0,0,0)

    -X          0          +X
     |          |          |
     |   SPINE  |  COVERS →
     |  (0.1)   |  extend
     |          |
   -0.05       0.05

Front cover at Z = +0.3 (toward you)
Back cover at Z = -0.3 (away from you)
```

## Real Book Physics

### Closed Book
```
[Back Cover][SPINE][Front Cover]
     ||||    [0.1]    ||||
   Closed    0.6    Closed
   
All pages hidden inside spine depth.
```

### Open Book (90°)
```
[Back]              [SPINE]              [Front]
   |                  0.1                   |
   |← pages      CENTER (0,0,0)      pages →|
   |            (depth: 0.6)                |
```

### Key Principles

1. **Spine is Fixed**
   - Never moves or changes size
   - Acts as anchor point for everything

2. **Covers Pivot at Edges**
   - Hinges at spine boundary
   - Open outward from spine
   - Like real book binding

3. **Pages Move with Covers**
   - Attached to their respective cover
   - Rotate as a group with cover
   - Stay inside book depth

4. **Depth Determines Separation**
   - Cover separation = spine depth
   - More depth = wider separation
   - Pages fill the space between

## Common Issues Fixed

### ❌ Problem: Pages Outside Book
```
Cause: Pages positioned at pivot without offset
Fix: Start pages at x = 0.06 (inside spine edge)
```

### ❌ Problem: Covers Not Aligned with Spine
```
Cause: Hardcoded positions don't match spine
Fix: Calculate pivot from spine dimensions
     pivot = (spineWidth/2, 0, ±spineDepth/2)
```

### ❌ Problem: Pages Don't Move with Covers
```
Cause: Pages in separate static groups
Fix: Page groups at same position with same rotation as covers
```

### ❌ Problem: Spine Too Small
```
Cause: Spine depth (0.02) vs cover separation (0.6)
Fix: Use proper spine depth = 0.6 consistently
```

## Validation Checklist

✅ **Spine**
- [ ] Centered at origin
- [ ] Width = 0.1
- [ ] Depth = 0.6
- [ ] Visible when covers open

✅ **Covers**
- [ ] Pivot at (±spineWidth/2, 0, ±spineDepth/2)
- [ ] Extend outward from pivot
- [ ] Front opens forward (negative rotation)
- [ ] Back opens backward (positive rotation)

✅ **Pages**
- [ ] Groups positioned at cover pivots
- [ ] Groups rotate with covers
- [ ] Individual pages inside spine depth
- [ ] Pages visible only when covers open

✅ **Physics**
- [ ] Cover separation = spine depth
- [ ] Pages stay within bounds
- [ ] Everything moves naturally
- [ ] Looks like real book

## Debug Tips

### Enable Debug Mode
Shows:
- Axes (RGB = XYZ)
- Grid (ground plane)
- Info overlay (counts, dimensions)

### Check Positions
```javascript
// In debug mode, should see:
Spine: 0.1 × 0.6
Back Pages: currentPage
Front Pages: pageCount - currentPage
Cover Width: dimensions.width
```

### Visual Inspection
1. **Closed**: Pages hidden
2. **Half Open**: Pages visible inside
3. **Fully Open**: Pages spread between covers
4. **No Overflow**: Pages never outside covers

## Summary

The book is now a proper physical object:
- **Spine** = container (fixed size)
- **Covers** = doors (hinged at edges)
- **Pages** = content (inside, attached to covers)

Everything follows real book physics! 📖✨

