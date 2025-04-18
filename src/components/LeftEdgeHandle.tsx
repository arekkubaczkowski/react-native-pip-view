import { useDerivedValue } from 'react-native-reanimated';

import { StyleSheet } from 'react-native';
import { usePiPViewContext } from '../context/PiPView.provider';
import { EdgeHandle } from './EdgeHandle';

interface Props {
  onPress: () => void;
}

export const LeftEdgeHandle = ({ onPress }: Props) => {
  const { dockSide, overDragSide, edgeHandleLayout } = usePiPViewContext(
    (state) => ({
      onPress: state.onPress,
      overDragSide: state.overDragSide,
      dockSide: state.dockSide,
      elementLayout: state.elementLayout,
      edgeHandleLayout: state.edgeHandleLayout,
    })
  );

  const translateX = useDerivedValue<number>(() => {
    switch (true) {
      case overDragSide.value === 'left':
        return edgeHandleLayout.value.width;
      case dockSide.value === 'left':
        return edgeHandleLayout.value.width;
      default:
        return 0;
    }
  });

  const isVisible = useDerivedValue(
    () => overDragSide.value === 'left' || dockSide.value === 'left'
  );

  return (
    <EdgeHandle
      style={styles.button}
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
