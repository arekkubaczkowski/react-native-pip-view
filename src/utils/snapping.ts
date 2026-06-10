import { type SharedValue } from 'react-native-reanimated';

import {
  type Dimensions,
  type EdgeSide,
  type Edges,
  type ScreenLayoutDimensions,
} from '../models';

export const getEdges = (
  currentContainerLayout: ScreenLayoutDimensions,
  currentScaledElementLayout: SharedValue<Dimensions>
): Edges => {
  'worklet';

  return {
    minY: currentContainerLayout.y ?? 0,
    minX:
      (currentContainerLayout.horizontalOffset ?? 0) +
      (currentContainerLayout.x ?? 0),

    maxX:
      currentContainerLayout.width -
      currentScaledElementLayout.value.width -
      (currentContainerLayout.horizontalOffset ?? 0),
    maxY:
      currentContainerLayout.height -
      currentScaledElementLayout.value.height -
      (currentContainerLayout.horizontalOffset ?? 0),
  };
};

export const getCurrentHorizontalSide = (
  x: number,
  containerWidth: number,
  elementWidth: number
): EdgeSide => {
  'worklet';
  return x < (containerWidth - elementWidth) / 2 ? 'left' : 'right';
};
