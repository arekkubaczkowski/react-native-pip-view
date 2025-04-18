import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';

interface Props {
  side: EdgeSide;
}

export const CustomEdgeHandle = ({ side }: Props) => {
  const { edgeHandle, edgeHandleLayout, elementLayout } = usePiPViewContext(
    (state) => ({
      edgeHandle: state.edgeHandle,
      edgeHandleLayout: state.edgeHandleLayout,
      elementLayout: state.elementLayout,
    })
  );

  const leftHandleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(side === 'left' ? 1 : 0),
    transform: [
      {
        translateY:
          (elementLayout.value.height - edgeHandleLayout.value.height) / 2,
      },
    ],
    left: 0,
  }));
  const rightHandleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(side === 'right' ? 1 : 0),
    transform: [
      {
        translateY:
          (elementLayout.value.height - edgeHandleLayout.value.height) / 2,
      },
    ],
    right: 0,
  }));

  const onLayoutLeftHandle = (event: LayoutChangeEvent) => {
    edgeHandleLayout.value = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    };
  };

  const onLayoutRightHandle = (event: LayoutChangeEvent) => {
    edgeHandleLayout.value = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    };
  };

  if (!edgeHandle?.left || !edgeHandle?.right) {
    return null;
  }

  return (
    <>
      <Animated.View
        onLayout={onLayoutLeftHandle}
        style={[leftHandleStyle, styles.handle]}
      >
        {edgeHandle.left}
      </Animated.View>
      <Animated.View
        onLayout={onLayoutRightHandle}
        style={[rightHandleStyle, styles.handle]}
      >
        {edgeHandle.right}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -1,
  },
});
