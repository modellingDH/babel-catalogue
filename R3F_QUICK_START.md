# React Three Fiber Quick Start

## Access the New Interface

```
http://localhost:3000/r3f-dev
```

## What You'll See

### 1. **Leva Control Panel** (Right Side)
Organized folders with all controls:
- **Book Controls**: Pages, dimensions, rotation, hinges
- **Appearance**: Colors, opacity, glow
- **Cover Text**: Front and back text
- **Features**: Particles, debug mode

### 2. **3D Canvas** (Center)
Your 3D book with:
- OrbitControls (drag to rotate, scroll to zoom)
- Real-time updates from Leva controls
- Smooth animations

### 3. **Stats Panel** (Top-Left)
- FPS counter
- Render time
- Memory usage

## Quick Actions

### Open the Book
1. Find **frontHinge** slider in "Book Controls"
2. Drag to ~1.57 (90 degrees)
3. Do same for **backHinge**
4. Book opens like a real book!

### Make Pages Visible
1. Find **pageOpacity** in "Appearance"
2. Increase to 0.5 or higher
3. Pages appear as cyan translucent surfaces

### Add Cover Text
1. Find "Cover Text" folder
2. Type in **frontCoverText**: "BABEL"
3. Text renders on front cover texture

### Enable Particles
1. Find "Features" folder
2. Toggle **particlesEnabled**
3. Adjust **particleIntensity** slider
4. Particles flow around book

### Debug Mode
1. Find "Features" folder
2. Toggle **debug** checkbox
3. See axes, grid, wireframes

## Camera Controls

- **Rotate**: Left-click + drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click + drag

## Common Tasks

### Change Book Size
```
Book Controls > dimensions
- height: 4 (tall/short)
- width: 3 (wide/narrow)  
- depth: 0.6 (thick/thin)
```

### Change Colors
```
Appearance > pageColor: Pick color
Appearance > coverColor: Pick color
```

### Add Glow Effect
```
Appearance > glowIntensity: 0 to 2
(Emissive lighting effect)
```

## Code Structure

```
components/Book/
  ├── Book.tsx       # Main orchestrator
  ├── Page.tsx       # Individual pages
  ├── Cover.tsx      # Front/back covers
  ├── Spine.tsx      # Central spine
  ├── Particles.tsx  # Particle system
  └── Scene.tsx      # Lights & camera

stores/
  └── bookStore.ts   # Zustand state

pages/
  └── r3f-dev.tsx    # Dev interface
```

## Troubleshooting

### Pages Not Visible?
1. Increase **pageOpacity** to 0.5+
2. Open covers (hinges to 1.57)
3. Set **glowIntensity** to 0 (start simple)
4. Enable **debug** to see wireframes

### Covers Not Moving?
1. Check **frontHinge** / **backHinge** sliders
2. Should go from 0 (closed) to π (open)
3. Try setting to exactly 1.57 (90°)

### Particles Not Showing?
1. Toggle **particlesEnabled** on
2. Increase **particleIntensity** to 0.5+
3. They're cyan dots floating around

## Next Steps

1. ✅ Test all Leva controls
2. ✅ Try different book configurations
3. ✅ Add cover text
4. ✅ Enable debug mode to understand structure
5. ✅ Check console for any errors

Enjoy the new interface! 🎉

