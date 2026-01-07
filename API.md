# Babel Catalogue - API Documentation

A 3D animated book component for React Three Fiber that visualizes AI cognitive states and data retrieval processes.

## Installation

### NPM (once published)
```bash
npm install babel-catalogue
```

### GitHub Release
```bash
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
```

### Required Peer Dependencies
```bash
npm install @react-three/fiber @react-three/drei three zustand react react-dom
```

## Quick Start

```tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function App() {
  return (
    <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
      <Scene>
        <Book />
      </Scene>
    </Canvas>
  );
}
```

## Components

### `<Book />`
The main 3D book component. Reads all configuration from the Zustand store.

```tsx
import { Book } from 'babel-catalogue';

<Book />
```

**Props:** None (controlled via store)

### `<Scene />`
Provides lighting and camera controls for the book.

```tsx
import { Scene } from 'babel-catalogue';

<Scene>
  <Book />
  {/* other 3D objects */}
</Scene>
```

**Props:**
- `children: React.ReactNode` - 3D objects to render

### `<Cover />`
Individual cover component (typically used internally by `<Book />`).

```tsx
import { Cover } from 'babel-catalogue';

<Cover
  side="front"
  width={3}
  height={4}
  hinge={Math.PI * 0.4}
  text="My Book"
  textColor="#c9a876"
  color="#2b1e16"
/>
```

**Props:**
- `side: 'front' | 'back'` - Which cover
- `width: number` - Cover width
- `height: number` - Cover height
- `hinge: number` - Rotation angle in radians
- `text?: string` - Cover text
- `textColor?: string` - Text color
- `outlineColor?: string` - Text outline color
- `outlineWidth?: number` - Text outline width
- `color?: string` - Cover background color
- `opacity?: number` - Cover opacity

### `<Page />`
Individual page component (typically used internally by `<Book />`).

### `<Spine />`
Book spine component (typically used internally by `<Book />`).

### `<Particles />`
Particle system for visual effects (typically used internally by `<Book />`).

## Store API (`useBookStore`)

The book is controlled via a Zustand store that provides state and actions.

```tsx
import { useBookStore } from 'babel-catalogue';

function BookController() {
  const { openBook, flipPage, triggerEmotion } = useBookStore();
  
  return (
    <div>
      <button onClick={() => openBook()}>Open</button>
      <button onClick={() => flipPage('forward')}>Next Page</button>
      <button onClick={() => triggerEmotion('focus')}>Focus</button>
    </div>
  );
}
```

### State Properties

Access current state:
```tsx
const {
  pageCount,
  currentPage,
  dimensions,
  frontHinge,
  backHinge,
  coverColor,
  pageColor,
  glowIntensity,
  particleIntensity,
  // ... and more
} = useBookStore();
```

**Key State Properties:**
- `pageCount: number` - Total number of pages (10-100)
- `currentPage: number` - Current page index
- `dimensions: { width, height, depth }` - Book dimensions
- `frontHinge: number` - Front cover angle in radians
- `backHinge: number` - Back cover angle in radians
- `spineRotation: number` - Book spine rotation
- `tilt: number` - Book tilt/lean
- `scale: number` - Overall book scale
- `coverColor: string` - Cover color
- `pageColor: string` - Page color
- `spineColor: string` - Spine color
- `glowIntensity: number` - Page glow (0-2)
- `pageOpacity: number` - Page transparency
- `coverOpacity: number` - Cover transparency
- `frontCoverText: string` - Front cover text
- `backCoverText: string` - Back cover text
- `coverTextColor: string` - Text color
- `particlesEnabled: boolean` - Enable particle effects
- `particleIntensity: number` - Particle density (0-1)

### Actions

#### Book Control

**`openBook(duration?: number)`**
Opens the book covers smoothly.
```tsx
const { openBook } = useBookStore();
openBook(1000); // Opens over 1 second
```

**`closeBook(duration?: number)`**
Closes the book covers smoothly.
```tsx
const { closeBook } = useBookStore();
closeBook(1000); // Closes over 1 second
```

**`flipPage(direction: 'forward' | 'backward')`**
Flips a single page with animation.
```tsx
const { flipPage } = useBookStore();
flipPage('forward');
flipPage('backward');
```

**`flipPages(count: number, direction: 'forward' | 'backward', duration?: number)`**
Flips multiple pages sequentially.
```tsx
const { flipPages } = useBookStore();
flipPages(5, 'forward', 200); // Flip 5 pages forward
```

**`toggleContinuousFlip(direction: 'forward' | 'backward')`**
Starts or stops continuous page flipping.
```tsx
const { toggleContinuousFlip } = useBookStore();
toggleContinuousFlip('forward'); // Start
toggleContinuousFlip('forward'); // Stop (toggle)
```

#### Visual Effects

**`triggerEmotion(emotion: 'focus' | 'drift' | 'paradox')`**
Triggers an emotional state animation.

- **`focus`**: Bright pulsing (high confidence, active thinking)
- **`drift`**: Dim pulsing (daydreaming, low activity)
- **`paradox`**: Violent shake/flash (logical contradiction)

```tsx
const { triggerEmotion } = useBookStore();
triggerEmotion('focus');    // Bright pulsing
triggerEmotion('drift');    // Dim pulsing
triggerEmotion('paradox');  // Shake and flash
```

**`morphMaterial(material: 'leather' | 'metal' | 'glass')`**
Changes the book's material appearance.

- **`leather`**: Dark, organic (humanities/lore)
- **`metal`**: Reflective, cold (scientific/logical)
- **`glass`**: Transparent, bright (seeking truth)

```tsx
const { morphMaterial } = useBookStore();
morphMaterial('leather'); // Ancient look
morphMaterial('metal');   // Cold, scientific
morphMaterial('glass');   // Transparent, seeking
```

#### Configuration Setters

**Dimensions:**
```tsx
const { setDimensions } = useBookStore();
setDimensions({ width: 3, height: 4 });
```

**Position & Transform:**
```tsx
const { setSpineRotation, setTilt, setScale } = useBookStore();
setSpineRotation(0.5); // Radians
setTilt(0.2);          // Radians
setScale(1.5);         // Multiplier
```

**Hinges:**
```tsx
const { setFrontHinge, setBackHinge, setBothHinges } = useBookStore();
setFrontHinge(Math.PI * 0.4);
setBackHinge(Math.PI * 0.4);
setBothHinges(Math.PI * 0.4); // Set both at once
```

**Colors:**
```tsx
const {
  setCoverColor,
  setPageColor,
  setSpineColor,
  setCoverTextColor
} = useBookStore();

setCoverColor('#2b1e16');
setPageColor('#00ffcc');
setSpineColor('#1a0f0a');
setCoverTextColor('#c9a876');
```

**Appearance:**
```tsx
const {
  setPageOpacity,
  setCoverOpacity,
  setGlowIntensity
} = useBookStore();

setPageOpacity(0.15);     // 0-1
setCoverOpacity(1.0);     // 0-1
setGlowIntensity(0.5);    // 0-2
```

**Text:**
```tsx
const { setFrontCoverText, setBackCoverText } = useBookStore();
setFrontCoverText('Babel Catalogue');
setBackCoverText('Volume I');
```

**Particles:**
```tsx
const { setParticlesEnabled, setParticleIntensity } = useBookStore();
setParticlesEnabled(true);
setParticleIntensity(0.7); // 0-1
```

**Other:**
```tsx
const { setPageCount, setDebug, reset } = useBookStore();
setPageCount(50);      // 10-100
setDebug(true);        // Show debug helpers
reset();               // Reset to default state
```

## Hooks

### `useCoverTexture`
Creates a Three.js texture from text for cover rendering.

```tsx
import { useCoverTexture } from 'babel-catalogue';

const texture = useCoverTexture(
  'My Book Title',
  '#c9a876',  // text color
  '#c9a876',  // outline color
  3,          // outline width
  true        // is front cover
);
```

## TypeScript Types

All TypeScript types are exported for use in your project:

```tsx
import type {
  BookConfig,
  BookDimensions,
  PageProps,
  CoverProps,
  SpineProps,
  ParticleProps
} from 'babel-catalogue';
```

## Usage Examples

### Basic Integration

```tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function App() {
  const { openBook, setFrontCoverText } = useBookStore();
  
  React.useEffect(() => {
    setFrontCoverText('My Book');
    openBook();
  }, []);
  
  return (
    <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
      <Scene>
        <Book />
      </Scene>
    </Canvas>
  );
}
```

### AI State Visualization

```tsx
function AIVisualizer({ aiState }) {
  const { triggerEmotion, setParticleIntensity, flipPages } = useBookStore();
  
  React.useEffect(() => {
    if (aiState.thinking) {
      setParticleIntensity(0.9);
      flipPages(3, 'forward');
    } else if (aiState.confident) {
      triggerEmotion('focus');
    } else if (aiState.uncertain) {
      triggerEmotion('drift');
    } else if (aiState.error) {
      triggerEmotion('paradox');
    }
  }, [aiState]);
  
  return (
    <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
      <Scene>
        <Book />
      </Scene>
    </Canvas>
  );
}
```

### Custom Controls

```tsx
function BookControls() {
  const {
    openBook,
    closeBook,
    flipPage,
    triggerEmotion,
    morphMaterial,
    setParticleIntensity
  } = useBookStore();
  
  return (
    <div>
      <h2>Book Controls</h2>
      <button onClick={() => openBook()}>Open</button>
      <button onClick={() => closeBook()}>Close</button>
      <button onClick={() => flipPage('forward')}>Next Page</button>
      <button onClick={() => flipPage('backward')}>Previous Page</button>
      
      <h3>Emotions</h3>
      <button onClick={() => triggerEmotion('focus')}>Focus</button>
      <button onClick={() => triggerEmotion('drift')}>Drift</button>
      <button onClick={() => triggerEmotion('paradox')}>Paradox</button>
      
      <h3>Materials</h3>
      <button onClick={() => morphMaterial('leather')}>Leather</button>
      <button onClick={() => morphMaterial('metal')}>Metal</button>
      <button onClick={() => morphMaterial('glass')}>Glass</button>
      
      <h3>Particles</h3>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => setParticleIntensity(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

## Performance Tips

1. **Particle Count**: Adjust particle count for better performance on lower-end devices
2. **Page Count**: More pages (density) can impact performance. Use 20-50 for best results
3. **Animation Duration**: Longer durations (1000ms+) are smoother than quick animations
4. **Glow Effects**: High glow intensity can be GPU-intensive

## Browser Compatibility

Requires modern browser with WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## License

MIT

