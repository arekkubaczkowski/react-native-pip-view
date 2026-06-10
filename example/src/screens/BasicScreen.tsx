import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PiPView } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ScreenInfo,
  usePipLayout,
} from './shared';

export const BasicScreen = () => {
  const layout = usePipLayout(40, 260);
  const [leftTaps, setLeftTaps] = useState(0);
  const [centerTaps, setCenterTaps] = useState(0);
  const [pipPresses, setPipPresses] = useState(0);

  return (
    <View style={styles.container}>
      <ScreenInfo>
        snapToEdges, hideable=false. Tap increments PiP:N. Pushing against the
        side edges applies resistance (no overdrag). Pinch snaps the scale to
        0.7/1/1.3.
      </ScreenInfo>

      <View style={styles.topBar} testID="top-bar">
        <Pressable
          testID="top-bar-left-button"
          style={styles.topBarButton}
          onPress={() => setLeftTaps((count) => count + 1)}
        >
          <Text style={styles.topBarButtonText}>L:{leftTaps}</Text>
        </Pressable>
        <Pressable
          testID="top-bar-center-button"
          style={styles.topBarButton}
          onPress={() => setCenterTaps((count) => count + 1)}
        >
          <Text style={styles.topBarButtonText}>C:{centerTaps}</Text>
        </Pressable>
        <Text style={styles.topBarButtonText}>PiP:{pipPresses}</Text>
      </View>

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        <PiPView
          hideable={false}
          snapToEdges
          onPress={() => setPipPresses((count) => count + 1)}
          initialPosition={{ x: 'right', y: 'top' }}
          layout={layout}
        >
          <PipContent label={`PiP:${pipPresses}`} />
        </PiPView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 54,
    width: '100%',
    backgroundColor: 'rgba(80, 120, 255, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topBarButtonText: {
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  pipWrapper: {
    ...StyleSheet.absoluteFill,
  },
});
