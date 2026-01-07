import { gesture } from '../styles/theme';

/**
 * Apply resistance when dragging beyond boundaries
 * Makes the element harder to drag past edges
 * @param offset - Current offset value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Adjusted offset with resistance applied
 */
export const applyResistance = (
  offset: number,
  min: number,
  max: number
): number => {
  'worklet';
  if (offset < min) {
    return min + (offset - min) * gesture.resistanceFactor;
  } else if (offset > max) {
    return max + (offset - max) * gesture.resistanceFactor;
  } else {
    return offset;
  }
};

/**
 * Check if the element has been dragged beyond the overdrag threshold
 * Used to determine if element should be hidden off-screen
 * @param x - Current X position
 * @param minX - Minimum X boundary
 * @param maxX - Maximum X boundary
 * @param overDragOffset - Threshold distance for overdrag
 * @returns Tuple [isOverDraggedLeft, isOverDraggedRight]
 */
export const checkOverDrag = (
  x: number,
  minX: number,
  maxX: number,
  overDragOffset: number
): [boolean, boolean] => {
  'worklet';

  const overDragLeftPosition = minX - x;
  const overDragRightPosition = x - maxX;

  const isOverDraggedLeft = overDragLeftPosition > overDragOffset;
  const isOverDraggedRight = overDragRightPosition > overDragOffset;

  return [isOverDraggedLeft, isOverDraggedRight];
};
