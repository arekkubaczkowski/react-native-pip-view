import { useCallback, useMemo } from 'react';
import {
  Gesture,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
  type PanGesture,
} from 'react-native-gesture-handler';
import { clamp, runOnJS, useDerivedValue } from 'react-native-reanimated';

import { useDragHelpers } from './useDragHelpers';
import { usePiPViewContext } from '../context/PiPView.provider';

const VELOCITY_Y_MULTIPLIER = 0.1;
const VELOCITY_X_MULTIPLIER = 0.05;

export const usePanGesture = (): {
  pan: PanGesture;
  handlePanEnd: (
    event?: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
} => {
  const {
    _providedEdges,
    dockSide,
    scaledElementLayout,
    hideable,
    snapToEdges,
    translationX,
    translationY,
    overDragSide,
    isPanActive,
    isHighlightAreaActive,
    layout,
    disabled,
    onDestroy,
    prevTranslationX,
    prevTranslationY,
  } = usePiPViewContext((state) => ({
    snapToEdges: state.snapToEdges,
    _providedEdges: state.edges,
    dockSide: state.dockSide,
    scaledElementLayout: state.scaledElementLayout,
    translationX: state.translationX,
    hideable: state.hideable,
    translationY: state.translationY,
    overDragSide: state.overDragSide,
    isPanActive: state.isPanActive,
    isHighlightAreaActive: state.isHighlightAreaActive,
    layout: state.layout,
    disabled: state.disabled,
    onDestroy: state.onDestroy,
    prevTranslationX: state.prevTranslationX,
    prevTranslationY: state.prevTranslationY,
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

  const {
    applyResistance,
    checkOverDrag,
    findNearestYEdge,
    handleHideTansition,
    isWithinHighlightArea,
  } = useDragHelpers();

  const hiddenLeftXValue = useDerivedValue(
    () =>
      edges.value.minX -
      scaledElementLayout.value.width -
      (layout.horizontalOffset ?? 0) * 1
  );

  const hiddenRightXValue = useDerivedValue(
    () =>
      edges.value.maxX +
      scaledElementLayout.value.width +
      (layout.horizontalOffset ?? 0) * 1
  );

  const handlePanEnd = useCallback(
    (event?: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';

      const velocityX = event?.velocityX || 0;
      const velocityY = event?.velocityY || 0;
      const velocityThreshold = 1700;

      const [isOverDraggedLeft, isOverDraggedRight] = checkOverDrag(
        translationX.value
      );
      let dockSideTmp = dockSide.value;

      if (isOverDraggedLeft) {
        translationX.set(hiddenLeftXValue.value);
        dockSide.set('left');
        dockSideTmp = 'left';

        isPanActive.set(false);
        isHighlightAreaActive.set(false);
        overDragSide.set(null);

        if (snapToEdges) {
          translationY.set(translationY.value);
        }

        return;
      } else if (isOverDraggedRight) {
        translationX.set(hiddenRightXValue.value);
        dockSide.set('right');
        dockSideTmp = 'right';

        isPanActive.set(false);
        isHighlightAreaActive.set(false);
        overDragSide.set(null);

        if (snapToEdges) {
          translationY.set(translationY.value);
        }

        return;
      }

      const targetYWithVelocity =
        translationY.value + velocityY * VELOCITY_Y_MULTIPLIER;
      const clampedY = clamp(
        targetYWithVelocity,
        edges.value.minY,
        edges.value.maxY
      );

      const targetXWithVelocity =
        translationX.value + velocityX * VELOCITY_X_MULTIPLIER;

      const snapToLeft =
        targetXWithVelocity <
        (layout.width - scaledElementLayout.value.width) / 2;

      let targetX = 0;

      const shouldHideLeft =
        targetXWithVelocity < edges.value.minX &&
        velocityX < -velocityThreshold &&
        hideable;
      const shouldHideRight =
        targetXWithVelocity > edges.value.maxX &&
        velocityX > velocityThreshold &&
        hideable;

      if (shouldHideLeft) {
        targetX = hiddenLeftXValue.value;

        handleHideTansition(targetX, 'left');
      } else if (shouldHideRight) {
        targetX = hiddenRightXValue.value;

        handleHideTansition(targetX, 'right');
      } else {
        targetX = snapToLeft ? edges.value.minX : edges.value.maxX;
        dockSide.set(null);
        dockSideTmp = null;
      }

      if (!dockSideTmp && !shouldHideLeft && !shouldHideRight) {
        translationX.set(targetX);
      }
      if (snapToEdges && !dockSideTmp) {
        translationY.set(findNearestYEdge(clampedY));
      } else {
        translationY.set(clampedY);
      }
      isPanActive.set(false);
      isHighlightAreaActive.set(false);
      overDragSide.set(null);
    },
    [
      checkOverDrag,
      translationX,
      translationY,
      edges.value.minY,
      edges.value.maxY,
      edges.value.minX,
      edges.value.maxX,
      layout.width,
      scaledElementLayout.value.width,
      hideable,
      dockSide,
      snapToEdges,
      isPanActive,
      isHighlightAreaActive,
      overDragSide,
      hiddenLeftXValue.value,
      hiddenRightXValue.value,
      handleHideTansition,
      findNearestYEdge,
    ]
  );

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        'worklet';
        if (disabled) {
          return;
        }
        prevTranslationX.set(translationX.value);
        prevTranslationY.set(translationY.value);
        isPanActive.set(true);
      })
      .onUpdate((e) => {
        'worklet';
        if (disabled) {
          return;
        }

        const newTranslationY = prevTranslationY.value + e.translationY;

        translationY.set(
          applyResistance(newTranslationY, edges.value.minY, edges.value.maxY)
        );

        const newTranslationX = prevTranslationX.value + e.translationX;

        if (isWithinHighlightArea(newTranslationX, newTranslationY)) {
          isHighlightAreaActive.set(true);
        } else {
          isHighlightAreaActive.set(false);
        }

        const [isOverDraggedLeft, isOverDraggedRight] =
          checkOverDrag(newTranslationX);

        if (isOverDraggedLeft) {
          overDragSide.set('left');
        } else if (isOverDraggedRight) {
          overDragSide.set('right');
        } else {
          overDragSide.set(null);
        }

        translationX.set(newTranslationX);
      })
      .onEnd((event) => {
        'worklet';
        if (disabled) {
          return;
        }

        if (
          onDestroy &&
          isWithinHighlightArea(translationX.value, translationY.value)
        ) {
          runOnJS(onDestroy)();
          return;
        }
        handlePanEnd(event);
      });
  }, [
    applyResistance,
    checkOverDrag,
    disabled,
    edges.value.maxY,
    edges.value.minY,
    handlePanEnd,
    isPanActive,
    isHighlightAreaActive,
    isWithinHighlightArea,
    onDestroy,
    overDragSide,
    prevTranslationX,
    prevTranslationY,
    translationX,
    translationY,
  ]);

  return { pan, handlePanEnd };
};
