import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { usePiPViewContext } from './PiPView.provider';
import { AnimatedView } from '@/ui/StyledView/AnimatedView';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const PiPViewBlurOverlay = ({ style }: Props) => {
  const overDragSide = usePiPViewContext(state => state.overDragSide);

  const stylez = useAnimatedStyle(() => ({
    opacity: withTiming(overDragSide.value ? 1 : 0),
  }));

  return (
    <AnimatedView
      style={[style, StyleSheet.absoluteFillObject, stylez]}
      zIndex={1000}
    >
      <BlurView
        style={[StyleSheet.absoluteFillObject]}
        intensity={20}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      />
    </AnimatedView>
  );
};
