import { type PropsWithChildren } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { animationsPresets } from '../constants';
import { LeftEdgeHandle } from './LeftEdgeHandle';
import { usePiPViewContext } from '../context/PiPView.provider';
import { RightEdgeHandle } from './RightEdgeHandle';
import { getCurrentHorizontalSide, getEdges } from '../utils/snapping';
import { usePanGesture } from '../hooks/usePanGesture';
import { usePinchGesture } from '../hooks/usePinchGesture';
import { useDragHelpers } from '../hooks/useDragHelpers';

export const PiPViewImpl = ({ children }: PropsWithChildren) => {
  const elementLayout = usePiPViewContext((state) => state.elementLayout);
  const scaledElementLayout = usePiPViewContext(
    (state) => state.scaledElementLayout
  );
  const isDestroyed = usePiPViewContext((state) => state.isDestroyed);
  const layout = usePiPViewContext((state) => state.layout);
  const dockSide = usePiPViewContext((state) => state.dockSide);
  const translationX = usePiPViewContext((state) => state.translationX);
  const translationY = usePiPViewContext((state) => state.translationY);
  const isInitialized = usePiPViewContext((state) => state.isInitialized);
  const edges = usePiPViewContext((state) => state.edges);
  const overDragSide = usePiPViewContext((state) => state.overDragSide);
  const isHighlightAreaActive = usePiPViewContext(
    (state) => state.isHighlightAreaActive
  );
  const isPanActive = usePiPViewContext((state) => state.isPanActive);
  const onPress = usePiPViewContext((state) => state.onPress);
  const scale = usePiPViewContext((state) => state.scale);
  const destroyArea = usePiPViewContext((state) => state.destroyArea);
  const edgeHandleLayout = usePiPViewContext((state) => state.edgeHandleLayout);

  // Captured as primitives so worklet closures below stay stable across
  // consumer re-renders that pass a new (but equal) `layout` object —
  // otherwise the reaction would re-register and snap the PiP on every
  // render.
  const {
    x: layoutX,
    y: layoutY,
    width: layoutWidth,
    height: layoutHeight,
    horizontalOffset: layoutHorizontalOffset,
  } = layout;

  const handleLayoutChange = (event: LayoutChangeEvent) => {
    elementLayout.set(event.nativeEvent.layout);
  };

  const { pan: panGesture, handlePanEnd } = usePanGesture();
  const { pinchGesture } = usePinchGesture({ onEnd: handlePanEnd });
  const { findNearestYEdge } = useDragHelpers();

  const diffX = useDerivedValue(
    () => scaledElementLayout.value.width - elementLayout.value.width
  );
  const diffY = useDerivedValue(
    () => scaledElementLayout.value.height - elementLayout.value.height
  );

  const offsetX = useDerivedValue(() => diffX.value / 2);
  const offsetY = useDerivedValue(() => diffY.value / 2);

  const handleExpandView = () => {
    // Guard against double invocation (RNGH tap + the handle's Touchable
    // can both resolve the same press) — the second call would otherwise
    // recompute targetX with dockSide already cleared.
    if (!dockSide.get()) {
      return;
    }

    const minX = layoutHorizontalOffset ?? 0;
    const maxX =
      layoutWidth -
      scaledElementLayout.get().width -
      (layoutHorizontalOffset ?? 0);

    const targetX = dockSide.get() === 'left' ? minX : maxX;
    translationX.set(targetX);

    const targetY = findNearestYEdge(translationY.get());
    translationY.set(targetY);

    overDragSide.set(null);
    dockSide.set(null);
  };

  // `disabled` intentionally does not block the tap — it only disables
  // dragging and scaling, while `onPress` keeps working.
  //
  // No .shouldCancelWhenOutside here: when the PiP is docked, the edge
  // handle sits OUTSIDE the gesture view's bounds (translated past the
  // edge), so cancel-when-outside would kill handle taps on Android
  // (where it defaults to true). .maxDistance covers the
  // "slide away and release" case instead.
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .shouldCancelWhenOutside(false)
    .maxDistance(24)
    .onEnd((_event, success) => {
      // This runs on JS thread due to .runOnJS(true)
      if (!success) {
        return;
      }
      if (dockSide.get()) {
        // When docked, this tap wins the race against the edge handle's
        // Touchable (activation cancels its press), so the gesture itself
        // must perform the expand — otherwise handle presses get swallowed.
        handleExpandView();
        return;
      }
      onPress?.();
    });

  const gesture = Gesture.Race(
    tapGesture,
    Gesture.Simultaneous(panGesture, pinchGesture)
  );

  useAnimatedReaction(
    () => scaledElementLayout.value,
    (currentScaledElementLayout) => {
      if (!edges.value) {
        return;
      }
      if (translationY.value > edges.value.maxY) {
        translationY.set(edges.value.maxY);
      }
      if (translationY.value < edges.value.minY) {
        translationY.set(edges.value.minY);
      }

      if (!dockSide.value) {
        const currentEdges = getEdges(
          {
            x: layoutX,
            y: layoutY,
            width: layoutWidth,
            height: layoutHeight,
            horizontalOffset: layoutHorizontalOffset,
          },
          scaledElementLayout
        );
        const snapToLeft =
          getCurrentHorizontalSide(
            translationX.value,
            layoutWidth,
            currentScaledElementLayout.width
          ) === 'left';
        const targetX = snapToLeft ? currentEdges.minX : currentEdges.maxX;

        translationX.set(targetX);
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const getOpacity = () => {
      if (overDragSide.value) {
        return 1;
      }
      if (isHighlightAreaActive.value) {
        return 0.7;
      }
      if (isDestroyed.value) {
        return 0;
      }
      return 1;
    };

    const getExtraOffsetX = () => {
      if (overDragSide.value === null || dockSide.value) {
        return 0;
      }
      if (overDragSide.value === 'left') {
        return -edgeHandleLayout.value.width;
      }
      if (overDragSide.value === 'right') {
        return edgeHandleLayout.value.width;
      }
      return 0;
    };

    const extraOverDragOffsetX = getExtraOffsetX();

    return {
      transform: [
        {
          translateX: withSpring(
            translationX.value + offsetX.value + extraOverDragOffsetX,
            animationsPresets.lazy
          ),
        },
        {
          translateY: withSpring(
            translationY.value + offsetY.value,
            animationsPresets.lazy
          ),
        },
        // Intentionally two separate `scale` entries — RN composes
        // transforms multiplicatively (matrix product), so the pinch
        // spring and the state-driven timing animate independently.
        // Do NOT merge them into a single entry.
        {
          scale: withSpring(scale.value, animationsPresets.softLanding),
        },
        {
          scale: isDestroyed.value
            ? withTiming(0)
            : isHighlightAreaActive.value
              ? withTiming(0.9)
              : withTiming(1),
        },
      ],
      opacity: withTiming(getOpacity()),
    };
  });

  const destroyAreaStyle = useAnimatedStyle(() => {
    const active = isPanActive.value && !dockSide.value;
    return {
      backgroundColor: withTiming(
        isHighlightAreaActive.value
          ? destroyArea?.activeColor || 'rgba(255, 255, 255, 0.15)'
          : active
            ? destroyArea?.inactiveColor || 'rgba(255, 255, 255, 0.05)'
            : 'transparent'
      ),
      height: destroyArea?.layout.height,
      width: destroyArea?.layout.width,
      top: destroyArea?.layout.y,
      left: destroyArea?.layout.x,
    };
  });

  // Kept separate from the size style below — the size updates every frame
  // during a pinch, and re-evaluating withDelay/withSpring alongside it
  // would restart the entry animation on each frame.
  const containerOpacityStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      200,
      withSpring(
        isInitialized.value ? 1 : 0,
        animationsPresets.responsiveSpring
      )
    ),
  }));

  // Constrain the container to the PiP element size. Without explicit
  // width/height the gesture detector's hit area would extend beyond the
  // visible PiP (issue #4).
  const containerSizeStyle = useAnimatedStyle(() => ({
    width: scaledElementLayout.value.width,
    height: scaledElementLayout.value.height,
  }));

  return (
    <>
      {destroyArea && (
        <Animated.View style={[destroyAreaStyle, styles.destroyArea]} />
      )}

      {layout.width > 0 && layout.height > 0 && (
        <Animated.View
          style={[containerOpacityStyle, containerSizeStyle, styles.container]}
          pointerEvents="box-none"
        >
          <GestureDetector gesture={gesture}>
            <Animated.View
              onLayout={handleLayoutChange}
              style={[animatedStyle, styles.innerContainer]}
            >
              {children}

              <LeftEdgeHandle onPress={handleExpandView} />
              <RightEdgeHandle onPress={handleExpandView} />
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  destroyArea: {
    position: 'absolute',
    borderRadius: 16,
    zIndex: 999,
    pointerEvents: 'none',
  },
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  innerContainer: {
    position: 'absolute',
    zIndex: 9999,
    left: 0,
    top: 0,
  },
});
