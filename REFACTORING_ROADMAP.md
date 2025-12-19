# Refactoring Roadmap

## Overview
Transform the 956-line monolithic `babelCatalogue.js` into a maintainable, modular architecture.

## Phase 1: Immediate Fixes (Week 1)

### Day 1-2: Critical Bug Fixes
- [x] Analyze current issues
- [ ] Fix page positioning (use concept.html formula)
- [ ] Add debug mode with visualization
- [ ] Fix particle blob distribution
- [ ] Add performance monitoring

**Deliverables:**
- Pages consistently visible
- Debug mode toggle in dev interface
- FPS counter
- Even particle distribution

### Day 3-4: Code Organization Prep
- [ ] Extract constants to separate file
- [ ] Document all functions with JSDoc
- [ ] Add TypeScript definitions file
- [ ] Create unit test structure

**Deliverables:**
- `constants.js` with all magic numbers
- `types.d.ts` with TypeScript definitions
- Test framework setup (Jest/Vitest)

### Day 5: Material Management
- [ ] Create `MaterialManager` class
- [ ] Refactor cover material syncing
- [ ] Add material presets system
- [ ] Test material updates

**Deliverables:**
- `MaterialManager.js` class
- Single source of truth for materials
- Preset system (leather, metal, glass, custom)

## Phase 2: Modularization (Week 2)

### Day 1-2: Geometry System
```
src/geometry/
  BookGeometry.js      - Main book structure
  SpineGeometry.js     - Spine creation/updates
  CoverGeometry.js     - Cover creation/updates
  PageGeometry.js      - Page creation/updates
  GeometryPool.js      - Reusable geometry instances
```

**Key Classes:**
```javascript
class BookGeometry {
  constructor(dimensions, pageCount)
  create()
  updateDimensions(newDimensions)
  dispose()
}

class GeometryPool {
  getPlane(width, height)
  getBox(width, height, depth)
  dispose()
}
```

### Day 3: Particle System
```
src/systems/
  ParticleSystem.js
  PoissonDiskSampler.js
  ParticlePool.js
```

**Key Classes:**
```javascript
class ParticleSystem {
  constructor(count, bounds)
  spawn(position)
  update(deltaTime)
  setIntensity(intensity)
  dispose()
}
```

### Day 4: Page Content System
```
src/systems/
  PageContentSystem.js
  TextRenderer.js
```

**Key Classes:**
```javascript
class PageContentSystem {
  constructor(canvas, texture)
  setContent(text)
  setScrollSpeed(speed)
  update(deltaTime)
  dispose()
}
```

### Day 5: Animation Controller
```
src/animation/
  AnimationController.js
  TweenManager.js
```

**Key Classes:**
```javascript
class AnimationController {
  constructor()
  registerTween(name, tween)
  update(time)
  pause()
  resume()
  dispose()
}
```

## Phase 3: State Management (Week 3)

### Day 1-2: State System
```
src/state/
  BookState.js
  StateManager.js
  DirtyFlags.js
```

**Key Classes:**
```javascript
class BookState {
  constructor()
  markDirty(system)
  isDirty(system)
  clearDirty()
  getSnapshot()
  restore(snapshot)
}

class StateManager {
  constructor()
  subscribe(callback)
  unsubscribe(callback)
  setState(updates)
  getState()
}
```

### Day 3: Event System
```
src/events/
  EventEmitter.js
  EventBus.js
```

**Key Classes:**
```javascript
class EventEmitter {
  on(event, callback)
  off(event, callback)
  emit(event, data)
  once(event, callback)
}
```

### Day 4-5: Refactor Main File
- [ ] Integrate all new modules
- [ ] Reduce main file to < 200 lines
- [ ] Update API to use new systems
- [ ] Comprehensive testing

**Target Structure:**
```javascript
export function createBabelCatalogue(options = {}) {
  // Setup (20 lines)
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  const camera = new THREE.PerspectiveCamera();
  
  // Initialize systems (30 lines)
  const geometry = new BookGeometry(options.dimensions, options.pageCount);
  const materials = new MaterialManager();
  const particles = new ParticleSystem(options.particleCount, bounds);
  const pageContent = new PageContentSystem(canvas, texture);
  const animator = new AnimationController();
  const state = new StateManager();
  
  // Create book (20 lines)
  geometry.create();
  scene.add(geometry.bookGroup);
  
  // Setup controls (20 lines)
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // Animation loop (30 lines)
  const animate = (time) => {
    animator.update(time);
    if (state.isDirty('geometry')) geometry.update();
    if (state.isDirty('materials')) materials.update();
    particles.update(deltaTime);
    pageContent.update(deltaTime);
    renderer.render(scene, camera);
  };
  
  // Public API (50 lines)
  return {
    setDimensions: (dims) => geometry.updateDimensions(dims),
    setCoverColor: (color) => materials.setCoverColor(color),
    // ... other methods
    dispose: () => {
      geometry.dispose();
      materials.dispose();
      particles.dispose();
      pageContent.dispose();
      animator.dispose();
    }
  };
}
```

## Phase 4: Performance Optimization (Week 4)

### Day 1: Profiling
- [ ] Add performance markers
- [ ] Profile animation loop
- [ ] Identify bottlenecks
- [ ] Create optimization plan

### Day 2: Geometry Optimization
- [ ] Implement geometry pooling
- [ ] Add LOD (Level of Detail) system
- [ ] Optimize vertex updates
- [ ] Test performance gains

### Day 3: Rendering Optimization
- [ ] Implement frustum culling
- [ ] Add occlusion culling
- [ ] Optimize material updates
- [ ] Test rendering performance

### Day 4: Particle Optimization
- [ ] Implement spatial hashing
- [ ] Add particle pooling
- [ ] Optimize update loop
- [ ] Test particle performance

### Day 5: Final Optimization
- [ ] Implement dirty flag system
- [ ] Add frame budget management
- [ ] Optimize memory usage
- [ ] Comprehensive performance testing

## Phase 5: Testing & Documentation (Week 5)

### Day 1-2: Unit Tests
```
tests/
  unit/
    BookGeometry.test.js
    MaterialManager.test.js
    ParticleSystem.test.js
    PageContentSystem.test.js
    AnimationController.test.js
```

**Target Coverage:** > 80%

### Day 3: Integration Tests
```
tests/
  integration/
    book-creation.test.js
    dimension-updates.test.js
    material-changes.test.js
    animation-flow.test.js
```

### Day 4: Visual Regression Tests
```
tests/
  visual/
    book-rendering.test.js
    particle-distribution.test.js
    page-flipping.test.js
```

### Day 5: Documentation
- [ ] Update README with new architecture
- [ ] Create API documentation
- [ ] Write migration guide
- [ ] Create example gallery

## Success Metrics

### Code Quality
- [ ] Main file < 200 lines
- [ ] Average file < 150 lines
- [ ] Test coverage > 80%
- [ ] No circular dependencies
- [ ] TypeScript definitions complete

### Performance
- [ ] 60 FPS with 2000 particles
- [ ] < 100ms initialization time
- [ ] < 50ms dimension update time
- [ ] < 16ms per frame (animation loop)

### Reliability
- [ ] Pages visible 100% of time
- [ ] No memory leaks (24hr test)
- [ ] No console errors/warnings
- [ ] Graceful degradation on low-end devices

### Developer Experience
- [ ] New feature < 1 day to implement
- [ ] Bug fix < 2 hours to resolve
- [ ] Clear error messages
- [ ] Hot reload works reliably

## Risk Mitigation

### High Risk: Breaking Changes
- Maintain backward compatibility layer
- Feature flags for new code paths
- Gradual migration strategy
- Comprehensive testing before merge

### Medium Risk: Performance Regression
- Benchmark before/after each phase
- Profile continuously
- Rollback plan for each optimization
- A/B testing in production

### Low Risk: API Changes
- Deprecation warnings
- Migration guide
- Version compatibility matrix
- Support old API for 2 releases

## Rollback Strategy

Each phase has a rollback point:
- Phase 1: Keep old positioning code commented
- Phase 2: Feature flag for new modules
- Phase 3: State system optional
- Phase 4: Optimizations toggleable
- Phase 5: Tests don't block release

## Timeline Summary

- **Week 1:** Critical fixes + prep (5 days)
- **Week 2:** Modularization (5 days)
- **Week 3:** State management (5 days)
- **Week 4:** Performance optimization (5 days)
- **Week 5:** Testing + documentation (5 days)

**Total:** 5 weeks (25 working days)

## Next Steps

1. Review and approve this roadmap
2. Set up project tracking (GitHub Projects/Jira)
3. Create feature branches for each phase
4. Start with Phase 1, Day 1 tasks
5. Daily standups to track progress

