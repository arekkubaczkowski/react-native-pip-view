import { type SharedValue } from 'react-native-reanimated';

import { type Dimensions, type ScreenLayoutDimensions } from './models';

export const getEdges = (
  currentContainerLayout: ScreenLayoutDimensions,
  currentScaledElementLayout: SharedValue<Dimensions>,
) => {
  'worklet';

  return {
    minY: currentContainerLayout.y ?? 0,
    minX:
      (currentContainerLayout.horiozntalOffet ?? 0) +
      (currentContainerLayout.x ?? 0),

    maxX:
      currentContainerLayout.width -
      currentScaledElementLayout.value.width -
      (currentContainerLayout.horiozntalOffet ?? 0),
    maxY:
      currentContainerLayout.height -
      currentScaledElementLayout.value.height -
      (currentContainerLayout.horiozntalOffet ?? 0),
  };
};
