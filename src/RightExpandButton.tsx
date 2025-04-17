import React from 'react';
import { type GestureResponderEvent } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ARROW_WIDTH } from './constants';
import { ExpandButton } from './ExpandButton';
import { usePiPViewContext } from './PiPView.provider';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

export const RightExpandButton = ({ onPress }: Props) => {
  const { dockSide, elementLayout, overDragSide } = usePiPViewContext(
    state => ({
      overDragSide: state.overDragSide,
      dockSide: state.dockSide,
      elementLayout: state.elementLayout,
    }),
  );
  const { styles } = useStyles(stylesheet);

  const translateX = useDerivedValue(() => {
    switch (true) {
      case overDragSide.value === 'right':
        return -ARROW_WIDTH;
      case dockSide.value === 'right':
        return -ARROW_WIDTH;
      default:
        return 0;
    }
  });

  const isVisible = useDerivedValue(
    () => overDragSide.value === 'right' || dockSide.value === 'right',
  );

  return (
    <ExpandButton
      style={styles.button}
      elementLayout={elementLayout}
      isVisible={isVisible}
      onPress={onPress}
      translateX={translateX}
      side="right"
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  button: {
    left: 0,
  },
}));
