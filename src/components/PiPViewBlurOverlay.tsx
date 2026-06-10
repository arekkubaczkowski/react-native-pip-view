import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const PiPViewBlurOverlay = ({ style }: Props) => {
  const overDragSide = usePiPViewContext((state) => state.overDragSide);

  const stylez = useAnimatedStyle(() => ({
    opacity: withTiming(overDragSide.value ? 1 : 0),
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, stylez, styles.container, style]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        intensity={20}
        tint="dark"
        blurMethod="dimezisBlurViewSdk31Plus"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
});
