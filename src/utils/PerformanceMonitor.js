/**
 * Performance monitoring utility
 * Tracks FPS and frame times to detect performance issues
 */
export class PerformanceMonitor {
  constructor(sampleSize = 60) {
    this.sampleSize = sampleSize;
    this.frames = [];
    this.lastTime = performance.now();
    this.listeners = [];
  }
  
  /**
   * Update the performance monitor (call once per frame)
   * @returns {Object} Performance metrics
   */
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    this.frames.push(delta);
    if (this.frames.length > this.sampleSize) {
      this.frames.shift();
    }
    
    const metrics = this.getMetrics();
    
    // Notify listeners if FPS drops below threshold
    if (metrics.fps < 50) {
      this.notifyListeners('lowFPS', metrics);
    }
    
    return metrics;
  }
  
  /**
   * Get current performance metrics
   * @returns {Object} Metrics object with fps, avgFrameTime, minFPS, maxFPS
   */
  getMetrics() {
    if (this.frames.length === 0) {
      return { fps: 60, avgFrameTime: 16.67, minFPS: 60, maxFPS: 60 };
    }
    
    const sum = this.frames.reduce((a, b) => a + b, 0);
    const avgDelta = sum / this.frames.length;
    const fps = 1000 / avgDelta;
    
    const minDelta = Math.min(...this.frames);
    const maxDelta = Math.max(...this.frames);
    const maxFPS = 1000 / minDelta;
    const minFPS = 1000 / maxDelta;
    
    return {
      fps: Math.round(fps * 10) / 10,
      avgFrameTime: Math.round(avgDelta * 100) / 100,
      minFPS: Math.round(minFPS * 10) / 10,
      maxFPS: Math.round(maxFPS * 10) / 10
    };
  }
  
  /**
   * Subscribe to performance events
   * @param {string} event - Event name ('lowFPS')
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    this.listeners.push({ event, callback });
  }
  
  /**
   * Unsubscribe from performance events
   * @param {Function} callback - Callback to remove
   */
  off(callback) {
    this.listeners = this.listeners.filter(l => l.callback !== callback);
  }
  
  /**
   * Notify all listeners of an event
   * @private
   */
  notifyListeners(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }
  
  /**
   * Reset the monitor
   */
  reset() {
    this.frames = [];
    this.lastTime = performance.now();
  }
  
  /**
   * Get a formatted performance report
   * @returns {string} Formatted report
   */
  getReport() {
    const metrics = this.getMetrics();
    return `FPS: ${metrics.fps} (${metrics.minFPS}-${metrics.maxFPS}) | Frame: ${metrics.avgFrameTime}ms`;
  }
}

