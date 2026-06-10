import { type ContainerLayoutRectangle, type Dimensions } from '../models';

export const isWithinDestroyArea = (
  x: number,
  y: number,
  elementSize: Dimensions,
  destroyAreaLayout?: ContainerLayoutRectangle
): boolean => {
  'worklet';

  if (!destroyAreaLayout) {
    return false;
  }

  const draggableLeft = x;
  const draggableRight = x + elementSize.width;
  const draggableTop = y;
  const draggableBottom = y + elementSize.height;

  const destroyLeft = destroyAreaLayout.x ?? 0;
  const destroyRight = destroyLeft + destroyAreaLayout.width;
  const destroyTop = destroyAreaLayout.y ?? 0;
  const destroyBottom = destroyTop + destroyAreaLayout.height;

  return (
    draggableLeft < destroyRight &&
    draggableRight > destroyLeft &&
    draggableTop < destroyBottom &&
    draggableBottom > destroyTop
  );
};
