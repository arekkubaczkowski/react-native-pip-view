import { type Dimensions } from '../models';

/**
 * Check if the draggable element overlaps with a destroy/highlight area
 * @param x - Current X position of draggable
 * @param y - Current Y position of draggable
 * @param scaledElementLayout - Dimensions of the scaled element
 * @param destroyAreaLayout - Layout configuration of the destroy area
 * @returns true if overlapping, false otherwise
 */
export const isWithinDestroyArea = (
  x: number,
  y: number,
  scaledElementLayout: Dimensions,
  destroyAreaLayout?: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }
): boolean => {
  'worklet';

  if (!destroyAreaLayout) {
    return false;
  }

  const draggableLeft = x;
  const draggableRight = x + scaledElementLayout.width;
  const draggableTop = y;
  const draggableBottom = y + scaledElementLayout.height;

  const highlightedLeft = destroyAreaLayout.x ?? 0;
  const highlightedRight = highlightedLeft + destroyAreaLayout.width;
  const highlightedTop = destroyAreaLayout.y ?? 0;
  const highlightedBottom = highlightedTop + destroyAreaLayout.height;

  return (
    draggableLeft < highlightedRight &&
    draggableRight > highlightedLeft &&
    draggableTop < highlightedBottom &&
    draggableBottom > highlightedTop
  );
};
