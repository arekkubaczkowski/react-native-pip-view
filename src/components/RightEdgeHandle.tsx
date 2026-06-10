import { StyleSheet, type GestureResponderEvent } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';
import { EdgeHandle } from './EdgeHandle';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

export const RightEdgeHandle = ({ onPress }: Props) => {
  const dockSide = usePiPViewContext((state) => state.dockSide);
  const overDragSide = usePiPViewContext((state) => state.overDragSide);
  const edgeHandleLayout = usePiPViewContext((state) => state.edgeHandleLayout);

  const translateX = useDerivedValue(() => {
    if (overDragSide.value === 'right' || dockSide.value === 'right') {
      return -edgeHandleLayout.value.width;
    }
    return 0;
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
