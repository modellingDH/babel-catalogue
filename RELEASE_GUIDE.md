# Release Guide for Babel Catalogue

This guide explains how to create and publish releases for the Babel Catalogue module.

## Prerequisites

1. Ensure you have push access to the GitHub repository
2. Make sure all changes are committed and tests pass
3. Update the version in `package.json`
4. Update `CHANGELOG.md` with the new version changes

## Creating a Release

### Method 1: Automatic Release (Recommended)

This project uses GitHub Actions to automatically create releases when you push a version tag.

#### Steps:

1. **Update version in package.json**
   ```bash
   # Update version manually or use npm version
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```

2. **Update CHANGELOG.md**
   Add a new section for the version with changes:
   ```markdown
   ## [1.0.1] - 2025-12-23
   
   ### Fixed
   - Fixed particle performance issue
   
   ### Added
   - New color preset functions
   ```

3. **Commit changes**
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore: bump version to 1.0.1"
   ```

4. **Create and push tag**
   ```bash
   # Create a tag matching the version (must start with 'v')
   git tag v1.0.1
   
   # Push commits and tags
   git push origin main
   git push origin v1.0.1
   ```

5. **GitHub Actions will automatically:**
   - Build the library
   - Create a tarball (`.tgz` file)
   - Create a GitHub Release with the tarball attached
   - Generate release notes

### Method 2: Manual Release

If you need to create a release manually:

#### Steps:

1. **Build the library**
   ```bash
   npm run build:lib
   ```

2. **Create tarball**
   ```bash
   npm pack
   # This creates: babel-catalogue-1.0.0.tgz
   ```

3. **Create GitHub Release**
   - Go to https://github.com/modellingDH/babel-catalogue/releases
   - Click "Draft a new release"
   - Create a new tag (e.g., `v1.0.1`)
   - Set release title (e.g., "v1.0.1")
   - Add release notes from CHANGELOG.md
   - Upload the `.tgz` file
   - Click "Publish release"

## Using the Release

Once published, users can install your module:

### From GitHub Release

```bash
# Install specific version
npm install https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz

# Or add to package.json
{
  "dependencies": {
    "babel-catalogue": "https://github.com/modellingDH/babel-catalogue/releases/download/v1.0.0/babel-catalogue-1.0.0.tgz"
  }
}
```

### From Git Repository (Development)

```bash
# Install from main branch
npm install github:modellingDH/babel-catalogue

# Install from specific tag
npm install github:modellingDH/babel-catalogue#v1.0.0

# Install from specific branch
npm install github:modellingDH/babel-catalogue#develop
```

## Testing a Release Locally

Before publishing, test the package locally:

### Method 1: Using npm link

```bash
# In babel-catalogue directory
npm run build:lib
npm link

# In your test project
npm link babel-catalogue
```

### Method 2: Using npm pack

```bash
# In babel-catalogue directory
npm run build:lib
npm pack

# Copy the .tgz file to your test project
cp babel-catalogue-1.0.0.tgz /path/to/test-project/

# In test project
npm install ./babel-catalogue-1.0.0.tgz
```

### Method 3: Using file path

```bash
# In your test project's package.json
{
  "dependencies": {
    "babel-catalogue": "file:../babel-catalogue"
  }
}

# Then run
npm install
```

## Publishing to NPM (Optional)

If you want to publish to the public NPM registry:

### Prerequisites

1. Create an NPM account at https://www.npmjs.com/signup
2. Login to NPM:
   ```bash
   npm login
   ```

### Steps

1. **Update package.json**
   Ensure all fields are correct (name, description, keywords, etc.)

2. **Build the library**
   ```bash
   npm run build:lib
   ```

3. **Test the package**
   ```bash
   npm pack
   # Test the tarball in a separate project
   ```

4. **Publish**
   ```bash
   # Dry run first to see what would be published
   npm publish --dry-run
   
   # If everything looks good
   npm publish
   ```

5. **Verify**
   Check your package at: https://www.npmjs.com/package/babel-catalogue

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** version (1.0.0 -> 1.1.0): New features (backward compatible)
- **PATCH** version (1.0.0 -> 1.0.1): Bug fixes (backward compatible)

Examples:
- `1.0.1` - Bug fix release
- `1.1.0` - Added new features (e.g., new emotion types)
- `2.0.0` - Breaking changes (e.g., changed API signature)

## Release Checklist

Before creating a release, ensure:

- [ ] All tests pass (if you have tests)
- [ ] Code is linted and formatted
- [ ] `package.json` version is updated
- [ ] `CHANGELOG.md` is updated with changes
- [ ] Documentation is updated (README.md, API.md)
- [ ] Build succeeds: `npm run build:lib`
- [ ] Package can be installed locally (test with `npm pack`)
- [ ] All dependencies are correctly specified as `peerDependencies`
- [ ] TypeScript definitions are generated correctly
- [ ] Git tag matches package.json version

## Automated Release with GitHub Actions

The included `.github/workflows/release.yml` automatically:

1. Triggers on version tags (e.g., `v1.0.0`)
2. Installs dependencies
3. Builds the library
4. Creates a tarball
5. Creates a GitHub Release with:
   - The tarball attached
   - Auto-generated release notes
   - Version from the tag

To use it:
```bash
git tag v1.0.1
git push origin v1.0.1
```

Then check: https://github.com/modellingDH/babel-catalogue/releases

## Troubleshooting

### Build fails
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compilation: `npx tsc --project tsconfig.lib.json`
- Check for syntax errors or type issues

### Tag already exists
```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag (careful!)
git push origin :refs/tags/v1.0.0

# Create new tag
git tag v1.0.0
git push origin v1.0.0
```

### Release asset upload fails
- Ensure the tarball exists: `ls *.tgz`
- Check GitHub Actions logs for errors
- Verify you have the correct permissions

### Users can't install the package
- Verify the release exists: https://github.com/modellingDH/babel-catalogue/releases
- Check the download URL is correct
- Ensure the repository is public (or users have access)

## Support

For issues or questions:
- GitHub Issues: https://github.com/modellingDH/babel-catalogue/issues
- Repository: https://github.com/modellingDH/babel-catalogue

