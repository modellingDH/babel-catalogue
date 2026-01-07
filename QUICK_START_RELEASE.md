# Quick Start: Creating Your First Release

Follow these steps to create your first GitHub release of Babel Catalogue as a module.

## Prerequisites

- [x] Repository is configured as a module (already done!)
- [ ] You have push access to the repository
- [ ] You have committed all your changes

## Step-by-Step Guide

### 1. Verify the Build Works

```bash
cd /Users/alessioantonini/Code/babel-catalogue

# Clean and build
rm -rf dist
npm run build:lib

# Verify dist folder has files
ls dist/
```

You should see `.js` and `.d.ts` files in the dist folder.

### 2. Commit All Changes (if not already done)

```bash
# Check what's changed
git status

# Add all files (the build output is in .gitignore, so won't be committed)
git add .

# Commit
git commit -m "chore: prepare module for release"
```

### 3. Push to GitHub

```bash
# Push your changes
git push origin main
```

### 4. Create and Push a Version Tag

```bash
# Create a tag for version 1.0.0
git tag v1.0.0

# Push the tag (this triggers the GitHub Action)
git push origin v1.0.0
```

### 5. Wait for GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. You should see a workflow running called "Create Release"
4. Wait for it to complete (usually takes 1-2 minutes)

### 6. Verify the Release

1. Go to your repository on GitHub
2. Click "Releases" (on the right sidebar)
3. You should see "v1.0.0" release
4. It should have a `.tgz` file attached

### 7. Test Installing the Module

Create a test project to verify the module works:

```bash
# Create a test directory
mkdir /tmp/babel-test
cd /tmp/babel-test

# Initialize a new project
npm init -y

# Install dependencies
npm install react react-dom @react-three/fiber @react-three/drei three zustand

# Install your module from the release
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz

# Verify it's installed
npm list babel-catalogue
```

### 8. Create a Test File

Create `test.jsx`:

```jsx
import { Book, Scene, useBookStore } from 'babel-catalogue';
import { Canvas } from '@react-three/fiber';

function App() {
  const { openBook } = useBookStore();
  
  React.useEffect(() => {
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

If the import doesn't throw errors, your module is working! ✅

## Quick Reference

### Creating Future Releases

```bash
# 1. Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1

# 2. Update CHANGELOG.md with changes

# 3. Commit
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"

# 4. Create and push tag
git tag v1.0.1
git push origin main
git push origin v1.0.1

# 5. GitHub Actions automatically creates the release
```

### Installation URL Format

```bash
npm install https://github.com/OWNER/REPO/releases/download/TAG/PACKAGE-VERSION.tgz
```

For your repository:
```bash
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
```

## Troubleshooting

### "Permission denied" when pushing tag
- Make sure you have push access to the repository
- Check you're logged into the correct GitHub account

### GitHub Action fails
1. Go to Actions tab
2. Click on the failed workflow
3. Check the logs for errors
4. Common issues:
   - Build errors: Fix TypeScript/lint issues
   - Missing dependencies: Update package.json
   - Permission issues: Check repository settings

### Release doesn't appear
- Wait a minute, it might still be processing
- Check the Actions tab for running workflows
- Verify the tag was pushed: `git ls-remote --tags origin`

### Module can't be installed
- Verify the release exists at: https://github.com/modellingDH/babel-catalogue/releases
- Check the repository is public (or user has access if private)
- Verify the URL format is correct

## What's Next?

### Share Your Module

Add to your project's README:

```markdown
## Installation

\`\`\`bash
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz
\`\`\`
```

### Publish to NPM (Optional)

If you want to publish to the public npm registry:

```bash
# Login to npm
npm login

# Publish (after building)
npm run build:lib
npm publish
```

Then users can install with:
```bash
npm install babel-catalogue
```

## Summary

Your module is now:
- ✅ Built and compiled
- ✅ Available as a GitHub Release
- ✅ Installable via npm
- ✅ Includes TypeScript definitions
- ✅ Has comprehensive documentation

Users can now integrate the 3D book into their React Three Fiber projects!

For more details, see:
- [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - Detailed release instructions
- [MODULE_USAGE.md](./MODULE_USAGE.md) - How users integrate the module
- [API.md](./API.md) - Complete API reference

