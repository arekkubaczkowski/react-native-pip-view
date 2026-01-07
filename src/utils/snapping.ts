import { type SharedValue } from 'react-native-reanimated';

import {
  type Dimensions,
  type ScreenLayoutDimensions,
  type Edges,
} from '../models';

/**
 * Calculate the boundaries (edges) within which the PiP view can move
 * @param currentContainerLayout - The layout dimensions of the container
 * @param currentScaledElementLayout - The scaled dimensions of the PiP element
 * @returns The min/max X and Y coordinates for the PiP view
 */
export const getEdges = (
  currentContainerLayout: ScreenLayoutDimensions,
  currentScaledElementLayout: SharedValue<Dimensions>
): Edges => {
  'worklet';

  return {
    minY: currentContainerLayout.y ?? 0,
    minX:
      (currentContainerLayout.horizontalOffet ?? 0) +
      (currentContainerLayout.x ?? 0),

    maxX:
      currentContainerLayout.width -
      currentScaledElementLayout.value.width -
      (currentContainerLayout.horizontalOffet ?? 0),
    maxY:
      currentContainerLayout.height -
      currentScaledElementLayout.value.height -
      (currentContainerLayout.horizontalOffet ?? 0),
  };
};

/**
 * Find the nearest Y edge (top or bottom) to snap to
 * @param y - Current Y position
 * @param edges - The boundary edges
 * @returns The nearest Y edge coordinate
 */
export const findNearestYEdge = (y: number, edges: Edges): number => {
  'worklet';
  const midY = (edges.minY + edges.maxY) / 2;
  return y < midY ? edges.minY : edges.maxY;
};

/**
 * Determine which horizontal side the element is on
 * @param x - Current X position
 * @param containerWidth - Width of the container
 * @param elementWidth - Width of the element
 * @returns 'left' or 'right' side
 */
export const getCurrentHorizontalSide = (
  x: number,
  containerWidth: number,
  elementWidth: number
): 'left' | 'right' => {
  'worklet';
  return x < (containerWidth - elementWidth) / 2 ? 'left' : 'right';
};
