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

import { ARROW_WIDTH, customAnimations } from '../constants';
import { LeftExpandButton } from './LeftExpandButton';
import { type ContainerLayoutRectangle, type Dimensions } from '../models';
import { usePiPViewContext } from '../context/PiPView.provider';
import { RightExpandButton } from './RightExpandButton';
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
    isActive,
    onPress,
    scale,
    destroyArea,
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
    isActive: state.isActive,
    scale: state.scale,
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
    const minX = layout.horizontalOffet ?? 0;
    const maxX =
      layout.width -
      scaledElementLayout.value.width -
      (layout.horizontalOffet ?? 0);

    const targetX = dockSide.value === 'left' ? minX : maxX;
    translationX.value = targetX;

    const targetY = findNearestYEdge(translationY.value);
    translationY.value = targetY;

    overDragSide.value = null;
    dockSide.value = null;
    dockSide.value = null;
  }, [
    layout.horizontalOffet,
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

    const overDragOffsetX =
      overDragSide.value === null || !!dockSide.value
        ? 0
        : overDragSide.value === 'left'
          ? -ARROW_WIDTH
          : ARROW_WIDTH;

    return {
      transform: [
        {
          translateX: withSpring(
            translationX.value + offsetX.value + overDragOffsetX,
            customAnimations.lazy
          ),
        },
        {
          translateY: withSpring(
            translationY.value + offsetY.value,
            customAnimations.lazy
          ),
        },
        {
          scale: withSpring(scale.value, customAnimations.softLanding),
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
    const active = isActive.value && !dockSide.value;
    return {
      opacity: 1,
      backgroundColor: withTiming(
        isHighlightAreaActive.value
          ? destroyArea?.activeColor!
          : active
            ? destroyArea?.inactiveColor!
            : 'transparent'
      ),
      height: destroyArea?.position.height,
      width: destroyArea?.position.width,
      top: destroyArea?.position.y,
      left: destroyArea?.position.x,
    };
  });

  const containerStyles = useAnimatedStyle(() => ({
    opacity: withDelay(
      200,
      withSpring(isInitialized.value ? 1 : 0, customAnimations.responsiveSpring)
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

              <LeftExpandButton onPress={handleExpandView} />
              <RightExpandButton onPress={handleExpandView} />
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
