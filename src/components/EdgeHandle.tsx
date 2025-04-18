import {
  StyleSheet,
  TouchableOpacity,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { animationsPresets } from '../constants';
import { usePiPViewContext } from '../context/PiPView.provider';
import { type EdgeSide } from '../models';
import { ArrowButton } from './ArrowButton';
import { CustomEdgeHandle } from './CustomEdgeHandle';

interface Props {
  translateX: SharedValue<number>;
  isVisible: SharedValue<boolean>;
  onPress: (event: GestureResponderEvent) => void;
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

  return (
    <Animated.View style={[containerStyle, style, styles.button]}>
      <TouchableOpacity onPress={onPress}>
        {edgeHandle?.left && edgeHandle.right ? (
          <CustomEdgeHandle side={side} isVisible={isVisible} />
        ) : (
          <ArrowButton side={side} isVisible={isVisible} />
        )}
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
