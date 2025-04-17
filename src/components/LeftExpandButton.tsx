import { useDerivedValue } from 'react-native-reanimated';

import { StyleSheet } from 'react-native';
import { ARROW_WIDTH } from '../constants';
import { ExpandButton } from './ExpandButton';
import { usePiPViewContext } from '../context/PiPView.provider';

interface Props {
  onPress: () => void;
}

export const LeftExpandButton = ({ onPress }: Props) => {
  const { dockSide, elementLayout, overDragSide } = usePiPViewContext(
    (state) => ({
      onPress: state.onPress,
      overDragSide: state.overDragSide,
      dockSide: state.dockSide,
      elementLayout: state.elementLayout,
    })
  );
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
    () => overDragSide.value === 'left' || dockSide.value === 'left'
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

const styles = StyleSheet.create({
  button: {
    right: 0,
  },
});
