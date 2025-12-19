README: The Babel Catalogue Concept & Usage
I. Concept: The External Observer
This interface is designed for Third-Person Observation. The book is not a UI for the user, but a performance tool for an AI. When an AI "thinks," the book reacts. This physicalizes the abstract nature of data retrieval.

II. The Logic of Signposts
The controller uses visual and auditory cues to represent the AI's internal state:

Signpost,Action Trigger,Visual Representation,Audio Representation,AI Cognitive State
Focus,triggerEmotion('focus'),Book rises and zooms toward the center-frame.,"Clear, rising Sine Tone (440Hz).",Providing a critical insight or high-confidence answer.
Drift,triggerEmotion('drift'),Book tilts and descends into the periphery.,"Fading, low-frequency Bass (80Hz).","Processing irrelevant data, daydreaming, or losing ""interest."""
Paradox,triggerEmotion('glitch'),Violent tremor; title text fragments and flickers.,"Harsh, distorted Sawtooth (60Hz).",Encountering a logical contradiction or unanswerable query.
Data Stream,particleIntensity,Particles flow upward from the glass pages.,"A constant, low-level ""Babel Hum"" (110Hz).",Actively searching the infinite library for a specific record.
Metal Morph,morphMaterial('metal'),"Cover becomes reflective, cold, and hard.","High-frequency metallic ""ping"" (880Hz).","Operating in a purely logical, scientific, or cold state."
Leather Morph,morphMaterial('leather'),"Cover becomes dark, matte, and organic.",Mid-range organic thud (150Hz).,"Accessing ancient history, humanities, or traditional lore."
Glass Morph,morphMaterial('glass'),"Cover turns transparent, showing the inner data.",High-pitched crystalline ring (1200Hz).,"Seeking ""Ultimate Truth"" or being conceptually vulnerable."

The "Observer" Perspective When animating a conversation, the book should not move at the same time the AI speaks. Instead, use the book to pre-signal or react:

The Pre-Signal: Before the AI begins a complex sentence, increase the Data Stream Intensity. It shows the "effort" of retrieval before the "voice" appears.

The Reaction: If the user asks a personal or confusing question, trigger the Paradox (Glitch) for 0.5 seconds before the AI responds with "I am not sure how to answer that."

How to Use the Table for Scripting If you are using this to produce an animation, you can treat the Action Trigger column as your "Cues." For example:

[Cue: Open Book] "Welcome to the archives."

[Cue: Morph Metal] "Let us look at the mathematics of the situation."

[Cue: Focus] "The formula you are looking for is hidden here."

III. Control Instructions
Audio Activation: Modern browsers require a user gesture. Click anywhere on the black background before starting the simulation to enable the "Babel Hum."

Intensity: Use the Data Stream Intensity slider to mimic the "speed" of the search. A high-speed flutter signifies deep library scanning.

Paradox Button: Use this sparingly. It is a "break" in the simulation that draws the viewer's attention to the AI's limitations.

IV. Integration for Animation
Video Capture: Run this in a 4K browser window and use screen-recording software.

Live Simulation: This can be connected to an LLM API via a simple bridge, where specific tokens in the AI's response (like "Error" or "History") trigger the corresponding window.triggerEmotion or window.morphMaterial functions.

V. Using the Babel Catalogue as a JavaScript Module

The core behaviour of the Babel Catalogue (3D book, particles, and audio) is exposed as an ES module in `babelCatalogue.js`. This allows you to embed the controller into other projects and wire it to any UI or LLM bridge.

1. Basic Dev Server

- From the project directory, start the local dev server:
  - `node dev-server.mjs`
- Open `http://localhost:3000` in your browser to see the reference controller UI driven by the module.

2. Importing the Module

In any HTML file served from the same directory:

```html
<script type="module">
  import { createBabelCatalogue } from './babelCatalogue.js';

  const catalogue = createBabelCatalogue({
    container: document.body,          // any DOM element
    initialTitle: 'Encyclopedia',      // starting title
    initialParticleIntensity: 150,     // 0–500 suggested range
  });

  // Example wiring to custom UI:
  document.getElementById('myTitle').addEventListener('input', (e) => {
    catalogue.updateTitle(e.target.value);
  });

  document.getElementById('focusBtn').addEventListener('click', () => {
    catalogue.triggerEmotion('focus');
  });
</script>
```

3. Module API Surface

The `createBabelCatalogue` function returns an object with the following methods:

- `updateTitle(text: string)`: Updates the cover title and, during glitches, controls how the fragments render.
- `morphMaterial(mode: 'leather' | 'metal' | 'wood' | 'glass')`: Morphs the cover material and plays the corresponding tone.
- `triggerEmotion(type: 'focus' | 'drift' | 'glitch')`: Moves the book and triggers the associated audio/visual state.
- `toggleBook()`: Opens or closes the book, animating the cover and data stream opacity.
- `setParticleIntensity(value: number)`: Adjusts the vertical speed and density feel of the particles and the "Babel Hum" loudness.
- `setParticleColor(hex: string)`: Changes the particle color (e.g. `#00ffcc`).
- `getState()`: Returns `{ isOpen, isGlitching, particleIntensity }` for external orchestration or recording.
- `resize()`: Recomputes the camera aspect and renderer size if your container changes layout.
- `dispose()`: Tears down the renderer, audio, and Three.js resources when you remove the controller from the page.

The reference `index.html` maps these methods to `window.*` helpers so existing inline controls continue to work, but in new projects you should call the methods directly.

4. Embedding with an LLM Bridge

You can map semantic states from an LLM's responses to module calls. For example:

- High-confidence or "critical insight" tokens → `catalogue.triggerEmotion('focus')`
- Off-topic or meandering responses → `catalogue.triggerEmotion('drift')`
- Contradictions or unanswerable questions → `catalogue.triggerEmotion('glitch')`
- History / lore-heavy responses → `catalogue.morphMaterial('leather')`
- Purely logical / mathematical content → `catalogue.morphMaterial('metal')`
- Philosophical or "ultimate truth" themes → `catalogue.morphMaterial('glass')`

VI. Performance and Robustness Notes

- You can tune the number of particles via `createBabelCatalogue({ particleCount: ... })` if you need to target lower-powered devices. Values around 800–1200 are a good compromise between density and frame rate.
- The module automatically resizes with `window` events, but if you mount it in a resizable panel, call `catalogue.resize()` after layout changes for crisp rendering.
- Audio contexts are lazily resumed on interaction (e.g., `toggleBook`), complying with browser autoplay policies. On devices without `AudioContext`, audio is simply skipped while visuals remain.
- Call `dispose()` when navigating away or unmounting to free WebGL and audio resources and avoid memory leaks during long live performances or SPA navigation.