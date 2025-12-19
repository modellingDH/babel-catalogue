# The Babel Catalogue

## I. Concept: The External Observer

This interface is designed for Third-Person Observation. The book is not a UI for the user, but a performance tool for an AI. When an AI "thinks," the book reacts. This physicalizes the abstract nature of data retrieval.

## II. The Logic of Signposts

The controller uses visual and auditory cues to represent the AI's internal state:

| Signpost | Action Trigger | Visual Representation | Audio Representation | AI Cognitive State |
|----------|---------------|----------------------|---------------------|-------------------|
| Focus | `triggerEmotion('focus')` | Book rises and zooms toward the center-frame. | Clear, rising Sine Tone (440Hz). | Providing a critical insight or high-confidence answer. |
| Drift | `triggerEmotion('drift')` | Book tilts and descends into the periphery. | Fading, low-frequency Bass (80Hz). | Processing irrelevant data, daydreaming, or losing "interest." |
| Paradox | `triggerEmotion('glitch')` | Violent tremor; title text fragments and flickers. | Harsh, distorted Sawtooth (60Hz). | Encountering a logical contradiction or unanswerable query. |
| Data Stream | `particleIntensity` | Particles flow upward from the glass pages. | A constant, low-level "Babel Hum" (110Hz). | Actively searching the infinite library for a specific record. |
| Metal Morph | `morphMaterial('metal')` | Cover becomes reflective, cold, and hard. | High-frequency metallic "ping" (880Hz). | Operating in a purely logical, scientific, or cold state. |
| Leather Morph | `morphMaterial('leather')` | Cover becomes dark, matte, and organic. | Mid-range organic thud (150Hz). | Accessing ancient history, humanities, or traditional lore. |
| Glass Morph | `morphMaterial('glass')` | Cover turns transparent, showing the inner data. | High-pitched crystalline ring (1200Hz). | Seeking "Ultimate Truth" or being conceptually vulnerable. |

### The "Observer" Perspective

When animating a conversation, the book should not move at the same time the AI speaks. Instead, use the book to pre-signal or react:

- **The Pre-Signal**: Before the AI begins a complex sentence, increase the Data Stream Intensity. It shows the "effort" of retrieval before the "voice" appears.
- **The Reaction**: If the user asks a personal or confusing question, trigger the Paradox (Glitch) for 0.5 seconds before the AI responds with "I am not sure how to answer that."

### How to Use the Table for Scripting

If you are using this to produce an animation, you can treat the Action Trigger column as your "Cues." For example:

```
[Cue: Open Book] "Welcome to the archives."
[Cue: Morph Metal] "Let us look at the mathematics of the situation."
[Cue: Focus] "The formula you are looking for is hidden here."
```

## III. Control Instructions

- **Audio Activation**: Modern browsers require a user gesture. Click anywhere on the black background before starting the simulation to enable the "Babel Hum."
- **Intensity**: Use the Data Stream Intensity slider to mimic the "speed" of the search. A high-speed flutter signifies deep library scanning.
- **Paradox Button**: Use this sparingly. It is a "break" in the simulation that draws the viewer's attention to the AI's limitations.

## IV. Integration for Animation

- **Video Capture**: Run this in a 4K browser window and use screen-recording software.
- **Live Simulation**: This can be connected to an LLM API via a simple bridge, where specific tokens in the AI's response (like "Error" or "History") trigger the corresponding `window.triggerEmotion` or `window.morphMaterial` functions.

## V. Using the Babel Catalogue as a JavaScript Module

The core behaviour of the Babel Catalogue (3D book with spine, hinged covers, and individual pages) is exposed as an ES module in `babelCatalogue.js`. This allows you to embed the controller into other projects and wire it to any UI or LLM bridge.

### 1. Development & Testing Interface

The project includes a **dev/testing interface** (`index.html`) that serves two purposes:

1. **Interactive Testing**: Allows you to test all module features in real-time
2. **Configuration Extraction**: Generates a JSON configuration snippet based on your current settings

#### Using the Dev Interface

1. **Start the dev server**:
   ```bash
   node dev-server.mjs
   ```

2. **Open the interface**: Navigate to `http://localhost:3000` in your browser

3. **Adjust parameters** using the UI controls:
   - **Stage Staging**: Spine rotation, tilt, scale, hover animation
   - **Covers (Hinges)**: Front and back cover angles
   - **Search Logic (Flip)**: Page flipping animations
   - **Tone & Paradox**: Material type and glitch effects

4. **Copy the configuration**: The "Initialization JSON" panel displays a live JSON snippet of your current settings. Copy this JSON to use when initializing the module in your own projects.

#### Example Configuration Output

As you adjust the controls, the dev interface generates a JSON configuration like this:

```json
{
  "pageCount": 15,
  "initialSpineRotation": 0.62,
  "initialTilt": 0.18,
  "initialScale": 1.1,
  "initialFrontHinge": 1.2,
  "initialBackHinge": 0.4,
  "initialMaterial": "metal",
  "initialHover": true
}
```

This configuration can be directly used when creating a `BabelCatalogue` instance (see section 2 below).

### 2. Importing the Module

In any HTML file served from the same directory:

```html
<script type="module">
  import { createBabelCatalogue } from './babelCatalogue.js';

  // Use configuration extracted from dev interface
  const config = {
    pageCount: 15,
    initialSpineRotation: 0.62,
    initialTilt: 0.18,
    initialScale: 1.1,
    initialFrontHinge: 1.2,
    initialBackHinge: 0.4,
    initialMaterial: 'metal',
    initialHover: true
  };

  const catalogue = createBabelCatalogue({
    container: document.body,  // or any DOM element
    ...config,
    // Optional event hooks
    onFlip: (direction) => {
      console.log('Pages flipped:', direction);
    },
    onGlitch: () => {
      console.log('Glitch triggered');
    },
    onHoverChange: (isHovering) => {
      console.log('Hover state:', isHovering);
    }
  });

  // Example wiring to custom UI:
  document.getElementById('spineSlider').addEventListener('input', (e) => {
    catalogue.setSpineRotation(parseFloat(e.target.value));
  });

  document.getElementById('flipBtn').addEventListener('click', () => {
    catalogue.flipPages('f'); // 'f' for forward, 'b' for backward
  });

  document.getElementById('glitchBtn').addEventListener('click', () => {
    catalogue.glitch();
  });
</script>
```

### 3. Module API Surface

The `createBabelCatalogue` function accepts the following options:

#### Initialization Options

- `container` (HTMLElement, default: `document.body`): Where to attach the WebGL canvas
- `pageCount` (number, default: `15`): Number of individual page meshes
- `initialSpineRotation` (number, default: `0.5`): Initial Y rotation of the spine (range: -π to π)
- `initialTilt` (number, default: `0.2`): Initial X rotation/tilt (range: -1.5 to 1.5)
- `initialScale` (number, default: `1`): Initial uniform scale (range: 0.5 to 2)
- `initialFrontHinge` (number, default: `0`): Initial front cover angle (range: 0 to 3)
- `initialBackHinge` (number, default: `0`): Initial back cover angle (range: 0 to 3)
- `initialMaterial` (string, default: `'leather'`): Initial material type (`'leather' | 'metal' | 'glass'`)
- `initialHover` (boolean, default: `false`): Whether hover animation starts enabled

#### Event Hooks

- `onFlip(direction: 'f' | 'b')`: Called when pages are flipped
- `onGlitch()`: Called when glitch effect is triggered
- `onHoverChange(isHovering: boolean)`: Called when hover state changes

The function returns an object with the following methods:

#### Book Positioning & Orientation

- `setSpineRotation(angle: number)`: Rotates the entire book around the Y axis (spine rotation). Range: -π to π.
- `setTilt(angle: number)`: Rotates the book around the X axis (tilt). Range: -1.5 to 1.5.
- `setScale(value: number)`: Scales the entire book uniformly. Range: 0.5 to 2.

#### Cover Controls

- `setFrontHinge(angle: number)`: Opens/closes the front cover. Range: 0 to 3 (radians).
- `setBackHinge(angle: number)`: Opens/closes the back cover. Range: 0 to 3 (radians).

#### Page Animation

- `flipPages(direction: 'f' | 'b')`: Animates all pages flipping forward ('f') or backward ('b') with staggered timing.
- `resetPages()`: Resets all pages to their default closed position.

#### Material & Effects

- `morphMaterial(type: 'leather' | 'metal' | 'glass')`: Changes the cover material appearance.
- `glitch()`: Triggers a glitch effect (rapid position shake).

#### Animation

- `toggleHover()`: Toggles a sinusoidal hover animation that makes the book float.

#### Utility

- `getState()`: Returns `{ isHovering, frontHingeAngle, backHingeAngle, spineRotation, tilt, scale }` for external orchestration or recording.
- `resize()`: Recomputes the camera aspect and renderer size if your container changes layout.
- `dispose()`: Tears down the renderer and Three.js resources when you remove the controller from the page.
- `bookGroup`: Direct access to the Three.js `Group` object for advanced custom control.

#### DOM Events

The module also dispatches custom DOM events on the container element:

- `'babel:flip'`: Dispatched when pages are flipped. Event detail: `{ direction, state }`
- `'babel:glitch'`: Dispatched when glitch is triggered. Event detail: `{ state }`
- `'babel:hoverChange'`: Dispatched when hover state changes. Event detail: `{ isHovering, state }`

Example:

```javascript
container.addEventListener('babel:flip', (e) => {
  console.log('Pages flipped:', e.detail.direction);
  console.log('Current state:', e.detail.state);
});
```

### 4. Embedding with an LLM Bridge

You can map semantic states from an LLM's responses to module calls. For example:

- Contradictions or unanswerable questions → `catalogue.glitch()`
- History / lore-heavy responses → `catalogue.morphMaterial('leather')`
- Purely logical / mathematical content → `catalogue.morphMaterial('metal')`
- Philosophical or "ultimate truth" themes → `catalogue.morphMaterial('glass')`
- Active searching/processing → `catalogue.flipPages('f')` to show pages turning
- Returning to neutral → `catalogue.resetPages()`
- Emphasis or focus → `catalogue.toggleHover()` to draw attention

## VI. Performance and Robustness Notes

- **Page Count Tuning**: You can tune the number of pages via `createBabelCatalogue({ pageCount: ... })` if you need to target lower-powered devices. Values around 10–15 pages provide good visual density without excessive geometry.
- **Resize Handling**: The module automatically resizes with `window` events, but if you mount it in a resizable panel, call `catalogue.resize()` after layout changes for crisp rendering.
- **Animation Queuing**: Page flipping animations use Tween.js with staggered delays. Multiple rapid calls will queue animations naturally.
- **Memory Management**: Call `dispose()` when navigating away or unmounting to free WebGL resources and avoid memory leaks during long live performances or SPA navigation.
- **Advanced Control**: For advanced control, you can access `catalogue.bookGroup` directly to manipulate the Three.js scene graph, but be aware this bypasses the module's state management.
- **Event-Driven Architecture**: The module uses both callback hooks and DOM events, giving you flexibility in how you integrate it. Use callbacks for direct integration, or DOM events for decoupled, event-driven architectures.

## Project Structure

```
babel-catalogue/
├── babelCatalogue.js    # Core reusable module (embed in any project)
├── index.html            # Dev/testing interface (for tuning parameters)
├── dev-server.mjs        # Simple dev server
└── README.md             # This file
```

**Key Separation**:
- **`babelCatalogue.js`**: Standalone, reusable module with no dependencies on the dev interface
- **`index.html`**: Development tool for testing and extracting configuration JSON
- Both can be used independently in production projects
