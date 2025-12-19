# Test Plan: Page Visibility Fix

## Critical Fix Applied

### Issue
- Pages not visible (appeared as black hole or completely invisible)

### Root Cause
1. **EmissiveIntensity too high**: Made pages appear as glowing black holes
2. **Opacity settings**: Interaction between opacity and emissive washed out pages
3. **Missing baseline**: No "safe" starting point for visibility

### Solution
```javascript
// Material configuration
opacity: 0.15              // Exact concept.html value
emissiveIntensity: 0       // Start at 0 (no glow)
side: THREE.DoubleSide     // Both sides visible
```

---

## Test Procedure

### Step 1: Start Dev Server
```bash
cd "/Users/apa224/Code/babel catalogue"
npm run dev
```

Expected: Server starts on http://localhost:3000

---

### Step 2: Open Dev Interface
Navigate to: http://localhost:3000/dev

Expected:
- 3D book visible in center
- Controls panel on right side
- FPS counter at top

---

### Step 3: Enable Debug Mode
✅ Check: "Debug Mode (wireframes, axes, logging)"

Expected:
- Magenta wireframes appear on pages
- Axes helpers visible (RGB = XYZ)
- Console logs page positions
- Grid helper on floor

---

### Step 4: Open Book Covers
Adjust sliders:
- **Front Cover**: 1.57 (90 degrees)
- **Back Cover**: 1.57 (90 degrees)

Expected:
- Front cover swings open (rotates forward)
- Back cover swings open (rotates backward)
- Interior of book now visible

---

### Step 5: Test Page Opacity
**Page Opacity slider**: Start at 0.15

Try these values:
- **0.15**: Barely visible (concept.html default)
- **0.30**: Translucent, more visible
- **0.50**: Semi-transparent, clearly visible
- **0.75**: Mostly opaque
- **1.00**: Fully opaque

Expected:
- At 0.15: Faint cyan pages visible
- At 0.50: Clear cyan translucent pages
- At 1.00: Solid cyan pages
- **NO BLACK HOLES at any value**

---

### Step 6: Test Glow Intensity
**Glow Intensity slider**: Start at 0

Try these values:
- **0.0**: No glow (base color only)
- **0.5**: Subtle glow
- **1.0**: Medium glow
- **2.0**: Strong glow

Expected:
- At 0: Pages visible with normal cyan color
- At 0.5: Pages glow slightly
- At 1.0: Pages emit more light
- At 2.0: Pages brightly glowing
- **Pages remain VISIBLE at all glow levels**

---

### Step 7: Verify Page Positioning
With Debug Mode enabled, check console:

Expected output:
```
Page 0: { pivot: [0.06, 0, -0.25], mesh: [1.4, 0, 0], zOffset: -0.250 }
Page 1: { pivot: [0.06, 0, -0.215], mesh: [1.4, 0, 0], zOffset: -0.215 }
...
Page 14: { pivot: [0.06, 0, 0.24], mesh: [1.4, 0, 0], zOffset: 0.240 }
```

Verify:
- Pivot X always 0.06
- Pivot Y always 0
- Pivot Z increments by 0.035
- Mesh X always 1.4

---

### Step 8: Test Camera Views
Use mouse/trackpad:
- **Rotate**: Left-click + drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click + drag (or two-finger drag)

View from:
- **Front** (positive Z)
- **Back** (negative Z)
- **Top** (positive Y)
- **Side** (positive X)

Expected:
- Pages visible from front AND back (DoubleSide)
- Pages appear as planes between covers
- No culling or disappearing

---

### Step 9: Test Page Color
**Page Color**: Try different colors
- Default: #00ffcc (cyan)
- Try: #ff0000 (red)
- Try: #00ff00 (green)
- Try: #ffffff (white)

Expected:
- Page color changes immediately
- Emissive color matches base color
- Transparency maintained

---

### Step 10: Test Interaction with Other Features

#### Particles
Enable particles, adjust intensity:
Expected: Particles appear, pages still visible

#### Confidence Score
Adjust confidence slider:
Expected: Glow may increase, pages remain visible

#### Book Dimensions
Change height/width/depth:
Expected: Pages scale/reposition, remain visible

---

## Success Criteria

### ✅ PASS if ALL of these are true:
1. Pages visible as cyan translucent planes
2. No black hole effect at any opacity
3. No invisibility at default settings (0.15 opacity, 0 glow)
4. Wireframes visible in debug mode
5. Pages visible from all camera angles
6. Opacity slider smoothly changes transparency
7. Glow slider affects brightness without hiding pages
8. Pages positioned between open covers
9. Console logs show correct positions
10. No z-fighting or flickering

### ❌ FAIL if ANY of these occur:
1. Pages completely invisible
2. Pages appear as black holes
3. Pages disappear when changing opacity
4. Pages disappear when changing glow
5. Wireframes not visible in debug mode
6. Pages only visible from one side
7. Pages positioned incorrectly
8. Console errors or warnings
9. Severe z-fighting
10. Pages behind covers when closed

---

## Troubleshooting

### Pages Still Invisible?

**Check Material:**
```javascript
// In browser console
const pages = document.querySelector('canvas');
// Look for pageMat in Three.js devtools
```

**Verify:**
- opacity: 0.15
- transparent: true
- side: THREE.DoubleSide
- emissiveIntensity: 0

**Fix:** Restart dev server

---

### Black Hole Still Appearing?

**Check Glow:**
- Set Glow Intensity to 0
- Set Page Opacity to 0.5
- Check console for errors

**If persists:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R)
- Restart dev server

---

### Pages Flickering?

**Possible Causes:**
- Z-fighting between pages
- Depth write conflict
- Render order issue

**Fix:**
```javascript
// In babelCatalogue.js
pageMat.depthWrite = false;
pageMat.renderOrder = 1;
```

---

## Expected Visual Result

### With covers CLOSED:
```
[Front Cover] [PAGES HIDDEN] [Back Cover]
```

### With covers OPEN (90°):
```
[Front Cover →]  [PAGES VISIBLE]  [← Back Cover]
                    |||||||
                  cyan planes
```

### Debug Mode ON:
```
[Front Cover →]  [PAGES WITH WIREFRAMES]  [← Back Cover]
                    |||||||
                  magenta lines
                  + RGB axes
```

---

## Performance Metrics

Expected FPS:
- **60 FPS**: Good (no issues)
- **30-60 FPS**: Acceptable (minor lag)
- **< 30 FPS**: Poor (optimization needed)

Monitor:
- FPS counter (top of dev interface)
- Frame time (ms per frame)
- Browser DevTools performance tab

---

## Files Changed

1. **babelCatalogue.js**:
   - Line 201-208: Page material with opacity 0.15, emissiveIntensity 0
   - Line 269-275: No page rotation

2. **pages/dev.js**:
   - Line 246-263: Enhanced Glow Intensity control with hints
   - Line 460-473: Enhanced Page Opacity control with hints

3. **PAGE_VISIBILITY_FIX.md**: New documentation

4. **TEST_PAGE_VISIBILITY.md**: This test plan

---

## Sign-Off

Test completed by: __________  
Date: __________  
Result: [ ] PASS  [ ] FAIL  
Notes: _________________________________

