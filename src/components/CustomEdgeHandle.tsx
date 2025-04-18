import Animated, {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';
import type { LayoutChangeEvent } from 'react-native';

interface Props {
  isVisible: SharedValue<boolean>;
  side: EdgeSide;
}

export const CustomEdgeHandle = ({ isVisible, side }: Props) => {
  const { edgeHandle, edgeHandleLayout } = usePiPViewContext((state) => ({
    edgeHandle: state.edgeHandle,
    edgeHandleLayout: state.edgeHandleLayout,
  }));

  const leftHandleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'left' ? 1 : 0),
  }));
  const rightHandleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'right' ? 1 : 0),
  }));

  const onLayoutLeftHandle = (event: LayoutChangeEvent) => {
    if (edgeHandleLayout.value.width || edgeHandleLayout.value.height) {
      return;
    }
    edgeHandleLayout.value = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    };
  };

  const onLayoutRightHandle = (event: LayoutChangeEvent) => {
    if (edgeHandleLayout.value.width || edgeHandleLayout.value.height) {
      return;
    }
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
      <Animated.View onLayout={onLayoutLeftHandle} style={leftHandleStyle}>
        {edgeHandle.left}
      </Animated.View>
      <Animated.View onLayout={onLayoutRightHandle} style={rightHandleStyle}>
        {edgeHandle.right}
      </Animated.View>
    </>
  );
};
