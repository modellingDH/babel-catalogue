# Babel Catalogue - Animated Actions

All animated book actions have been implemented! 🎉

## 📖 Core Book Actions

### `openBook(duration?: number)`
Smoothly opens both covers to 90 degrees (π/2 radians).
- **Duration**: Default 1000ms (1 second)
- **Animation**: Eases in/out with cubic easing
- **Side effects**: 
  - Increases particle intensity to 0.7
  - Smooth cover movement

### `closeBook(duration?: number)`
Smoothly closes both covers to 0 degrees.
- **Duration**: Default 1000ms (1 second)
- **Animation**: Eases in/out with cubic easing
- **Side effects**:
  - Decreases particle intensity to 0
  - Resets glow intensity to 0

### `flipPages(count: number, direction: 'forward' | 'backward', duration?: number)`
Flips multiple pages with staggered timing.
- **Count**: Number of pages to flip
- **Direction**: 'forward' or 'backward'
- **Duration**: Delay between each flip (default 50ms)
- **Effect**: Creates a natural page-turning animation

---

## 🎭 Emotional States (README Concept)

Based on the "External Observer" concept from the README, these actions represent AI cognitive states:

### `triggerEmotion('focus')`
**AI State**: Providing critical insight or high-confidence answer
- Book rises and zooms toward center
- Scale: → 1.3
- Tilt: → 0 (straight)
- Glow: → 1.5 (bright)
- Particles: → 1.0 (maximum)
- Duration: 800ms

### `triggerEmotion('drift')`
**AI State**: Processing irrelevant data, "daydreaming"
- Book tilts and descends into periphery
- Scale: → 0.7 (smaller)
- Tilt: → -0.5 (tilted down)
- Glow: → 0.2 (dim)
- Particles: → 0.1 (minimal)
- Duration: 1200ms

### `triggerEmotion('paradox')`
**AI State**: Encountering logical contradiction or unanswerable query
- Violent tremor effect (10 rapid shakes)
- Random position jitter (±0.15 units)
- Flash glow: 0 → 2.0 → 0.3
- Duration: 500ms total
- Mimics a "glitch" in the system

---

## 🎨 Material Morphing (README Concept)

These actions represent different knowledge domains:

### `morphMaterial('leather')`
**Knowledge Domain**: Humanities, history, traditional lore
- Color: Dark brown (#2b1e16)
- Opacity: 1.0 (opaque)
- Glow: → 0.1 (subtle)
- Appearance: Matte, organic, aged

### `morphMaterial('metal')`
**Knowledge Domain**: Scientific, logical, mathematical
- Color: Steel blue (#556b7d)
- Opacity: 1.0 (opaque)
- Glow: → 0.8 (bright, cold)
- Particles: → 0.9 (data flow)
- Appearance: Reflective, cold, precise

### `morphMaterial('glass')`
**Knowledge Domain**: Philosophical, "ultimate truth", vulnerable
- Color: Ice blue (#d0e8f2)
- Opacity: 0.3 (transparent)
- Glow: → 1.8 (brilliant)
- Particles: → 1.0 (maximum)
- Appearance: Transparent, crystalline, fragile

---

## 🎮 UI Controls

All actions are available in the R3F Dev Interface (`/r3f-dev`):

### Panel: "📖 Animated Actions"
- **Open Book**: Opens book in 1 second
- **Close Book**: Closes book in 1 second
- **Flip 5 Forward**: Flips 5 pages forward with stagger
- **Flip 5 Backward**: Flips 5 pages backward with stagger

### Panel: "🎭 Emotions (README Concept)"
- **Focus**: Rises, glows, zooms (critical insight)
- **Drift**: Fades, tilts, shrinks (daydreaming)
- **Paradox**: Shakes, flashes (error/contradiction)

### Panel: "🎨 Material Morph (README Concept)"
- **Leather**: Humanities/history aesthetic
- **Metal**: Scientific/logical aesthetic
- **Glass**: Philosophical/truth aesthetic

---

## 🎬 Animation System

### Implementation
- **No external libraries**: Pure requestAnimationFrame
- **Smooth easing**: Cubic ease-in-out for natural motion
- **Non-blocking**: All animations run asynchronously
- **Zustand integration**: State updates trigger React re-renders

### Easing Functions
- `easeInOutCubic`: Smooth acceleration/deceleration
- `easeOutElastic`: Spring-like bounce (future use)

### Performance
- All animations target 60fps
- No heavy computations during animation
- State updates are batched where possible

---

## 📝 Usage Example (Scripted Animation)

```typescript
import { useBookStore } from './stores/bookStore';

// In your component
const { openBook, triggerEmotion, morphMaterial, flipPages, closeBook } = useBookStore();

// Script a sequence
const performAnimation = async () => {
  // 1. Open the book
  openBook(1000);
  await wait(1200);
  
  // 2. Show "searching" with metal material
  morphMaterial('metal');
  await wait(500);
  
  // 3. Rapid page flipping (searching)
  flipPages(10, 'forward', 30);
  await wait(500);
  
  // 4. Found answer! Focus state
  triggerEmotion('focus');
  await wait(1000);
  
  // 5. Close book
  closeBook(1000);
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

---

## 🔮 Future Enhancements

From `plan.md`, these features are planned but not yet implemented:

### Phase 2: Audio Integration
- Hinge creak sounds
- Page rustle
- "Babel Hum" ambient sound
- Material change ping

### Phase 3: Physics
- Gravity & page sag
- Spine anchor pivot modes
- Vertex deformation

---

## ✅ Implementation Status

- ✅ Core actions (open, close, flip)
- ✅ Emotional states (focus, drift, paradox)
- ✅ Material morphing (leather, metal, glass)
- ✅ Animation system (easing, timing)
- ✅ UI controls (Leva GUI)
- ⏳ Audio integration (planned Phase 2)
- ⏳ Physics simulation (planned Phase 3)

