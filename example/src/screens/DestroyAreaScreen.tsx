import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { PiPView } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ROOT_TOP_PADDING,
  ScreenInfo,
  usePipLayout,
} from './shared';

const DESTROY_AREA_HEIGHT = 110;
const DESTROY_AREA_BOTTOM_MARGIN = 30;

export const DestroyAreaScreen = () => {
  const { width, height } = useWindowDimensions();
  // Bottom inset small enough that the drag area overlaps the destroy
  // area — the PiP must reach it without fighting the edge resistance.
  const layout = usePipLayout(70);
  const [visible, setVisible] = useState(true);
  const [destroyCount, setDestroyCount] = useState(0);

  return (
    <View style={styles.container}>
      <ScreenInfo>
        destroyArea + onDestroy + hideable, numeric initialPosition (x: 12, y:
        12). Drop the PiP onto the highlighted area at the bottom — it shrinks
        to zero and disappears (onDestroy fires after ~150 ms). Destroyed:{' '}
        {destroyCount}
      </ScreenInfo>

      {!visible && (
        <Pressable
          style={styles.respawnButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.respawnText}>Respawn PiP</Text>
        </Pressable>
      )}

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        {visible && (
          <PiPView
            hideable
            snapToEdges
            initialPosition={{ x: 12, y: 12 }}
            layout={layout}
            destroyArea={{
              layout: {
                x: 24,
                y:
                  height -
                  ROOT_TOP_PADDING -
                  DESTROY_AREA_BOTTOM_MARGIN -
                  DESTROY_AREA_HEIGHT,
                width: width - 48,
                height: DESTROY_AREA_HEIGHT,
              },
              activeColor: 'rgba(255, 80, 80, 0.35)',
              inactiveColor: 'rgba(255, 255, 255, 0.08)',
            }}
            onDestroy={() => {
              setVisible(false);
              setDestroyCount((count) => count + 1);
            }}
          >
            <PipContent label="drop me" />
          </PiPView>
        )}
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
  respawnButton: {
    alignSelf: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(120, 255, 160, 0.25)',
    borderColor: 'rgba(120, 255, 160, 0.6)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  respawnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
