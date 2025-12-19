/**
 * Constants for Babel Catalogue
 * Centralized location for all magic numbers and configuration values
 */

// === GEOMETRY CONSTANTS ===
export const GEOMETRY = {
  // Book dimensions (default)
  DEFAULT_HEIGHT: 4,
  DEFAULT_WIDTH: 3,
  DEFAULT_DEPTH: 0.7,
  
  // Component sizes
  SPINE_WIDTH: 0.1,
  COVER_THICKNESS: 0.05,
  
  // Page sizing (relative to book dimensions)
  PAGE_WIDTH_RATIO: 0.93,  // Pages are 93% of book width
  PAGE_HEIGHT_RATIO: 0.95, // Pages are 95% of book height
  
  // Positioning (from concept.html)
  CONCEPT_BASE_Z: -0.25,
  CONCEPT_SPACING: 0.035,
  CONCEPT_DEPTH: 0.6,
  
  // Pivot positions
  PIVOT_X: 0.06,
  PIVOT_Z_FRONT: 0.3,
  PIVOT_Z_BACK: -0.3,
  
  // Mesh positions
  COVER_MESH_X: 1.5,
  PAGE_MESH_X: 1.4,
};

// === MATERIAL CONSTANTS ===
export const MATERIALS = {
  // Cover presets
  LEATHER_COLOR: 0x2b1e16,
  METAL_COLOR: 0x777777,
  GLASS_COLOR: 0xffffff,
  
  // Page defaults
  PAGE_COLOR: 0x00ffcc,
  PAGE_OPACITY: 0.6,
  PAGE_EMISSIVE_INTENSITY: 0.3,
  
  // Spine defaults
  SPINE_COLOR: 0x666666,
};

// === LIGHTING CONSTANTS ===
export const LIGHTING = {
  // Ambient light
  AMBIENT_INTENSITY: 1.0,
  AMBIENT_COLOR: 0xffffff,
  
  // Point light
  POINT_INTENSITY: 1.5,
  POINT_COLOR: 0x00ffcc,
  POINT_DISTANCE: 50,
  POINT_POSITION: [5, 5, 5],
  
  // Directional light
  DIR_INTENSITY: 0.5,
  DIR_COLOR: 0xffffff,
  DIR_POSITION: [-5, 5, 5],
};

// === CAMERA CONSTANTS ===
export const CAMERA = {
  FOV: 45,
  NEAR: 0.1,
  FAR: 1000,
  POSITION: [6, 4, 10],
  LOOK_AT: [0, 0, 0],
};

// === PARTICLE CONSTANTS ===
export const PARTICLES = {
  // Defaults
  DEFAULT_COUNT: 1500,
  DEFAULT_INTENSITY: 0.0,
  
  // Distribution
  POISSON_MIN_DISTANCE: 0.1,
  SPAWN_WIDTH_RATIO: 0.8,   // Particles spawn in 80% of book width
  SPAWN_HEIGHT_RATIO: 0.5,  // Particles spawn in 50% of book height
  SPAWN_DEPTH_RATIO: 0.5,   // Particles spawn in 50% of book depth
  
  // Appearance
  SIZE: 0.02,
  OPACITY: 0.6,
  COLOR: 0x00ffcc,
  
  // Physics
  VELOCITY_X_RANGE: 0.02,
  VELOCITY_Y_MIN: 0.02,
  VELOCITY_Y_MAX: 0.05,
  VELOCITY_Z_RANGE: 0.01,
  
  // Lifecycle
  MAX_HEIGHT_OFFSET: 2, // Particles disappear bookHeight/2 + this value above book
  SPAWN_HEIGHT_OFFSET: 0.25, // Spawn height relative to book base
};

// === ANIMATION CONSTANTS ===
export const ANIMATION = {
  // Page flip
  FLIP_DURATION: 700,         // ms
  FLIP_DELAY_PER_PAGE: 60,    // ms
  SINGLE_FLIP_DURATION: 500,  // ms
  
  // Glitch effect
  GLITCH_DURATION: 50,        // ms
  GLITCH_REPEATS: 4,
  GLITCH_AMPLITUDE: 0.3,
  
  // Hover animation
  HOVER_SPEED: 0.002,
  HOVER_AMPLITUDE: 0.3,
  
  // Glow transitions
  GLOW_SMOOTHING: 0.9, // Higher = smoother but slower transitions
};

// === CONTROLS CONSTANTS ===
export const CONTROLS = {
  // OrbitControls
  DAMPING_FACTOR: 0.05,
  MIN_DISTANCE: 3,
  MAX_DISTANCE: 20,
  
  // Interaction
  ENABLE_PAN: false,
  ENABLE_DAMPING: true,
};

// === CANVAS CONSTANTS ===
export const CANVAS = {
  // Page content
  PAGE_CONTENT_SIZE: 512,
  CONTENT_COLUMNS: 8,
  CONTENT_LINE_HEIGHT: 12,
  CONTENT_FONT: '10px monospace',
  CONTENT_COLOR: 'rgba(0, 255, 204, 0.3)',
  
  // Cover text
  COVER_CANVAS_SIZE: 512,
  COVER_FONT: 'bold 48px serif',
  COVER_TEXT_COLOR: 'rgba(255, 255, 255, 0.9)',
  COVER_MAX_WIDTH_RATIO: 0.8,
  COVER_LINE_HEIGHT: 60,
  COVER_PADDING: 40,
  
  // Symbols for procedural content
  SYMBOLS: ['▮', '▯', '▰', '▱', '▪', '▫', '◼', '◻', '●', '○', '◆', '◇'],
};

// === PERFORMANCE CONSTANTS ===
export const PERFORMANCE = {
  // Monitoring
  FPS_SAMPLE_SIZE: 60,
  LOW_FPS_THRESHOLD: 50,
  
  // Optimization thresholds
  HIGH_PARTICLE_COUNT: 2000,
  ENABLE_FRUSTUM_CULLING: true,
  
  // Update frequencies (in frames)
  GLOW_UPDATE_FREQUENCY: 1,      // Every frame
  PARTICLE_UPDATE_FREQUENCY: 1,  // Every frame
  CONTENT_UPDATE_FREQUENCY: 1,   // Every frame
};

// === DEBUG CONSTANTS ===
export const DEBUG = {
  // Helpers
  AXES_SIZE: 5,
  GRID_SIZE: 10,
  GRID_DIVISIONS: 10,
  
  // Wireframe
  WIREFRAME_COLOR: 0xff00ff,
  WIREFRAME_OPACITY: 0.5,
  
  // Logging
  LOG_PAGE_POSITIONS: true,
  LOG_PERFORMANCE: true,
  PERFORMANCE_LOG_INTERVAL: 60, // frames
};

// === VALIDATION RANGES ===
export const RANGES = {
  // Glow
  GLOW_MIN: 0.0,
  GLOW_MAX: 2.0,
  
  // Confidence
  CONFIDENCE_MIN: 0.0,
  CONFIDENCE_MAX: 1.0,
  
  // Particle intensity
  PARTICLE_INTENSITY_MIN: 0.0,
  PARTICLE_INTENSITY_MAX: 1.0,
  
  // Scroll speed
  SCROLL_SPEED_MIN: 0.0,
  SCROLL_SPEED_MAX: 5.0,
  
  // Opacity
  OPACITY_MIN: 0.0,
  OPACITY_MAX: 1.0,
};

