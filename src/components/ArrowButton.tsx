import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ARROW_HEIGHT, ARROW_WIDTH } from '../constants';
import { type EdgeSide } from '../models';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import { ArrowRightIcon } from './ArrowRightIcon';

interface Props {
  isVisible: SharedValue<boolean>;
  side: EdgeSide | null;
}

export const ArrowButton = ({ isVisible, side }: Props) => {
  const containerStyles = useAnimatedStyle(() => ({
    borderTopRightRadius: side === 'left' ? 4 : 0,
    borderBottomRightRadius: side === 'left' ? 4 : 0,
    borderTopLeftRadius: side === 'right' ? 4 : 0,
    borderBottomLeftRadius: side === 'right' ? 4 : 0,
  }));

  const leftArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'left' ? 1 : 0),
  }));
  const rightArrowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value && side === 'right' ? 1 : 0),
  }));

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

      <Animated.View style={[leftArrowStyle, styles.arrow, styles.leftArrow]}>
        <ArrowLeftIcon />
      </Animated.View>

      <Animated.View style={[rightArrowStyle, styles.arrow, styles.rightArrow]}>
        <ArrowRightIcon />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
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
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
