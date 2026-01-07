# Changelog

All notable changes to the Babel Catalogue module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-22

### Added
- Initial release as reusable module
- `Book` component with full 3D animated book
- `Scene` component for lighting and camera controls
- `useBookStore` Zustand store for book state management
- Comprehensive API for controlling book animations
- Emotion system: focus, drift, paradox
- Material morphing: leather, metal, glass
- Page flipping animations (single and multiple)
- Particle system for visual effects
- Cover text rendering with custom fonts
- TypeScript type definitions
- Full API documentation

### Components
- Book - Main book component
- Cover - Book cover with text
- Page - Individual pages with glow effects
- Spine - Book spine
- Particles - GPU-accelerated particle system
- Scene - Lighting and camera setup

### Hooks
- useCoverTexture - Canvas-based text rendering

### Store Actions
- openBook / closeBook
- flipPage / flipPages / toggleContinuousFlip
- triggerEmotion (focus, drift, paradox)
- morphMaterial (leather, metal, glass)
- Complete configuration setters for all visual properties

### Features
- Physics-based book mechanics
- Infinite page density system
- Smooth animations with easing
- GPU-optimized particle effects
- Real-time state visualization
- Responsive to AI cognitive states

