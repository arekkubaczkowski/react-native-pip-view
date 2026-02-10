import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PiPView, PiPViewBlurOverlay } from 'react-native-pip-view';

export default function App() {
  const { width, height } = useWindowDimensions();

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <PiPView
          hideable
          snapToEdges
          onDestroy={() => {}}
          destroyArea={{
            layout: {
              height: 80,
              width: 120,
              x: (width - 120) / 2,
              y: height - 180,
            },
            activeColor: 'rgba(255, 0, 255, 0.5)',
            inactiveColor: 'rgba(255, 0, 255, 0.15)',
          }}
          initialPosition={{
            x: 0,
            y: 0,
          }}
          layout={{
            width: width,
            height: height - 80,
            y: 100,
            x: 0,
            horizontalOffset: 12,
          }}
          edgeHandle={{
            left: <View style={styles.handle} />,
            right: <View style={styles.handle} />,
          }}
        >
          <View style={styles.pipContainer}>
            <View style={styles.content}>
              <View style={styles.circle} />
              <View style={styles.circle} />
            </View>
            <PiPViewBlurOverlay />
          </View>
        </PiPView>
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
  },
  pipContainer: {
    width: 180,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  circle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
  },
  content: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  handle: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255, 0.3)',
  },
});
