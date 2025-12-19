/**
 * Custom hook for creating cover textures from text
 */
import { useMemo } from 'react';
import * as THREE from 'three';

export function useCoverTexture(
  text: string | undefined, 
  textColor: string = '#c9a876',
  isFront: boolean = true
) {
  return useMemo(() => {
    if (!text) return null;
    
    // Create canvas for texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Setup text style
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Handle multi-line text
    const lines = text.split('\n');
    const fontSize = Math.min(48, Math.floor(400 / lines.length));
    ctx.font = `bold ${fontSize}px serif`;
    
    // Draw text lines
    const startY = 256 - ((lines.length - 1) * (fontSize + 10)) / 2;
    lines.forEach((line, i) => {
      const y = startY + i * (fontSize + 10);
      
      // Word wrap for long lines
      const words = line.split(' ');
      const maxWidth = 450;
      let currentLine = '';
      let currentY = y;
      
      words.forEach((word, wordIndex) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          ctx.fillText(currentLine, 256, currentY);
          currentLine = word;
          currentY += fontSize + 5;
        } else {
          currentLine = testLine;
        }
        
        // Last word
        if (wordIndex === words.length - 1) {
          ctx.fillText(currentLine, 256, currentY);
        }
      });
    });
    
    // Add decorative border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 472);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, [text, textColor, isFront]);
}

