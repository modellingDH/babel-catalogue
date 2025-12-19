# Quick Fixes - Immediate Actions

## Priority 1: Fix Page Rendering (TODAY)

### Issue
Pages are not consistently visible due to positioning mismatch with working `concept.html`.

### Root Cause
```javascript
// concept.html (WORKS) - Fixed positioning
pPiv.position.set(0.06, 0, -0.25 + (i * 0.035));

// babelCatalogue.js (BROKEN) - Dynamic calculation
const zOffset = -bookDepth / 2 + (i + 0.5) * pageThickness;
pagePivot.position.set(0.06, 0, zOffset);
```

When `bookDepth = 0.7` and `pageCount = 15`:
- `pageThickness = 0.7 / 15 = 0.0467`
- First page z: `-0.35 + 0.5 * 0.0467 = -0.327` ❌
- Should be: `-0.25` ✅

### Fix
```javascript
// Use concept.html's proven formula
for (let i = 0; i < pageCount; i++) {
  const pagePivot = new THREE.Group();
  // FIXED: Match concept.html exactly
  const zOffset = -0.25 + (i * 0.035);
  pagePivot.position.set(0.06, 0, zOffset);
  // ... rest of page creation
}
```

### Alternative: Scale-aware positioning
```javascript
// If you need dynamic depth support
const baseZ = -0.25;
const spacing = 0.035;
const scaleFactor = bookDepth / 0.7; // 0.7 is concept.html depth
const zOffset = baseZ * scaleFactor + (i * spacing * scaleFactor);
```

## Priority 2: Add Debug Mode (TODAY)

### Implementation
```javascript
// Add to options
const DEBUG = options.debug || false;

if (DEBUG) {
  // Add axes helper to scene
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  // Add grid helper
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
  
  // Log page positions
  pages.forEach((page, i) => {
    console.log(`Page ${i}:`, {
      pivot: page.position.toArray(),
      mesh: page.children[0].position.toArray(),
      rotation: page.rotation.toArray()
    });
    
    // Add wireframe to each page
    const wireframe = new THREE.WireframeGeometry(page.children[0].geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.color.set(0xff0000);
    page.children[0].add(line);
  });
  
  // Add camera position indicator
  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);
}
```

## Priority 3: Material Sync Fix (TODAY)

### Issue
Three separate cover materials that must be manually synced.

### Quick Fix
```javascript
// Create a proxy that syncs all three
const createSyncedCoverMaterial = (baseMat) => {
  const materials = [coverMat, frontCoverMat, backCoverMat];
  
  return new Proxy(baseMat, {
    set(target, prop, value) {
      materials.forEach(mat => {
        if (prop in mat) mat[prop] = value;
      });
      return true;
    }
  });
};

// Usage
syncedCoverMat.color.set(0xff0000); // Updates all three
```

## Priority 4: Particle Distribution Fix (TODAY)

### Issue
Particles cluster in a blob at spawn.

### Fix
```javascript
// Use Poisson disk sampling for even distribution
class PoissonDiskSampler {
  constructor(width, height, depth, minDistance) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.minDistance = minDistance;
    this.cellSize = minDistance / Math.sqrt(3);
    this.grid = new Map();
    this.active = [];
  }
  
  sample(count) {
    const points = [];
    // Add first random point
    const first = this.randomPoint();
    this.addPoint(first);
    
    while (this.active.length > 0 && points.length < count) {
      const idx = Math.floor(Math.random() * this.active.length);
      const point = this.active[idx];
      
      let found = false;
      for (let i = 0; i < 30; i++) {
        const newPoint = this.randomAround(point);
        if (this.isValid(newPoint)) {
          this.addPoint(newPoint);
          points.push(newPoint);
          found = true;
          break;
        }
      }
      
      if (!found) {
        this.active.splice(idx, 1);
      }
    }
    
    return points;
  }
  
  randomPoint() {
    return {
      x: (Math.random() - 0.5) * this.width,
      y: (Math.random() - 0.5) * this.height,
      z: (Math.random() - 0.5) * this.depth
    };
  }
  
  randomAround(point) {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.minDistance * (1 + Math.random());
    return {
      x: point.x + Math.cos(angle) * radius,
      y: point.y + Math.sin(angle) * radius,
      z: point.z + (Math.random() - 0.5) * this.minDistance
    };
  }
  
  isValid(point) {
    if (Math.abs(point.x) > this.width / 2) return false;
    if (Math.abs(point.y) > this.height / 2) return false;
    if (Math.abs(point.z) > this.depth / 2) return false;
    
    const cellX = Math.floor((point.x + this.width / 2) / this.cellSize);
    const cellY = Math.floor((point.y + this.height / 2) / this.cellSize);
    const cellZ = Math.floor((point.z + this.depth / 2) / this.cellSize);
    
    // Check neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${cellX + dx},${cellY + dy},${cellZ + dz}`;
          const neighbor = this.grid.get(key);
          if (neighbor) {
            const dist = Math.sqrt(
              Math.pow(point.x - neighbor.x, 2) +
              Math.pow(point.y - neighbor.y, 2) +
              Math.pow(point.z - neighbor.z, 2)
            );
            if (dist < this.minDistance) return false;
          }
        }
      }
    }
    
    return true;
  }
  
  addPoint(point) {
    const cellX = Math.floor((point.x + this.width / 2) / this.cellSize);
    const cellY = Math.floor((point.y + this.height / 2) / this.cellSize);
    const cellZ = Math.floor((point.z + this.depth / 2) / this.cellSize);
    const key = `${cellX},${cellY},${cellZ}`;
    this.grid.set(key, point);
    this.active.push(point);
  }
}

// Usage in particle initialization
const sampler = new PoissonDiskSampler(
  bookWidth * 0.8,
  bookHeight * 0.5,
  bookDepth * 0.5,
  0.1 // minimum distance between particles
);

const positions = sampler.sample(particleCount);
positions.forEach((pos, i) => {
  const i3 = i * 3;
  posArray[i3] = pos.x;
  posArray[i3 + 1] = pos.y - bookHeight / 4; // Offset to base
  posArray[i3 + 2] = pos.z;
});
```

## Priority 5: Performance Monitoring (TODAY)

### Add FPS Counter
```javascript
class PerformanceMonitor {
  constructor() {
    this.frames = [];
    this.lastTime = performance.now();
  }
  
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    this.frames.push(delta);
    if (this.frames.length > 60) this.frames.shift();
    
    const avgDelta = this.frames.reduce((a, b) => a + b) / this.frames.length;
    const fps = 1000 / avgDelta;
    
    if (fps < 50) {
      console.warn(`Low FPS: ${fps.toFixed(1)}`);
    }
    
    return fps;
  }
}

// Usage in animation loop
const perfMonitor = new PerformanceMonitor();

const animate = (time) => {
  const fps = perfMonitor.update();
  
  if (DEBUG) {
    // Update FPS display
    document.getElementById('fps').textContent = fps.toFixed(1);
  }
  
  // ... rest of animation loop
};
```

## Testing Checklist

After applying fixes, verify:

- [ ] Pages are visible from default camera position
- [ ] Pages maintain visibility when rotating book
- [ ] Particles are evenly distributed (no blob)
- [ ] FPS stays above 55 on target hardware
- [ ] Cover color changes update all covers
- [ ] Book dimensions update correctly
- [ ] No console errors or warnings

## Rollback Plan

If fixes cause issues:

1. Keep `concept.html` as reference implementation
2. Use feature flags for new code paths
3. Add A/B testing capability
4. Maintain old code commented out for 1 week

```javascript
const USE_NEW_POSITIONING = options.experimental?.newPositioning ?? false;

if (USE_NEW_POSITIONING) {
  // New fixed positioning
} else {
  // Old dynamic positioning (fallback)
}
```

