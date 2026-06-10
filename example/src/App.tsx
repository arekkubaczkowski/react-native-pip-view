import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PiPView } from 'react-native-pip-view';

const TOP_BAR_HEIGHT = 54;
const PIP_SIZE = 54;

export default function App() {
  const { width, height } = useWindowDimensions();
  const [leftTaps, setLeftTaps] = useState(0);
  const [centerTaps, setCenterTaps] = useState(0);
  const [pipPresses, setPipPresses] = useState(0);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
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
          <PiPView
            hideable={false}
            snapToEdges
            onPress={() => setPipPresses((count) => count + 1)}
            initialPosition={{ x: 'right', y: 'top' }}
            layout={{
              width: width,
              height: height - 140,
              y: 100,
              x: 0,
              horizontalOffset: 12,
            }}
          >
            <View style={styles.pipContainer} testID="pip-element">
              <View style={styles.circle} />
            </View>
          </PiPView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
    paddingTop: 60,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
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
    top: 60,
  },
  pipContainer: {
    width: PIP_SIZE,
    height: PIP_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: PIP_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(120, 255, 160, 0.5)',
    borderRadius: 16,
  },
});
