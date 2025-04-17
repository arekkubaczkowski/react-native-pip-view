import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { type EdgeSide } from './models';
import { YFlex } from '@/ui/Flex';
import { FontAwesomeIcon } from '@/ui/Icon';
import { AnimatedView } from '@/ui/StyledView/AnimatedView';

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
    <AnimatedView
      width={ARROW_WIDTH}
      height={ARROW_HEIGHT}
      style={containerStyles}
      overflow="hidden"
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          tint="light"
          style={StyleSheet.absoluteFillObject}
          intensity={28}
        />
      ) : (
        <YFlex
          style={StyleSheet.absoluteFillObject}
          backgroundColor="$whiteTint25"
        />
      )}

      <AnimatedView
        width={ARROW_WIDTH}
        height={ARROW_HEIGHT}
        justifyContent="center"
        alignItems="center"
        position="absolute"
        style={leftArrowStyle}
      >
        <FontAwesomeIcon
          color="$white"
          size={12}
          name="chevron-right-regular"
        />
      </AnimatedView>

      <AnimatedView
        style={rightArrowStyle}
        width={ARROW_WIDTH}
        height={ARROW_HEIGHT}
        justifyContent="center"
        alignItems="center"
        position="absolute"
      >
        <FontAwesomeIcon color="$white" size={12} name="chevron-left-regular" />
      </AnimatedView>
    </AnimatedView>
  );
};
