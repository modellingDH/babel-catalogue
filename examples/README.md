# Babel Catalogue Examples

This folder contains example implementations of the babel-catalogue module.

## Standalone Example

The `standalone-example.tsx` file demonstrates a complete, self-contained usage of the babel-catalogue module with a specific configuration.

### Configuration

This example uses the following configuration:

```json
{
  "pageCount": 30,
  "currentPage": 15,
  "dimensions": {
    "height": 2,
    "width": 2,
    "depth": 0.6
  },
  "spineRotation": 0.5,
  "tilt": 0.2,
  "scale": 1,
  "frontHinge": 1.2566370614359172,
  "backHinge": 1.2566370614359172,
  "pageOpacity": 0.15,
  "pageColor": "#00ffcc",
  "glowIntensity": 1.8000000000000003,
  "coverColor": "#2effd0",
  "coverOpacity": 0.09999999999999998,
  "spineColor": "#ffffff",
  "frontCoverText": "",
  "backCoverText": "",
  "coverTextColor": "#939393",
  "particlesEnabled": false,
  "particleIntensity": 1
}
```

## Quick Start - Run the Example Directly

The easiest way to try the example is to run it directly from this folder:

1. **Navigate to the examples folder**:
   ```bash
   cd examples
   ```

2. **Build the parent library first** (if not already built):
   ```bash
   cd ..
   npm run build:lib
   cd examples
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   
   **Note**: This example requires React 19. If you encounter dependency conflicts, you can use:
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

The example will automatically load with the configured book settings.

## Installation

### Option 1: Using in an Existing React Project

If you already have a React project set up (Create React App, Vite, Next.js, etc.):

1. **Install peer dependencies** (if not already installed):
   ```bash
   npm install @react-three/fiber@^9.4.2 @react-three/drei@^10.7.7 three@^0.182.0 zustand@^5.0.9 react@^19.2.3 react-dom@^19.2.3
   ```
   
   **Note**: This module supports both React 18 and React 19, but the example uses React 19. If you prefer React 18, you may need to use `--legacy-peer-deps` flag.

2. **Install babel-catalogue**:
   ```bash
   # From GitHub release
   npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
   
   # Or if published to npm
   npm install babel-catalogue
   ```

3. **Copy the example file** to your project:
   ```bash
   cp examples/standalone-example.tsx src/StandaloneExample.tsx
   ```

4. **Import and use** in your app:
   ```tsx
   import StandaloneExample from './StandaloneExample';
   
   function App() {
     return <StandaloneExample />;
   }
   ```

### Option 2: Create a New Vite Project

For a quick start with a new project:

1. **Create a new Vite React TypeScript project**:
   ```bash
   npm create vite@latest babel-catalogue-example -- --template react-ts
   cd babel-catalogue-example
   npm install
   ```

2. **Install required dependencies**:
   ```bash
   npm install @react-three/fiber@^9.4.2 @react-three/drei@^10.7.7 three@^0.182.0 zustand@^5.0.9 react@^19.2.3 react-dom@^19.2.3
   npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
   ```

3. **Copy the example file**:
   ```bash
   cp ../examples/standalone-example.tsx src/App.tsx
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

### Option 3: Create a New Next.js Project

1. **Create a new Next.js project**:
   ```bash
   npx create-next-app@latest babel-catalogue-example --typescript
   cd babel-catalogue-example
   ```

2. **Install required dependencies**:
   ```bash
   npm install @react-three/fiber@^9.4.2 @react-three/drei@^10.7.7 three@^0.182.0 zustand@^5.0.9 react@^19.2.3 react-dom@^19.2.3
   npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
   ```

3. **Create a new page** (`app/book/page.tsx` or `pages/book.tsx`):
   ```tsx
   'use client'; // Only needed for App Router
   
   import StandaloneExample from '../../../examples/standalone-example';
   
   export default function BookPage() {
     return <StandaloneExample />;
   }
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Running the Example

Once you have the example set up in your project:

1. **Start your development server**:
   - Vite: `npm run dev`
   - Next.js: `npm run dev`
   - Create React App: `npm start`

2. **Open your browser** to the URL shown in the terminal (typically `http://localhost:5173` for Vite or `http://localhost:3000` for Next.js)

3. **You should see**:
   - A 3D book rendered in the center of the screen
   - The book automatically opens after a brief moment
   - Cyan-colored pages with a glow effect
   - Turquoise cover with low opacity
   - White spine

## Customization

To customize the book configuration, modify the values in the `BookConfigurator` component's `useEffect` hook:

```tsx
useEffect(() => {
  // Change these values to customize the book
  setPageCount(30);
  setPageColor('#00ffcc');
  setCoverColor('#2effd0');
  // ... etc
}, [/* dependencies */]);
```

## Troubleshooting

### Module Not Found Errors

If you see "Module not found" errors, ensure all peer dependencies are installed:

```bash
npm install @react-three/fiber@^9.4.2 @react-three/drei@^10.7.7 three@^0.182.0 zustand@^5.0.9 react@^19.2.3 react-dom@^19.2.3
```

### Dependency Resolution Errors

If you encounter `ERESOLVE` errors during installation:

1. **Try with legacy peer deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Or use exact versions** that match the main project:
   ```bash
   npm install @react-three/fiber@9.4.2 @react-three/drei@10.7.7 three@0.182.0 zustand@5.0.9 react@19.2.3 react-dom@19.2.3
   ```

### TypeScript Errors

If you get TypeScript errors, ensure you have the type definitions:

```bash
npm install --save-dev @types/react @types/three
```

### Build Errors

If you encounter build errors:

1. **Check Node.js version**: Ensure you're using Node.js 18 or higher
2. **Clear cache**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
3. **Check React version**: This example uses React 19. The module supports both React 18 and 19, but React 19 is recommended for the example

### Performance Issues

If the book renders slowly:

1. **Disable particles** (already disabled in this example):
   ```tsx
   setParticlesEnabled(false);
   ```

2. **Reduce page count**:
   ```tsx
   setPageCount(20); // Lower = better performance
   ```

3. **Lower glow intensity**:
   ```tsx
   setGlowIntensity(0.5); // Lower = better performance
   ```

## Additional Resources

- **Full API Documentation**: See [../API.md](../API.md)
- **Module Usage Guide**: See [../MODULE_USAGE.md](../MODULE_USAGE.md)
- **GitHub Repository**: https://github.com/modellingDH/babel-catalogue

## Support

- **GitHub Issues**: https://github.com/modellingDH/babel-catalogue/issues
- **Documentation**: https://github.com/modellingDH/babel-catalogue#readme

