import { memo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';

import { StyleSheet, type GestureResponderEvent } from 'react-native';
import { usePiPViewContext } from '../context/PiPView.provider';
import { EdgeHandle } from './EdgeHandle';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

const LeftEdgeHandleComponent = ({ onPress }: Props) => {
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
      side="right"
      onPress={onPress}
    />
  );
};

export const LeftEdgeHandle = memo(LeftEdgeHandleComponent);

const styles = StyleSheet.create({
  button: {
    right: 0,
  },
});
