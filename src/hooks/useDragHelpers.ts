import { useCallback } from 'react';
import { clamp, useDerivedValue } from 'react-native-reanimated';
import { usePiPViewContext } from '../context/PiPView.provider';
import { drag } from '../styles/theme';
import {
  applyResistance as applyResistanceUtil,
  checkOverDrag as checkOverDragUtil,
} from '../utils/gestures';
import { findNearestYEdge as findNearestYEdgeUtil } from '../utils/snapping';
import { isWithinDestroyArea } from '../utils/destroyArea';

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
    return applyResistanceUtil(offset, min, max);
  };

  const checkOverDrag = useCallback(
    (x: number) => {
      'worklet';

      if (!hideable) {
        return [false, false];
      }

      return checkOverDragUtil(
        x,
        edges.value.minX,
        edges.value.maxX,
        overDragOffset.value
      );
    },
    [edges, hideable, overDragOffset]
  );

  const findNearestYEdge = useCallback(
    (y: number) => {
      'worklet';
      return findNearestYEdgeUtil(y, edges.value);
    },
    [edges]
  );

  const isWithinHighlightArea = useCallback(
    (x: number, y: number) => {
      'worklet';
      return isWithinDestroyArea(
        x,
        y,
        scaledElementLayout.value,
        destroyArea?.layout
      );
    },
    [destroyArea?.layout, scaledElementLayout]
  );

  const handleHideTansition = useCallback(
    (targetX: number, side: 'left' | 'right') => {
      'worklet';
      translationX.value = clamp(
        targetX,
        edges.value.minX -
          scaledElementLayout.value.width -
          drag.hiddenEdgePadding,
        edges.value.maxX +
          scaledElementLayout.value.width +
          drag.hiddenEdgePadding
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
    isWithinHighlightArea,
    findNearestYEdge,
    checkOverDrag,
    applyResistance,
  };
};
