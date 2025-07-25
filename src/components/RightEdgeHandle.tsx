import { StyleSheet } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import type { PressableProps } from 'react-native-gesture-handler';
import { usePiPViewContext } from '../context/PiPView.provider';
import { EdgeHandle } from './EdgeHandle';

interface Props {
  onPress: PressableProps['onPress'];
}

export const RightEdgeHandle = ({ onPress }: Props) => {
  const { dockSide, overDragSide, edgeHandleLayout } = usePiPViewContext(
    (state) => ({
      overDragSide: state.overDragSide,
      dockSide: state.dockSide,
      edgeHandleLayout: state.edgeHandleLayout,
    })
  );

  const translateX = useDerivedValue(() => {
    switch (true) {
      case overDragSide.value === 'right':
        return -edgeHandleLayout.value.width;
      case dockSide.value === 'right':
        return -edgeHandleLayout.value.width;
      default:
        return 0;
    }
  });

  const isVisible = useDerivedValue(
    () => overDragSide.value === 'right' || dockSide.value === 'right'
  );

  return (
    <EdgeHandle
      style={styles.button}
      isVisible={isVisible}
      translateX={translateX}
      onPress={onPress}
      side="left"
    />
  );
};

const styles = StyleSheet.create({
  button: {
    left: 0,
  },
});
