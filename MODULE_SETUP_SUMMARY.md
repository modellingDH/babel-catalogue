# Module Setup Summary

This document summarizes the changes made to transform Babel Catalogue into a reusable npm module available through GitHub releases.

## What Was Done

### 1. Module Structure

**Created main entry point: `index.ts`**
- Exports all components: `Book`, `Cover`, `Page`, `Spine`, `Particles`, `Scene`
- Exports hooks: `useCoverTexture`
- Exports store: `useBookStore`
- Exports TypeScript types: `BookConfig`, `BookDimensions`, etc.

### 2. Package Configuration

**Updated `package.json`:**
- Changed `main` and `module` to point to `dist/index.js`
- Added `types` field pointing to `dist/index.d.ts`
- Added `files` array to control what gets published
- Added `exports` field for modern module resolution
- Moved React Three Fiber dependencies to `peerDependencies`
- Added proper `keywords` for discoverability
- Changed license to MIT
- Added `build:lib` script for library compilation
- Added `prepublishOnly` hook

### 3. Build Configuration

**Created `tsconfig.lib.json`:**
- Configured TypeScript to compile the library
- Outputs to `dist/` directory
- Generates TypeScript declaration files (`.d.ts`)
- Includes only library code (excludes Next.js pages)

### 4. Package Distribution

**Created `.npmignore`:**
- Excludes development files from npm package
- Keeps development pages, configs out of distribution
- Includes only essential files: `dist`, source files, README, LICENSE

**Created `.github/workflows/release.yml`:**
- Automated GitHub Actions workflow
- Triggers on version tags (e.g., `v1.0.0`)
- Automatically builds library and creates GitHub Release
- Attaches tarball (`.tgz`) to release

### 5. Documentation

**Created comprehensive documentation:**
- `API.md` - Complete API reference with all components, hooks, and store actions
- `MODULE_USAGE.md` - Integration guide with examples for different frameworks
- `RELEASE_GUIDE.md` - Instructions for creating and publishing releases
- `CHANGELOG.md` - Version history
- `LICENSE` - MIT License
- Updated `README.md` - Added module usage section

## File Structure

```
babel-catalogue/
├── components/           # React Three Fiber components
│   └── Book/
│       ├── Book.tsx      # Main book component
│       ├── Cover.tsx     # Cover with text
│       ├── Page.tsx      # Individual pages
│       ├── Spine.tsx     # Book spine
│       ├── Particles.tsx # Particle effects
│       └── Scene.tsx     # Lighting & camera
├── stores/
│   └── bookStore.ts      # Zustand state management
├── hooks/
│   └── useCoverTexture.ts # Canvas text rendering
├── types/
│   └── book.ts           # TypeScript definitions
├── pages/                # Next.js demo (not in module)
├── dist/                 # Built module (generated)
├── index.ts              # Module entry point
├── package.json          # Module configuration
├── tsconfig.lib.json     # Build configuration
├── .npmignore            # Files to exclude from package
├── API.md                # API documentation
├── MODULE_USAGE.md       # Usage guide
├── RELEASE_GUIDE.md      # Release instructions
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT License
└── README.md             # Main documentation
```

## How It Works

### As a Library Module

1. **Build Process:**
   ```bash
   npm run build:lib
   ```
   - Compiles TypeScript to JavaScript
   - Generates `.d.ts` type definition files
   - Outputs to `dist/` directory

2. **Publishing:**
   ```bash
   npm pack
   ```
   - Creates a tarball: `babel-catalogue-1.0.0.tgz`
   - Includes only files specified in `files` array
   - Can be uploaded to GitHub Releases

3. **Installation by Users:**
   ```bash
   npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
   ```

4. **Usage:**
   ```tsx
   import { Book, Scene, useBookStore } from 'babel-catalogue';
   ```

### Automated Releases

1. **Developer creates tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions workflow:**
   - Detects new tag
   - Installs dependencies
   - Builds library (`npm run build:lib`)
   - Creates tarball (`npm pack`)
   - Creates GitHub Release
   - Attaches tarball to release

3. **Users install from release:**
   - Download link available on GitHub Releases page
   - Install via npm using the release URL

## What Gets Published

**Included in the package:**
- `dist/` - Compiled JavaScript and TypeScript definitions
- `components/` - Source TypeScript files
- `stores/` - Source TypeScript files
- `hooks/` - Source TypeScript files
- `types/` - Source TypeScript files
- `index.ts` - Module entry point
- `README.md` - Documentation
- `LICENSE` - MIT License

**Excluded from the package:**
- `pages/` - Next.js demo pages
- `node_modules/` - Dependencies
- `.next/` - Next.js build artifacts
- Development configuration files
- Internal documentation (BOOK_PHYSICS_GUIDE.md, etc.)

## Dependencies

**Peer Dependencies (user must install):**
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three` - 3D graphics library
- `react` & `react-dom` - React framework
- `zustand` - State management

**Direct Dependencies (bundled):**
- `@tweenjs/tween.js` - Animation library

**Dev Dependencies (not bundled):**
- Everything else (Next.js, Leva, TypeScript, etc.)

## Usage Examples

### Basic Integration
```tsx
import { Canvas } from '@react-three/fiber';
import { Book, Scene } from 'babel-catalogue';

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

### With Controls
```tsx
import { useBookStore } from 'babel-catalogue';

function Controls() {
  const { openBook, flipPage, triggerEmotion } = useBookStore();
  
  return (
    <div>
      <button onClick={() => openBook()}>Open</button>
      <button onClick={() => flipPage('forward')}>Next</button>
      <button onClick={() => triggerEmotion('focus')}>Focus</button>
    </div>
  );
}
```

### AI Integration
```tsx
function AIVisualizer({ aiState }) {
  const { triggerEmotion, setParticleIntensity } = useBookStore();
  
  useEffect(() => {
    if (aiState.thinking) {
      setParticleIntensity(0.9);
    } else if (aiState.confident) {
      triggerEmotion('focus');
    } else if (aiState.error) {
      triggerEmotion('paradox');
    }
  }, [aiState]);
  
  return <Book />;
}
```

## Benefits of This Setup

1. **Reusable:** Can be installed in any React Three Fiber project
2. **Type-Safe:** Full TypeScript support with generated `.d.ts` files
3. **Lightweight:** Peer dependencies reduce bundle size
4. **Automated:** GitHub Actions handle releases automatically
5. **Documented:** Comprehensive API and usage documentation
6. **Flexible:** Can be installed from GitHub releases or npm registry
7. **Maintainable:** Separate build configs for library and demo

## Next Steps

### For Maintainers

1. **Create first release:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Verify release:**
   - Check GitHub Releases page
   - Download tarball and test locally
   - Update documentation if needed

3. **Future releases:**
   - Update `package.json` version
   - Update `CHANGELOG.md`
   - Create and push new tag

### For Users

1. **Install the module:**
   ```bash
   npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
   ```

2. **Install peer dependencies:**
   ```bash
   npm install @react-three/fiber @react-three/drei three zustand
   ```

3. **Follow usage guide:**
   - See `MODULE_USAGE.md` for examples
   - See `API.md` for complete API reference

## Testing

### Test Locally Before Release

```bash
# Build the library
npm run build:lib

# Create tarball
npm pack

# In a test project
npm install /path/to/babel-catalogue-1.0.0.tgz

# Test the import
import { Book, Scene, useBookStore } from 'babel-catalogue';
```

### Test Installed Package

```tsx
// Create a minimal test app
import { Canvas } from '@react-three/fiber';
import { Book, Scene, useBookStore } from 'babel-catalogue';

function TestApp() {
  const { openBook } = useBookStore();
  
  useEffect(() => {
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

## Troubleshooting

**Build fails:**
- Check TypeScript errors: `npm run build:lib`
- Verify all imports are correct
- Ensure dependencies are installed

**Module not found after install:**
- Verify peer dependencies are installed
- Check package exports in `package.json`
- Ensure dist/ folder exists in package

**TypeScript errors in consumer project:**
- Install `@types/react` and `@types/three`
- Check tsconfig.json includes node_modules types

## Summary

The repository is now set up as both:
1. **A development environment** - Next.js demo with hot reload
2. **A distributable module** - Compiled library available via GitHub releases

The Next.js pages (`pages/` directory) serve as examples and development tools, while the core library (`components/`, `stores/`, `hooks/`, `types/`) is compiled and distributed as a module.

Users can integrate the 3D book into their projects without needing Next.js, just React Three Fiber and the peer dependencies.

