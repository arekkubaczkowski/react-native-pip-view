import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { animationsPresets } from '../constants';
import { LeftEdgeHandle } from './LeftEdgeHandle';
import { type ContainerLayoutRectangle, type Dimensions } from '../models';
import { usePiPViewContext } from '../context/PiPView.provider';
import { RightEdgeHandle } from './RightEdgeHandle';
import { getEdges } from '../utils';
import { usePanGesture } from '../hooks/usePanGesture';
import { usePinchGesture } from '../hooks/usePinchGesture';
import { useDragHelpers } from '../hooks/useDragHelpers';

export const PiPViewImpl = ({ children }: PropsWithChildren) => {
  const {
    elementLayout,
    scaledElementLayout,
    isDestroyed,
    layout,
    dockSide,
    translationX,
    translationY,
    isInitialized,
    edges,
    overDragSide,
    isHighlightAreaActive,
    isPanActive,
    onPress,
    scale,
    destroyArea,
    edgeHandleLayout,
  } = usePiPViewContext((state) => ({
    elementLayout: state.elementLayout,
    overDragSide: state.overDragSide,
    onDestroy: state.onDestroy,
    initialPosition: state.initialPosition,
    edges: state.edges,
    isInitialized: state.isInitialized,
    scaledElementLayout: state.scaledElementLayout,
    isDestroyed: state.isDestroyed,
    destroyArea: state.destroyArea,
    layout: state.layout,
    translationY: state.translationY,
    translationX: state.translationX,
    dockSide: state.dockSide,
    isHighlightAreaActive: state.isHighlightAreaActive,
    onPress: state.onPress,
    isPanActive: state.isPanActive,
    scale: state.scale,
    edgeHandleLayout: state.edgeHandleLayout,
  }));

  const handleLayoutChange = useCallback(
    (event: LayoutChangeEvent) => {
      elementLayout.value = event.nativeEvent.layout;
    },
    [elementLayout]
  );

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

  const getCurrentHorizontalSide = useCallback(
    (
      currentContainerLayout: ContainerLayoutRectangle,
      currentElementLayout: SharedValue<Dimensions>
    ) => {
      'worklet';
      return translationX.value <
        (currentContainerLayout.width - currentElementLayout.value.width) / 2
        ? 'left'
        : 'right';
    },
    [translationX]
  );

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .shouldCancelWhenOutside(true)
        .onTouchesUp(() => {
          // This runs on JS thread due to .runOnJS(true)
          if (dockSide.value) {
            return;
          }
          onPress?.();
        }),
    [dockSide, onPress]
  );

  const gesture = Gesture.Race(
    tapGesture,
    Gesture.Simultaneous(panGesture, pinchGesture)
  );

  const handleExpandView = useCallback(() => {
    const minX = layout.horizontalOffset ?? 0;
    const maxX =
      layout.width -
      scaledElementLayout.value.width -
      (layout.horizontalOffset ?? 0);

    const targetX = dockSide.value === 'left' ? minX : maxX;
    translationX.value = targetX;

    const targetY = findNearestYEdge(translationY.value);
    translationY.value = targetY;

    overDragSide.value = null;
    dockSide.value = null;
  }, [
    layout.horizontalOffset,
    layout.width,
    scaledElementLayout.value.width,
    dockSide,
    translationX,
    findNearestYEdge,
    translationY,
    overDragSide,
  ]);

  useAnimatedReaction(
    () => ({
      currentContainerLayout: layout,
      currentScaledElementLayout: scaledElementLayout,
    }),
    ({ currentContainerLayout, currentScaledElementLayout }) => {
      if (!edges.value) {
        return;
      }
      if (translationY.value > edges.value.maxY) {
        translationY.value = edges.value.maxY;
      }
      if (translationY.value < edges.value.minY) {
        translationY.value = edges.value.minY;
      }

      if (!dockSide.value) {
        const currentEdges = getEdges(
          currentContainerLayout,
          currentScaledElementLayout
        );
        const snapToLeft =
          getCurrentHorizontalSide(
            currentContainerLayout,
            currentScaledElementLayout
          ) === 'left';
        const targetX = snapToLeft ? currentEdges.minX : currentEdges.maxX;

        translationX.value = targetX;
      }
    },
    [edges]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const getOpacity = () => {
      switch (true) {
        case !!overDragSide.value:
          return 1;
        case isHighlightAreaActive.value:
          return 0.7;
        case isDestroyed.value:
          return 0;
        default:
          return 1;
      }
    };

    const getExtraOffsetX = () => {
      switch (true) {
        case overDragSide.value === null || !!dockSide.value:
          return 0;
        case overDragSide.value === 'left':
          return -edgeHandleLayout.value.width;
        case overDragSide.value === 'right':
          return edgeHandleLayout.value.width;
        default:
          return 0;
      }
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
      opacity: 1,
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

  const containerStyles = useAnimatedStyle(() => ({
    opacity: withDelay(
      200,
      withSpring(
        isInitialized.value ? 1 : 0,
        animationsPresets.responsiveSpring
      )
    ),
  }));

  return (
    <>
      {destroyArea && (
        <Animated.View style={[destroyAreaStyle, styles.destroyArea]} />
      )}

      {layout.width > 0 && layout.height > 0 && (
        <GestureDetector gesture={gesture}>
          <Animated.View style={[containerStyles, styles.container]}>
            <Animated.View
              onLayout={handleLayoutChange}
              style={[animatedStyle, styles.innerContainer]}
            >
              {children}

              <LeftEdgeHandle onPress={handleExpandView} />
              <RightEdgeHandle onPress={handleExpandView} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
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
