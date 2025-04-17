import React from 'react';
import {
  type GestureResponderEvent,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  useAnimatedStyle,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ArrowButton } from './ArrowButton';
import { type EdgeSide } from './models';
import { customAnimations } from '@/services/Unistyles/themes';
import { AnimatedView } from '@/ui/StyledView/AnimatedView';
import { Touchable } from '@/ui/Touchable';

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
    <AnimatedView
      style={[containerStyle, style]}
      justifyContent="center"
      alignItems="flex-start"
      position="absolute"
    >
      <Touchable onPress={onPress}>
        <ArrowButton side={side} isVisible={isVisible} />
      </Touchable>
    </AnimatedView>
  );
};
