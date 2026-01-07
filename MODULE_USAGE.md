# Using Babel Catalogue as a Module

This guide shows you how to use Babel Catalogue as a reusable module in your React Three Fiber projects.

## Installation

### From GitHub Release

```bash
# Install from latest release
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz

# Or add to package.json
{
  "dependencies": {
    "babel-catalogue": "https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz"
  }
}
```

### Required Peer Dependencies

Install the required peer dependencies if you don't have them:

```bash
npm install @react-three/fiber @react-three/drei three zustand react react-dom
```

## Quick Start

### 1. Basic Setup

```tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
    </div>
  );
}

export default App;
```

### 2. Adding Controls

```tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function BookControls() {
  const { openBook, closeBook, flipPage, triggerEmotion } = useBookStore();
  
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
      <button onClick={() => openBook()}>Open Book</button>
      <button onClick={() => closeBook()}>Close Book</button>
      <button onClick={() => flipPage('forward')}>Next Page</button>
      <button onClick={() => triggerEmotion('focus')}>Focus</button>
    </div>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <BookControls />
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
    </div>
  );
}
```

### 3. Initial Configuration

```tsx
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function BookInitializer() {
  const {
    setFrontCoverText,
    setBackCoverText,
    setCoverColor,
    setPageColor,
    setDimensions,
    openBook
  } = useBookStore();
  
  useEffect(() => {
    // Configure book on mount
    setFrontCoverText('My Book Title');
    setBackCoverText('Volume I');
    setCoverColor('#2b1e16');
    setPageColor('#00ffcc');
    setDimensions({ width: 3, height: 4 });
    
    // Open book after a short delay
    setTimeout(() => openBook(1500), 500);
  }, []);
  
  return null;
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
      <BookInitializer />
    </div>
  );
}
```

## Integration Examples

### React App (Create React App / Vite)

```tsx
// App.tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene } from 'babel-catalogue';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
    </div>
  );
}

export default App;
```

### Next.js (App Router)

```tsx
// app/book/page.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Book, Scene } from 'babel-catalogue';

export default function BookPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
    </div>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/book.tsx
import dynamic from 'next/dynamic';

const BookScene = dynamic(
  () => import('../components/BookScene'),
  { ssr: false }
);

export default function BookPage() {
  return <BookScene />;
}

// components/BookScene.tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene } from 'babel-catalogue';

export default function BookScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
    </div>
  );
}
```

## AI Integration Example

```tsx
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

interface AIState {
  thinking: boolean;
  confidence: number;
  searching: boolean;
  error: boolean;
}

function AIBookController({ aiState }: { aiState: AIState }) {
  const {
    triggerEmotion,
    setParticleIntensity,
    flipPages,
    setGlowIntensity
  } = useBookStore();
  
  useEffect(() => {
    if (aiState.error) {
      // Show paradox when AI encounters an error
      triggerEmotion('paradox');
    } else if (aiState.thinking && aiState.confidence < 0.5) {
      // Drift when thinking with low confidence
      triggerEmotion('drift');
    } else if (aiState.confidence > 0.8) {
      // Focus when high confidence
      triggerEmotion('focus');
    }
  }, [aiState.error, aiState.thinking, aiState.confidence]);
  
  useEffect(() => {
    if (aiState.searching) {
      // Show high particle activity when searching
      setParticleIntensity(0.9);
      flipPages(5, 'forward', 200);
    } else {
      // Lower particles when not searching
      setParticleIntensity(0.3);
    }
  }, [aiState.searching]);
  
  useEffect(() => {
    // Adjust glow based on confidence
    setGlowIntensity(aiState.confidence * 1.5);
  }, [aiState.confidence]);
  
  return null;
}

function App() {
  const [aiState, setAIState] = useState<AIState>({
    thinking: false,
    confidence: 0.5,
    searching: false,
    error: false
  });
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
        <Scene>
          <Book />
        </Scene>
      </Canvas>
      <AIBookController aiState={aiState} />
    </div>
  );
}
```

## Common Patterns

### Pre-configured Book Component

Create a wrapper component with your default configuration:

```tsx
// MyBook.tsx
import { useEffect } from 'react';
import { Book, useBookStore } from 'babel-catalogue';

export function MyBook() {
  const {
    setFrontCoverText,
    setCoverColor,
    setPageColor,
    setParticlesEnabled,
    openBook
  } = useBookStore();
  
  useEffect(() => {
    setFrontCoverText('My Project');
    setCoverColor('#1a0f0a');
    setPageColor('#00ff00');
    setParticlesEnabled(true);
    openBook();
  }, []);
  
  return <Book />;
}

// Usage
import { Canvas } from '@react-three/fiber';
import { Scene } from 'babel-catalogue';
import { MyBook } from './MyBook';

function App() {
  return (
    <Canvas camera={{ position: [6, 4, 10], fov: 45 }}>
      <Scene>
        <MyBook />
      </Scene>
    </Canvas>
  );
}
```

### Hook for Book Actions

Create a custom hook for common book actions:

```tsx
// useBookActions.ts
import { useBookStore } from 'babel-catalogue';

export function useBookActions() {
  const store = useBookStore();
  
  return {
    showThinking: () => {
      store.setParticleIntensity(0.8);
      store.flipPages(3, 'forward');
    },
    showFocus: () => {
      store.triggerEmotion('focus');
    },
    showError: () => {
      store.triggerEmotion('paradox');
    },
    showSearching: () => {
      store.setParticleIntensity(1.0);
      store.toggleContinuousFlip('forward');
    },
    stopSearching: () => {
      store.toggleContinuousFlip('forward');
      store.setParticleIntensity(0.3);
    }
  };
}

// Usage
import { useBookActions } from './useBookActions';

function MyComponent() {
  const bookActions = useBookActions();
  
  const handleSearch = () => {
    bookActions.showSearching();
    // ... perform search
    bookActions.stopSearching();
  };
  
  return <button onClick={handleSearch}>Search</button>;
}
```

## TypeScript Support

The module includes full TypeScript definitions:

```tsx
import type {
  BookConfig,
  BookDimensions,
  PageProps,
  CoverProps
} from 'babel-catalogue';

const config: Partial<BookConfig> = {
  coverColor: '#2b1e16',
  pageColor: '#00ffcc',
  particlesEnabled: true
};

const dimensions: BookDimensions = {
  width: 3,
  height: 4,
  depth: 0.6
};
```

## Troubleshooting

### Module Not Found

If you get "Module not found" errors, ensure all peer dependencies are installed:

```bash
npm install @react-three/fiber @react-three/drei three zustand react react-dom
```

### TypeScript Errors

If you get TypeScript errors, ensure you have the `@types` packages:

```bash
npm install --save-dev @types/react @types/three
```

### Performance Issues

If you experience performance issues:

1. Reduce particle count or disable particles:
   ```tsx
   const { setParticlesEnabled } = useBookStore();
   setParticlesEnabled(false);
   ```

2. Reduce page density:
   ```tsx
   const { setPageCount } = useBookStore();
   setPageCount(20); // Lower = better performance
   ```

3. Limit glow effects:
   ```tsx
   const { setGlowIntensity } = useBookStore();
   setGlowIntensity(0.3); // Lower = better performance
   ```

## API Reference

For complete API documentation, see [API.md](./API.md)

## Examples

See the included Next.js demo pages for working examples:
- `pages/index.tsx` - Full interactive demo with Leva controls
- `pages/r3f-dev.tsx` - Development interface

## Support

- GitHub Issues: https://github.com/modellingDH/babel-catalogue/issues
- Documentation: https://github.com/modellingDH/babel-catalogue#readme

