/**
 * Babel Catalogue - 3D Animated Book Module
 * A React Three Fiber component for visualizing AI cognitive states
 * 
 * @module babel-catalogue
 */

// Export main components
export { Book } from './components/Book/Book';
export { Cover } from './components/Book/Cover';
export { Page } from './components/Book/Page';
export { Spine } from './components/Book/Spine';
export { Particles } from './components/Book/Particles';
export { Scene } from './components/Book/Scene';

// Export hooks
export { useCoverTexture } from './hooks/useCoverTexture';

// Export store
export { useBookStore } from './stores/bookStore';

// Export types
export type {
  BookConfig,
  BookDimensions,
  PageProps,
  CoverProps,
  SpineProps,
  ParticleProps,
} from './types/book';

