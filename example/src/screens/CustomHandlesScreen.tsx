import { StyleSheet, Text, View } from 'react-native';
import { PiPView } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ScreenInfo,
  usePipLayout,
} from './shared';

const Handle = ({ arrow }: { arrow: string }) => (
  <View style={styles.handle}>
    <Text style={styles.handleText}>{arrow}</Text>
  </View>
);

export const CustomHandlesScreen = () => {
  const layout = usePipLayout();

  return (
    <View style={styles.container}>
      <ScreenInfo>
        hideable + custom edgeHandle (left/right). Hide the PiP past a side edge
        — a custom handle shows up instead of the default arrow.
      </ScreenInfo>

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        <PiPView
          hideable
          snapToEdges
          initialPosition={{ x: 'right', y: 'center' }}
          layout={layout}
          edgeHandle={{
            left: <Handle arrow="›" />,
            right: <Handle arrow="‹" />,
          }}
        >
          <PipContent size={96} label="custom" />
        </PiPView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pipWrapper: {
    ...StyleSheet.absoluteFill,
  },
  handle: {
    width: 28,
    height: 72,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 120, 120, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});
