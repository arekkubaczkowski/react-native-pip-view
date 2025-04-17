import { useCallback } from 'react';
import { clamp, useDerivedValue } from 'react-native-reanimated';
import { usePiPViewContext } from '../context/PiPView.provider';

export const useDragHelpers = () => {
  const {
    _providedEdges,
    scaledElementLayout,
    hideable,
    translationX,
    overDragOffset,
    dockSide,
    destroyArea,
  } = usePiPViewContext((state) => ({
    _providedEdges: state.edges,
    scaledElementLayout: state.scaledElementLayout,
    translationX: state.translationX,
    hideable: state.hideable,
    overDragOffset: state.overDragOffset,
    dockSide: state.dockSide,
    destroyArea: state.destroyArea,
  }));

  const edges = useDerivedValue(
    () =>
      _providedEdges.value || {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      }
  );

  const applyResistance = (offset: number, min: number, max: number) => {
    'worklet';
    const resistanceFactor = 0.5;
    if (offset < min) {
      return min + (offset - min) * resistanceFactor;
    } else if (offset > max) {
      return max + (offset - max) * resistanceFactor;
    } else {
      return offset;
    }
  };

  const checkOverDrag = useCallback(
    (x: number) => {
      'worklet';

      if (!hideable) {
        return [false, false];
      }
      const overDragLeftPosition = edges.value.minX - x;
      const overDragRightPosition = x - edges.value.maxX;

      const isOverDraggedLeft = overDragLeftPosition > overDragOffset.value;
      const isOverDraggedRight = overDragRightPosition > overDragOffset.value;

      return [isOverDraggedLeft, isOverDraggedRight];
    },
    [edges, hideable, overDragOffset]
  );

  const findNearestYEdge = useCallback(
    (y: number) => {
      'worklet';
      const midY = (edges.value.minY + edges.value.maxY) / 2;
      return y < midY ? edges.value.minY : edges.value.maxY;
    },
    [edges]
  );

  const isWithinhighlightArea = useCallback(
    (x: number, y: number) => {
      'worklet';
      if (destroyArea?.position) {
        const draggableLeft = x;
        const draggableRight = x + scaledElementLayout.value.width;
        const draggableTop = y;
        const draggableBottom = y + scaledElementLayout.value.height;

        // Coordinates and dimensions of the highlighted area
        const highlightedLeft = destroyArea.position.x ?? 0;
        const highlightedRight =
          (destroyArea.position.x ?? 0) + destroyArea.position.width;
        const highlightedTop = destroyArea.position.y ?? 0;
        const highlightedBottom =
          (destroyArea.position.y ?? 0) + destroyArea.position.height;

        // Check for overlap
        const isOverlapping =
          draggableLeft < highlightedRight &&
          draggableRight > highlightedLeft &&
          draggableTop < highlightedBottom &&
          draggableBottom > highlightedTop;

        return isOverlapping;
      }
      return false;
    },
    [
      destroyArea?.position,
      scaledElementLayout.value.height,
      scaledElementLayout.value.width,
    ]
  );

  const handleHideTansition = useCallback(
    (targetX: number, side: 'left' | 'right') => {
      'worklet';
      translationX.value = clamp(
        targetX,
        edges.value.minX - scaledElementLayout.value.width - 50,
        edges.value.maxX + scaledElementLayout.value.width + 50
      );

      dockSide.value = side;
    },
    [
      dockSide,
      edges.value.maxX,
      edges.value.minX,
      scaledElementLayout.value.width,
      translationX,
    ]
  );

  return {
    handleHideTansition,
    isWithinhighlightArea,
    findNearestYEdge,
    checkOverDrag,
    applyResistance,
  };
};
