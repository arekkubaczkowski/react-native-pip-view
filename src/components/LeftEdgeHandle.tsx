import { useDerivedValue } from 'react-native-reanimated';

import { StyleSheet, type GestureResponderEvent } from 'react-native';
import { usePiPViewContext } from '../context/PiPView.provider';
import { EdgeHandle } from './EdgeHandle';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

export const LeftEdgeHandle = ({ onPress }: Props) => {
  const dockSide = usePiPViewContext((state) => state.dockSide);
  const overDragSide = usePiPViewContext((state) => state.overDragSide);
  const edgeHandleLayout = usePiPViewContext((state) => state.edgeHandleLayout);

  const translateX = useDerivedValue<number>(() => {
    if (overDragSide.value === 'left' || dockSide.value === 'left') {
      return edgeHandleLayout.value.width;
    }
    return 0;
  });

  const isVisible = useDerivedValue(
    () => overDragSide.value === 'left' || dockSide.value === 'left'
  );

  return (
    <EdgeHandle
      style={styles.button}
      isVisible={isVisible}
      translateX={translateX}
      side="right"
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    right: 0,
  },
});
