import { clamp, useDerivedValue } from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';
import { isWithinDestroyArea as isWithinDestroyAreaUtil } from '../utils/destroyArea';

const HIDDEN_EDGE_PADDING = 50;

export const useDragHelpers = () => {
  const _providedEdges = usePiPViewContext((state) => state.edges);
  const scaledElementLayout = usePiPViewContext(
    (state) => state.scaledElementLayout
  );
  const hideable = usePiPViewContext((state) => state.hideable);
  const translationX = usePiPViewContext((state) => state.translationX);
  const overDragOffset = usePiPViewContext((state) => state.overDragOffset);
  const dockSide = usePiPViewContext((state) => state.dockSide);
  const destroyArea = usePiPViewContext((state) => state.destroyArea);

  const edges = useDerivedValue(
    () =>
      _providedEdges.value || {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      }
  );

  const checkOverDrag = (x: number): [boolean, boolean] => {
    'worklet';

    if (!hideable) {
      return [false, false];
    }
    const overDragLeftPosition = edges.get().minX - x;
    const overDragRightPosition = x - edges.get().maxX;

    const isOverDraggedLeft = overDragLeftPosition > overDragOffset.get();
    const isOverDraggedRight = overDragRightPosition > overDragOffset.get();

    return [isOverDraggedLeft, isOverDraggedRight];
  };

  const findNearestYEdge = (y: number) => {
    'worklet';
    const midY = (edges.get().minY + edges.get().maxY) / 2;
    return y < midY ? edges.get().minY : edges.get().maxY;
  };

  const isWithinDestroyArea = (x: number, y: number) => {
    'worklet';
    return isWithinDestroyAreaUtil(
      x,
      y,
      scaledElementLayout.get(),
      destroyArea?.layout
    );
  };

  const handleHideTransition = (targetX: number, side: EdgeSide) => {
    'worklet';
    translationX.set(
      clamp(
        targetX,
        edges.get().minX -
          scaledElementLayout.get().width -
          HIDDEN_EDGE_PADDING,
        edges.get().maxX + scaledElementLayout.get().width + HIDDEN_EDGE_PADDING
      )
    );

    dockSide.set(side);
  };

  return {
    handleHideTransition,
    isWithinDestroyArea,
    findNearestYEdge,
    checkOverDrag,
  };
};
