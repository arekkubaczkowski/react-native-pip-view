import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { PiPView } from 'react-native-pip-view';

export default function App() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <PiPView
        hideable
        snapToEdges
        onDestroy={() => {}}
        destroyArea={{
          position: {
            height: 80,
            width: 120,
            x: (width - 120) / 2,
            y: height - 180,
          },
          activeColor: 'red',
          inactiveColor: 'blue',
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
          horiozntalOffet: 12,
        }}
      >
        <View style={styles.placeholder} />
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
  placeholder: {
    width: 120,
    height: 80,
    backgroundColor: 'blue',
  },
});
