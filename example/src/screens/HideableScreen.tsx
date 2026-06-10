import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PiPView, PiPViewBlurOverlay } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ScreenInfo,
  usePipLayout,
} from './shared';

export const HideableScreen = () => {
  const layout = usePipLayout();
  const [pipPresses, setPipPresses] = useState(0);

  return (
    <View style={styles.container}>
      <ScreenInfo>
        hideable + snapToEdges + PiPViewBlurOverlay. Drag far past a side edge
        (overdrag) or flick fast — the PiP docks off-screen and shows an arrow
        handle. Tap the handle to bring it back. The content blurs during
        overdrag.
      </ScreenInfo>

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        <PiPView
          hideable
          snapToEdges
          onPress={() => setPipPresses((count) => count + 1)}
          initialPosition={{ x: 'left', y: 'top' }}
          layout={layout}
        >
          <PipContent size={96}>
            <Text style={styles.label}>PiP:{pipPresses}</Text>
            <PiPViewBlurOverlay />
          </PipContent>
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
  label: {
    color: '#fff',
    fontWeight: '600',
  },
});
