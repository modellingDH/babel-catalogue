import * as THREE from 'three';

/**
 * MaterialManager - Centralized material management
 * Single source of truth for all materials, handles syncing and updates
 */
export class MaterialManager {
  constructor() {
    this.materials = new Map();
    this.synced = new Map(); // Track synced material groups
  }
  
  /**
   * Create a new material
   * @param {string} name - Material identifier
   * @param {string} type - THREE material type ('MeshStandardMaterial', etc.)
   * @param {Object} options - Material options
   * @returns {THREE.Material} Created material
   */
  create(name, type = 'MeshStandardMaterial', options = {}) {
    const MaterialClass = THREE[type];
    if (!MaterialClass) {
      throw new Error(`Unknown material type: ${type}`);
    }
    
    const material = new MaterialClass(options);
    this.materials.set(name, material);
    return material;
  }
  
  /**
   * Get a material by name
   * @param {string} name - Material identifier
   * @returns {THREE.Material|undefined} Material or undefined if not found
   */
  get(name) {
    return this.materials.get(name);
  }
  
  /**
   * Create a synced group of materials
   * All materials in the group will be updated together
   * @param {string} groupName - Group identifier
   * @param {Array<string>} materialNames - Names of materials to sync
   */
  createSyncedGroup(groupName, materialNames) {
    const materials = materialNames
      .map(name => this.materials.get(name))
      .filter(mat => mat !== undefined);
    
    if (materials.length === 0) {
      console.warn(`No materials found for synced group: ${groupName}`);
      return;
    }
    
    this.synced.set(groupName, materials);
  }
  
  /**
   * Update a property on all materials in a synced group
   * @param {string} groupName - Group identifier
   * @param {string} property - Property to update
   * @param {any} value - New value
   */
  updateSynced(groupName, property, value) {
    const materials = this.synced.get(groupName);
    if (!materials) {
      console.warn(`Synced group not found: ${groupName}`);
      return;
    }
    
    materials.forEach(material => {
      if (property === 'color') {
        material.color.set(value);
      } else if (property in material) {
        material[property] = value;
      }
      material.needsUpdate = true;
    });
  }
  
  /**
   * Set color for a material or synced group
   * @param {string} nameOrGroup - Material name or group name
   * @param {number|string} color - Color (hex number or CSS string)
   */
  setColor(nameOrGroup, color) {
    // Try as individual material first
    const material = this.materials.get(nameOrGroup);
    if (material) {
      material.color.set(color);
      material.needsUpdate = true;
      return;
    }
    
    // Try as synced group
    this.updateSynced(nameOrGroup, 'color', color);
  }
  
  /**
   * Set transparency for a material or synced group
   * @param {string} nameOrGroup - Material name or group name
   * @param {number} opacity - Opacity value (0.0-1.0)
   */
  setTransparency(nameOrGroup, opacity) {
    const clampedOpacity = Math.max(0, Math.min(1.0, opacity));
    
    // Try as individual material first
    const material = this.materials.get(nameOrGroup);
    if (material) {
      material.opacity = clampedOpacity;
      material.transparent = clampedOpacity < 1.0;
      material.needsUpdate = true;
      return;
    }
    
    // Try as synced group
    const materials = this.synced.get(nameOrGroup);
    if (materials) {
      materials.forEach(mat => {
        mat.opacity = clampedOpacity;
        mat.transparent = clampedOpacity < 1.0;
        mat.needsUpdate = true;
      });
    }
  }
  
  /**
   * Create material presets
   * @param {string} preset - Preset name ('leather', 'metal', 'glass')
   * @returns {Object} Material options
   */
  static getPreset(preset) {
    const presets = {
      leather: {
        color: 0x2b1e16,
        roughness: 0.8,
        metalness: 0.1,
      },
      metal: {
        color: 0x777777,
        roughness: 0.3,
        metalness: 0.9,
      },
      glass: {
        color: 0xffffff,
        roughness: 0.0,
        metalness: 0.0,
        opacity: 0.3,
        transparent: true,
      }
    };
    
    return presets[preset] || presets.leather;
  }
  
  /**
   * Apply a preset to a material or synced group
   * @param {string} nameOrGroup - Material name or group name
   * @param {string} preset - Preset name
   */
  applyPreset(nameOrGroup, preset) {
    const options = MaterialManager.getPreset(preset);
    
    // Try as individual material first
    const material = this.materials.get(nameOrGroup);
    if (material) {
      Object.entries(options).forEach(([key, value]) => {
        if (key === 'color') {
          material.color.set(value);
        } else {
          material[key] = value;
        }
      });
      material.needsUpdate = true;
      return;
    }
    
    // Try as synced group
    const materials = this.synced.get(nameOrGroup);
    if (materials) {
      materials.forEach(mat => {
        Object.entries(options).forEach(([key, value]) => {
          if (key === 'color') {
            mat.color.set(value);
          } else {
            mat[key] = value;
          }
        });
        mat.needsUpdate = true;
      });
    }
  }
  
  /**
   * Dispose of all materials
   */
  dispose() {
    this.materials.forEach(material => {
      material.dispose();
    });
    this.materials.clear();
    this.synced.clear();
  }
  
  /**
   * Get all material names
   * @returns {Array<string>} Array of material names
   */
  getMaterialNames() {
    return Array.from(this.materials.keys());
  }
  
  /**
   * Get all synced group names
   * @returns {Array<string>} Array of group names
   */
  getSyncedGroupNames() {
    return Array.from(this.synced.keys());
  }
}

