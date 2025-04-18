import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { PiPView, PiPViewBlurOverlay } from 'react-native-pip-view';

export default function App() {
  const { width, height } = useWindowDimensions();

  return (
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
          activeColor: 'rgba(255, 0, 255, 0.15)',
          inactiveColor: 'rgba(255, 0, 255, 0.05)',
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
          horizontalOffet: 12,
        }}
      >
        <View style={styles.pipContainer}>
          <PiPViewBlurOverlay />
        </View>
      </PiPView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipContainer: {
    width: 120,
    height: 80,
    backgroundColor: 'blue',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
