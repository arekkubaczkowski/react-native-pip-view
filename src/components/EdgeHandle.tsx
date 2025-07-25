import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { Pressable, type PressableProps } from 'react-native-gesture-handler';
import { animationsPresets } from '../constants';
import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';
import { ArrowButton } from './ArrowButton';
import { CustomEdgeHandle } from './CustomEdgeHandle';

interface Props {
  translateX: SharedValue<number>;
  isVisible: SharedValue<boolean>;
  onPress: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  side: EdgeSide;
}

export const EdgeHandle = ({
  onPress,
  translateX,
  isVisible,
  style,
  side,
}: Props) => {
  const { edgeHandle, elementLayout } = usePiPViewContext((state) => ({
    edgeHandle: state.edgeHandle,
    elementLayout: state.elementLayout,
  }));

  const pressOpacity = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    height: elementLayout.value.height,
    transform: [
      {
        translateX: withSpring(translateX.value, animationsPresets.lazy),
      },
    ],
    opacity: withTiming(isVisible.value ? 1 : 0, {
      duration: 200,
    }),
    right: 0,
    top: 0,
    zIndex: -1,
  }));

  const pressableStyle = useAnimatedStyle(() => ({
    opacity: pressOpacity.value,
  }));

  return (
    <Animated.View style={[containerStyle, style, styles.button]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressOpacity.value = withTiming(0.6, { duration: 150 });
        }}
        onPressOut={() => {
          pressOpacity.value = withTiming(1, { duration: 150 });
        }}
        style={[styles.grow, pressableStyle]}
      >
        {edgeHandle?.left && edgeHandle.right ? (
          <CustomEdgeHandle side={side} />
        ) : (
          <ArrowButton side={side} />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
  },
  grow: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
