import { useCallback, useMemo } from 'react';
import {
  Gesture,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { clamp, runOnJS, useDerivedValue } from 'react-native-reanimated';

import { usePiPViewContext } from './PiPView.provider';
import { useDragHelpers } from './useDragHelpers';

const VELOCITY_Y_MULTIPLIER = 0.1;
const VELOCITY_X_MULTIPLIER = 0.05;

export const usePanGesture = () => {
  const {
    _providedEdges,
    dockSide,
    scaledElementLayout,
    hideable,
    snapToEdges,
    translationX,
    translationY,
    overDragSide,
    isActive,
    isHighlightAreaActive,
    layout,
    disabled,
    onDestroy,
    prevTranslationX,
    prevTranslationY,
  } = usePiPViewContext(state => ({
    snapToEdges: state.snapToEdges,
    _providedEdges: state.edges,
    dockSide: state.dockSide,
    scaledElementLayout: state.scaledElementLayout,
    translationX: state.translationX,
    hideable: state.hideable,
    translationY: state.translationY,
    overDragSide: state.overDragSide,
    isActive: state.isActive,
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
      },
  );

  const {
    applyResistance,
    checkOverDrag,
    findNearestYEdge,
    handleHideTansition,
    isWithinhighlightArea,
  } = useDragHelpers();

  const hiddenLeftXValue = useDerivedValue(
    () =>
      edges.value.minX -
      scaledElementLayout.value.width -
      (layout.horiozntalOffet ?? 0) * 1,
  );

  const hiddenRightXValue = useDerivedValue(
    () =>
      edges.value.maxX +
      scaledElementLayout.value.width +
      (layout.horiozntalOffet ?? 0) * 1,
  );

  const handlePanEnd = useCallback(
    (event?: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';

      const velocityX = event?.velocityX || 0;
      const velocityY = event?.velocityY || 0;
      const velocityThreshold = 1700;

      const [isOverDraggedLeft, isOverDraggedRight] = checkOverDrag(
        translationX.value,
      );

      if (isOverDraggedLeft) {
        translationX.value = hiddenLeftXValue.value;
        dockSide.value = 'left';

        isActive.value = false;
        isHighlightAreaActive.value = false;
        overDragSide.value = null;

        if (snapToEdges) {
          translationY.value = translationY.value;
        }

        return;
      } else if (isOverDraggedRight) {
        translationX.value = hiddenRightXValue.value;
        dockSide.value = 'right';

        isActive.value = false;
        isHighlightAreaActive.value = false;
        overDragSide.value = null;

        if (snapToEdges) {
          translationY.value = translationY.value;
        }

        return;
      }

      const targetYWithVelocity =
        translationY.value + velocityY * VELOCITY_Y_MULTIPLIER;
      const clampedY = clamp(
        targetYWithVelocity,
        edges.value.minY,
        edges.value.maxY,
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
        dockSide.value = null;
      }

      if (!dockSide.value && !shouldHideLeft && !shouldHideRight) {
        translationX.value = targetX;
      }
      if (snapToEdges && !dockSide.value) {
        translationY.value = findNearestYEdge(clampedY);
      } else {
        translationY.value = clampedY;
      }
      isActive.value = false;
      isHighlightAreaActive.value = false;
      overDragSide.value = null;
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
      isActive,
      isHighlightAreaActive,
      overDragSide,
      hiddenLeftXValue.value,
      hiddenRightXValue.value,
      handleHideTansition,
      findNearestYEdge,
    ],
  );

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        if (disabled) {
          return;
        }
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
        isActive.value = true;
      })
      .onUpdate(e => {
        if (disabled) {
          return;
        }

        const newTranslationY = prevTranslationY.value + e.translationY;

        translationY.value = applyResistance(
          newTranslationY,
          edges.value.minY,
          edges.value.maxY,
        );

        const newTranslationX = prevTranslationX.value + e.translationX;

        if (isWithinhighlightArea(newTranslationX, newTranslationY)) {
          isHighlightAreaActive.value = true;
        } else {
          isHighlightAreaActive.value = false;
        }

        const [isOverDraggedLeft, isOverDraggedRight] =
          checkOverDrag(newTranslationX);

        if (isOverDraggedLeft) {
          overDragSide.value = 'left';
        } else if (isOverDraggedRight) {
          overDragSide.value = 'right';
        } else {
          overDragSide.value = null;
        }

        translationX.value = newTranslationX;
      })
      .onEnd(event => {
        if (disabled) {
          return;
        }

        if (
          onDestroy &&
          isWithinhighlightArea(translationX.value, translationY.value)
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
    isActive,
    isHighlightAreaActive,
    isWithinhighlightArea,
    onDestroy,
    overDragSide,
    prevTranslationX,
    prevTranslationY,
    translationX,
    translationY,
  ]);

  return { pan, handlePanEnd };
};
