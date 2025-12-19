/**
 * Poisson Disk Sampling for even spatial distribution
 * Prevents clustering by maintaining minimum distance between points
 */
export class PoissonDiskSampler {
  constructor(width, height, depth, minDistance) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.minDistance = minDistance;
    this.cellSize = minDistance / Math.sqrt(3);
    this.grid = new Map();
    this.active = [];
  }
  
  /**
   * Generate N evenly-distributed points
   * @param {number} count - Number of points to generate
   * @returns {Array<{x, y, z}>} Array of 3D points
   */
  sample(count) {
    const points = [];
    
    // Add first random point
    const first = this.randomPoint();
    this.addPoint(first);
    points.push(first);
    
    // Generate remaining points
    while (this.active.length > 0 && points.length < count) {
      const idx = Math.floor(Math.random() * this.active.length);
      const point = this.active[idx];
      
      let found = false;
      // Try 30 times to find a valid point around the current point
      for (let i = 0; i < 30; i++) {
        const newPoint = this.randomAround(point);
        if (this.isValid(newPoint)) {
          this.addPoint(newPoint);
          points.push(newPoint);
          found = true;
          break;
        }
      }
      
      // If no valid point found, remove from active list
      if (!found) {
        this.active.splice(idx, 1);
      }
    }
    
    // If we couldn't generate enough points, fill with random ones
    // (better than having no particles)
    while (points.length < count) {
      points.push(this.randomPoint());
    }
    
    return points;
  }
  
  randomPoint() {
    return {
      x: (Math.random() - 0.5) * this.width,
      y: (Math.random() - 0.5) * this.height,
      z: (Math.random() - 0.5) * this.depth
    };
  }
  
  randomAround(point) {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.minDistance * (1 + Math.random());
    return {
      x: point.x + Math.cos(angle) * radius,
      y: point.y + Math.sin(angle) * radius,
      z: point.z + (Math.random() - 0.5) * this.minDistance
    };
  }
  
  isValid(point) {
    // Check bounds
    if (Math.abs(point.x) > this.width / 2) return false;
    if (Math.abs(point.y) > this.height / 2) return false;
    if (Math.abs(point.z) > this.depth / 2) return false;
    
    // Get cell coordinates
    const cellX = Math.floor((point.x + this.width / 2) / this.cellSize);
    const cellY = Math.floor((point.y + this.height / 2) / this.cellSize);
    const cellZ = Math.floor((point.z + this.depth / 2) / this.cellSize);
    
    // Check neighboring cells for minimum distance
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${cellX + dx},${cellY + dy},${cellZ + dz}`;
          const neighbor = this.grid.get(key);
          if (neighbor) {
            const dist = Math.sqrt(
              Math.pow(point.x - neighbor.x, 2) +
              Math.pow(point.y - neighbor.y, 2) +
              Math.pow(point.z - neighbor.z, 2)
            );
            if (dist < this.minDistance) return false;
          }
        }
      }
    }
    
    return true;
  }
  
  addPoint(point) {
    const cellX = Math.floor((point.x + this.width / 2) / this.cellSize);
    const cellY = Math.floor((point.y + this.height / 2) / this.cellSize);
    const cellZ = Math.floor((point.z + this.depth / 2) / this.cellSize);
    const key = `${cellX},${cellY},${cellZ}`;
    this.grid.set(key, point);
    this.active.push(point);
  }
  
  clear() {
    this.grid.clear();
    this.active = [];
  }
}

