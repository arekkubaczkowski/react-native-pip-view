import React from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ARROW_WIDTH } from './constants';
import { ExpandButton } from './ExpandButton';
import { usePiPViewContext } from './PiPView.provider';

interface Props {
  onPress: () => void;
}

export const LeftExpandButton = ({ onPress }: Props) => {
  const { dockSide, elementLayout, overDragSide } = usePiPViewContext(
    state => ({
      onPress: state.onPress,
      overDragSide: state.overDragSide,
      dockSide: state.dockSide,
      elementLayout: state.elementLayout,
    }),
  );
  const { styles } = useStyles(stylesheet);
  const translateX = useDerivedValue<number>(() => {
    switch (true) {
      case overDragSide.value === 'left':
        return ARROW_WIDTH;
      case dockSide.value === 'left':
        return ARROW_WIDTH;
      default:
        return 0;
    }
  });

  const isVisible = useDerivedValue(
    () => overDragSide.value === 'left' || dockSide.value === 'left',
  );

  return (
    <ExpandButton
      style={styles.button}
      elementLayout={elementLayout}
      isVisible={isVisible}
      translateX={translateX}
      side="left"
      onPress={onPress}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  button: {
    right: 0,
  },
}));
