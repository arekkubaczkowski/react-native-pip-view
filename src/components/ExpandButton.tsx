import {
  StyleSheet,
  TouchableOpacity,
  type GestureResponderEvent,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ArrowButton } from './ArrowButton';
import { type EdgeSide } from '../models';
import { customAnimations } from '../constants';

interface Props {
  translateX: SharedValue<number>;
  elementLayout: SharedValue<LayoutRectangle>;
  isVisible: SharedValue<boolean>;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  side: EdgeSide;
}

export const ExpandButton = ({
  elementLayout,
  onPress,
  translateX,
  isVisible,
  style,
  side,
}: Props) => {
  const containerStyle = useAnimatedStyle(() => ({
    height: elementLayout.value.height,
    transform: [
      {
        translateX: withSpring(translateX.value, customAnimations.lazy),
      },
    ],
    opacity: withTiming(isVisible.value ? 1 : 0, {
      duration: 200,
    }),
    right: 0,
    top: 0,
    zIndex: -1,
  }));

  return (
    <Animated.View style={[containerStyle, style, styles.button]}>
      <TouchableOpacity onPress={onPress}>
        <ArrowButton side={side} isVisible={isVisible} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
