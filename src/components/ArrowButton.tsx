import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import { ArrowRightIcon } from './ArrowRightIcon';

interface Props {
  side: EdgeSide | null;
}

export const ArrowButton = ({ side }: Props) => {
  const { edgeHandleLayout, edgeHandle } = usePiPViewContext((state) => ({
    edgeHandleLayout: state.edgeHandleLayout,
    edgeHandle: state.edgeHandle,
  }));

  const containerStyles = useAnimatedStyle(() => ({
    borderTopRightRadius: side === 'right' ? 8 : 0,
    borderBottomRightRadius: side === 'right' ? 8 : 0,
    borderTopLeftRadius: side === 'left' ? 8 : 0,
    borderBottomLeftRadius: side === 'left' ? 8 : 0,
  }));

  const leftArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(side === 'left' ? 1 : 0),
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(side === 'right' ? 1 : 0),
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    if (
      edgeHandleLayout.value.width > 0 ||
      edgeHandleLayout.value.height > 0 ||
      edgeHandle?.left ||
      edgeHandle?.right
    ) {
      return;
    }

    edgeHandleLayout.value = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    };
  };

  return (
    <Animated.View style={[containerStyles, styles.container]}>
      <Animated.View
        onLayout={onLayout}
        style={[leftArrowStyle, styles.arrow, styles.leftArrow]}
      >
        <ArrowLeftIcon width={16} height={16} />
      </Animated.View>

      <Animated.View
        onLayout={onLayout}
        style={[rightArrowStyle, styles.arrow, styles.rightArrow]}
      >
        <ArrowRightIcon width={16} height={16} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 24,
    height: 64,
  },
  leftArrow: {
    left: 0,
  },
  rightArrow: {
    right: 0,
  },
  arrow: {
    position: 'absolute',
    width: 24,
    alignItems: 'center',
  },
});
