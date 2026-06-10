import {
  Gesture,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
  type PanGesture,
} from 'react-native-gesture-handler';
import { clamp, useDerivedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useDragHelpers } from './useDragHelpers';
import { usePiPViewContext } from '../context/PiPView.provider';
import { applyResistance } from '../utils/gestures';
import { getCurrentHorizontalSide } from '../utils/snapping';

const VELOCITY_Y_MULTIPLIER = 0.1;
const VELOCITY_X_MULTIPLIER = 0.05;
const VELOCITY_THRESHOLD = 1700;

export const usePanGesture = (): {
  pan: PanGesture;
  handlePanEnd: (
    event?: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
} => {
  const snapToEdges = usePiPViewContext((state) => state.snapToEdges);
  const _providedEdges = usePiPViewContext((state) => state.edges);
  const dockSide = usePiPViewContext((state) => state.dockSide);
  const scaledElementLayout = usePiPViewContext(
    (state) => state.scaledElementLayout
  );
  const translationX = usePiPViewContext((state) => state.translationX);
  const hideable = usePiPViewContext((state) => state.hideable);
  const translationY = usePiPViewContext((state) => state.translationY);
  const overDragSide = usePiPViewContext((state) => state.overDragSide);
  const isPanActive = usePiPViewContext((state) => state.isPanActive);
  const isHighlightAreaActive = usePiPViewContext(
    (state) => state.isHighlightAreaActive
  );
  const layout = usePiPViewContext((state) => state.layout);
  const disabled = usePiPViewContext((state) => state.disabled);
  const onDestroy = usePiPViewContext((state) => state.onDestroy);
  const handleDestroy = usePiPViewContext((state) => state.handleDestroy);
  const isDestroyed = usePiPViewContext((state) => state.isDestroyed);
  const prevTranslationX = usePiPViewContext((state) => state.prevTranslationX);
  const prevTranslationY = usePiPViewContext((state) => state.prevTranslationY);

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
    checkOverDrag,
    findNearestYEdge,
    handleHideTransition,
    isWithinDestroyArea,
  } = useDragHelpers();

  // Primitives keep the worklet closures stable when the consumer passes
  // a new (but equal) `layout` object on re-render — otherwise the pan
  // gesture would be rebuilt and re-attached on every render.
  const { width: layoutWidth, horizontalOffset: layoutHorizontalOffset } =
    layout;

  const hiddenLeftXValue = useDerivedValue(
    () =>
      edges.value.minX -
      scaledElementLayout.value.width -
      (layoutHorizontalOffset ?? 0)
  );

  const hiddenRightXValue = useDerivedValue(
    () =>
      edges.value.maxX +
      scaledElementLayout.value.width +
      (layoutHorizontalOffset ?? 0)
  );

  const handlePanEnd = (
    event?: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    'worklet';

    const velocityX = event?.velocityX || 0;
    const velocityY = event?.velocityY || 0;

    const [isOverDraggedLeft, isOverDraggedRight] = checkOverDrag(
      translationX.get()
    );
    let dockSideTmp = dockSide.get();

    if (isOverDraggedLeft) {
      translationX.set(hiddenLeftXValue.get());
      dockSide.set('left');
      dockSideTmp = 'left';

      isPanActive.set(false);
      isHighlightAreaActive.set(false);
      overDragSide.set(null);

      return;
    } else if (isOverDraggedRight) {
      translationX.set(hiddenRightXValue.get());
      dockSide.set('right');
      dockSideTmp = 'right';

      isPanActive.set(false);
      isHighlightAreaActive.set(false);
      overDragSide.set(null);

      return;
    }

    const targetYWithVelocity =
      translationY.get() + velocityY * VELOCITY_Y_MULTIPLIER;
    const clampedY = clamp(
      targetYWithVelocity,
      edges.get().minY,
      edges.get().maxY
    );

    const targetXWithVelocity =
      translationX.get() + velocityX * VELOCITY_X_MULTIPLIER;

    const snapToLeft =
      getCurrentHorizontalSide(
        targetXWithVelocity,
        layoutWidth,
        scaledElementLayout.get().width
      ) === 'left';

    let targetX = 0;

    const shouldHideLeft =
      targetXWithVelocity < edges.get().minX &&
      velocityX < -VELOCITY_THRESHOLD &&
      hideable;
    const shouldHideRight =
      targetXWithVelocity > edges.get().maxX &&
      velocityX > VELOCITY_THRESHOLD &&
      hideable;

    if (shouldHideLeft) {
      targetX = hiddenLeftXValue.get();

      handleHideTransition(targetX, 'left');
    } else if (shouldHideRight) {
      targetX = hiddenRightXValue.get();

      handleHideTransition(targetX, 'right');
    } else {
      targetX = snapToLeft ? edges.get().minX : edges.get().maxX;
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
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      prevTranslationX.set(translationX.get());
      prevTranslationY.set(translationY.get());
      isPanActive.set(true);
    })
    .onUpdate((e) => {
      'worklet';
      const newTranslationY = prevTranslationY.get() + e.translationY;

      translationY.set(
        applyResistance(newTranslationY, edges.get().minY, edges.get().maxY)
      );

      const rawTranslationX = prevTranslationX.get() + e.translationX;
      // When the view cannot be hidden there is no overdrag, so pushing
      // past the horizontal edges should feel resistant, same as the Y axis.
      const newTranslationX = hideable
        ? rawTranslationX
        : applyResistance(rawTranslationX, edges.get().minX, edges.get().maxX);

      isHighlightAreaActive.set(
        isWithinDestroyArea(newTranslationX, newTranslationY)
      );

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
      if (
        onDestroy &&
        isWithinDestroyArea(translationX.get(), translationY.get())
      ) {
        // Set on the UI thread right away — scheduleOnRN lands a frame or
        // two later and the destroy animation would briefly flicker.
        isDestroyed.set(true);
        scheduleOnRN(handleDestroy);
        return;
      }
      handlePanEnd(event);
    })
    .onFinalize(() => {
      'worklet';
      // Cleanup that survives gesture cancellation (e.g. `disabled`
      // flipping mid-gesture) — onEnd is not guaranteed to run then.
      isPanActive.set(false);
      isHighlightAreaActive.set(false);
      overDragSide.set(null);
    });

  return { pan, handlePanEnd };
};
