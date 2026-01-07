/**
 * Theme constants for the PiP View component
 * Contains all magic numbers, styling values, and configuration constants
 */

/**
 * Z-index values for layering
 */
export const zIndex = {
  destroyArea: 999,
  pipContainer: 9999,
} as const;

/**
 * Opacity values for different states
 */
export const opacity = {
  hidden: 0,
  dimmed: 0.7,
  visible: 1,
} as const;

/**
 * Scale values for pinch gestures
 */
export const scale = {
  min: 0.5 as number,
  max: 1.5 as number,
  small: 0.7 as number,
  smallThreshold: 0.85 as number,
  normal: 1 as number,
  normalThreshold: 1.15 as number,
  large: 1.3 as number,
  highlighted: 0.9 as number,
} as const;

/**
 * Gesture behavior constants
 */
export const gesture = {
  resistanceFactor: 0.5,
  velocityYMultiplier: 0.1,
  velocityXMultiplier: 0.05,
  velocityThreshold: 1700,
  scaleResistanceFactor: 0.4,
} as const;

/**
 * Drag and snap behavior constants
 */
export const drag = {
  overDragOffsetMultiplier: 0.4,
  hiddenEdgePadding: 50,
} as const;

/**
 * Animation timing constants
 */
export const timing = {
  destroyDelay: 150,
  initializationDelay: 200,
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  destroyArea: 16,
} as const;

/**
 * Default colors for destroy area
 */
export const colors = {
  destroyAreaActive: 'rgba(255, 255, 255, 0.15)',
  destroyAreaInactive: 'rgba(255, 255, 255, 0.05)',
  transparent: 'transparent',
} as const;
