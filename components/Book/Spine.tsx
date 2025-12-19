/**
 * Spine Component
 * The central axis of the book - fixed depth, pages are density
 */
import { SpineProps } from '../../types/book';

export function Spine({ 
  width = 0.1, 
  height = 4, 
  depth = 0.6,
  color = '#666666',
  pageCount = 30
}: SpineProps) {
  // Spine depth is FIXED - doesn't change with page count
  // Page count represents DENSITY (how tightly packed pages are)
  
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
