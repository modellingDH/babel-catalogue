# The Babel Catalogue

A 3D animated book built with React Three Fiber that physicalizes the abstract nature of AI data retrieval and cognitive states.

## 🎯 Concept: The External Observer

This interface is designed for **Third-Person Observation**. The book is not a UI for the user, but a **performance tool** for visualizing AI states. When an AI "thinks," the book reacts, making the invisible visible.

---

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Visit: **http://localhost:3000**

### Production
```bash
npm run build
npm start
```

---

## 📖 Book Actions & Signposts

The book uses visual cues to represent AI cognitive states:

| Signpost | Action | Visual Representation | AI Cognitive State |
|----------|--------|----------------------|-------------------|
| **Focus** | `triggerEmotion('focus')` | Pages glow brightly with pulsing effect | Providing critical insight or high-confidence answer |
| **Drift** | `triggerEmotion('drift')` | Pages dim with slow pulsing | Processing irrelevant data, low attention |
| **Paradox** | `triggerEmotion('paradox')` | Rapid flickering and glitch effect | Encountering logical contradiction |
| **Data Stream** | `setParticleIntensity(value)` | Particles flow from pages toward front | Actively searching the infinite library |
| **Page Flip** | `flipPage('forward')` / `flipPage('backward')` | Single page rotates between covers | Moving through data |
| **Bulk Flip** | `flipPages(5, 'forward')` | Multiple pages flip sequentially | Rapid data scanning |
| **Open/Close** | `openBook()` / `closeBook()` | Covers open/close symmetrically | Accessing/closing the archive |

### Material Morphing
Transform the book's appearance to reflect content type:

```javascript
morphMaterial('metal')   // Cold, logical, scientific state
morphMaterial('leather') // Ancient, humanities, traditional lore
morphMaterial('glass')   // Seeking truth, vulnerable state
```

---

## 🎮 Control Interface

The development interface provides complete control over:

### Book Properties
- **Dimensions**: Width, height, spine depth
- **Hinges**: Open/close angles for covers
- **Rotation & Tilt**: Spine rotation and horizontal lean
- **Scale**: Overall size

### Visual Appearance
- **Pages**: Color, opacity, glow intensity, density
- **Covers**: Color, opacity
- **Cover Text**: Front and back cover text (Roboto font), text color

### Effects
- **Particles**: Enable/disable, intensity control
- **Animations**: Open, close, flip pages, emotions, material morphing

### Live Configuration
All settings are displayed as **JSON** in real-time (bottom-right corner) for easy export and reuse.

---

## 🎨 Visual Features

### Floating Cover Text
- Text rendered in **Roboto font**
- Floats in front of cover external face
- Independent opacity from cover
- No background rectangles - pure text

### Infinite Pages
- Pages never run out
- `pageDensity` controls page count
- Pages split between covers when book opens
- Pages anchored to inside face of covers

### Particle System
- Particles flow from pages toward front
- GPU-accelerated for smooth performance
- Intensity controls particle density

### Physics-Based Book
- Covers anchored to spine
- Proper hinge mechanics
- Pages distributed within spine depth
- Realistic book opening angles

---

## 🏗️ Architecture

### Technology Stack
- **React Three Fiber**: Declarative 3D rendering
- **Three.js**: 3D graphics engine
- **Zustand**: State management
- **Leva**: Development GUI
- **Next.js**: React framework
- **TypeScript**: Type safety

### Project Structure
```
/components/Book/
  - Book.tsx       # Main book component
  - Cover.tsx      # Cover with floating text
  - Page.tsx       # Individual pages
  - Spine.tsx      # Book spine
  - Particles.tsx  # Particle system
  - Scene.tsx      # Lights and camera

/stores/
  - bookStore.ts   # Zustand state management

/hooks/
  - useCoverTexture.ts  # Canvas-based text rendering

/types/
  - book.ts        # TypeScript definitions

/pages/
  - index.tsx      # Main interface (R3F dev)
```

---

## 🎬 Usage for Animation & AI Integration

### The "Observer" Perspective

Use the book to **pre-signal** or **react** to AI behavior:

**Pre-Signal Example**:
```javascript
// Before AI speaks, show effort of retrieval
setParticleIntensity(0.8);
// AI starts generating response...
```

**Reaction Example**:
```javascript
// User asks confusing question
triggerEmotion('paradox'); // 0.5s glitch
// AI responds: "I am not sure how to answer that."
```

### Scripting Animation Cues

```
[Cue: openBook()] "Welcome to the archives."
[Cue: morphMaterial('metal')] "Let us look at the mathematics."
[Cue: triggerEmotion('focus')] "The formula is hidden here."
[Cue: flipPages(10, 'forward')] "Searching through records..."
```

### Live API Integration

Connect to an LLM API where specific tokens trigger actions:
- Token: `"Error"` → `triggerEmotion('paradox')`
- Token: `"History"` → `morphMaterial('leather')`
- Token: `"Searching"` → `setParticleIntensity(0.9)`

---

## 📋 Configuration Export

The interface displays live JSON configuration:

```json
{
  "pageCount": 50,
  "dimensions": {
    "width": 3,
    "height": 4,
    "depth": 0.6
  },
  "frontHinge": 1.2566370614359172,
  "backHinge": 1.2566370614359172,
  "coverColor": "#2b1e16",
  "pageColor": "#f5f5dc",
  "glowIntensity": 0.3,
  "particlesEnabled": true,
  "particleIntensity": 0.5,
  "frontCoverText": "Babel Catalogue",
  "coverTextColor": "#c9a876"
}
```

Copy this JSON to reproduce exact book configurations.

---

## 🎥 Video Capture

For animation production:
1. Run in 4K browser window
2. Use screen-recording software (OBS, QuickTime)
3. Control book via Leva GUI or keyboard shortcuts
4. Export clean video without UI (hide Leva panel)

---

## 🔧 Development

### Available Scripts
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Browser Requirements
- Modern browser with WebGL support
- Recommended: Chrome, Firefox, Safari (latest)

---

## 📝 Credits

Built with ❤️ using React Three Fiber and Three.js

**Font**: Roboto (Google Fonts)

---

## 📄 License

MIT License - Feel free to use in your projects!
