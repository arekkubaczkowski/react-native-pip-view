import { BlurView } from 'expo-blur';
import {
  Platform,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { type EdgeSide } from '../models';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import { ArrowRightIcon } from './ArrowRightIcon';
import { usePiPViewContext } from '../context/PiPView.provider';

interface Props {
  isVisible: SharedValue<boolean>;
  side: EdgeSide | null;
}

export const ArrowButton = ({ isVisible, side }: Props) => {
  const { edgeHandleLayout, edgeHandle } = usePiPViewContext((state) => ({
    edgeHandleLayout: state.edgeHandleLayout,
    edgeHandle: state.edgeHandle,
  }));

  const containerStyles = useAnimatedStyle(() => ({
    borderTopRightRadius: side === 'left' ? 4 : 0,
    borderBottomRightRadius: side === 'left' ? 4 : 0,
    borderTopLeftRadius: side === 'right' ? 4 : 0,
    borderBottomLeftRadius: side === 'right' ? 4 : 0,
    width: edgeHandleLayout.value.width,
    height: edgeHandleLayout.value.height,
  }));

  const leftArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'left' ? 1 : 0),
    width: edgeHandleLayout.value.width,
    height: edgeHandleLayout.value.height,
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'right' ? 1 : 0),
    width: edgeHandleLayout.value.width,
    height: edgeHandleLayout.value.height,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    if (
      edgeHandleLayout.value.width ||
      edgeHandleLayout.value.height ||
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
      {Platform.OS === 'ios' ? (
        <BlurView
          tint="light"
          style={StyleSheet.absoluteFillObject}
          intensity={28}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.overlay]} />
      )}

      <Animated.View
        onLayout={onLayout}
        style={[leftArrowStyle, styles.leftArrow]}
      >
        <ArrowLeftIcon />
      </Animated.View>

      <Animated.View
        onLayout={onLayout}
        style={[rightArrowStyle, styles.rightArrow]}
      >
        <ArrowRightIcon />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#FFFFFF40',
  },
  leftArrow: {
    left: 0,
  },
  rightArrow: {
    right: 0,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
