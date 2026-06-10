import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PiPView, type PiPViewInitialPosition } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ScreenInfo,
  usePipLayout,
} from './shared';

const X_OPTIONS = ['left', 'center', 'right', 24] as const;
const Y_OPTIONS = ['top', 'center', 'bottom', 24] as const;

export const PositionsScreen = () => {
  const layout = usePipLayout(40, 280);
  const [x, setX] = useState<PiPViewInitialPosition['x']>('right');
  const [y, setY] = useState<PiPViewInitialPosition['y']>('bottom');

  return (
    <View style={styles.container}>
      <ScreenInfo>
        initialPosition variants (named and numeric) + snapToEdges=false — on
        release Y stays where you left it (clamped only), X still snaps to an
        edge. Picking an option remounts the PiP.
      </ScreenInfo>

      <View style={styles.optionsRow}>
        <Text style={styles.optionsLabel}>x:</Text>
        {X_OPTIONS.map((option) => (
          <Pressable
            key={String(option)}
            style={[styles.option, x === option && styles.optionActive]}
            onPress={() => setX(option)}
          >
            <Text style={styles.optionText}>{String(option)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.optionsRow}>
        <Text style={styles.optionsLabel}>y:</Text>
        {Y_OPTIONS.map((option) => (
          <Pressable
            key={String(option)}
            style={[styles.option, y === option && styles.optionActive]}
            onPress={() => setY(option)}
          >
            <Text style={styles.optionText}>{String(option)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        <PiPView
          key={`${x}-${y}`}
          hideable={false}
          snapToEdges={false}
          initialPosition={{ x, y }}
          layout={layout}
        >
          <PipContent label={`${x}/${y}`} />
        </PiPView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  optionsLabel: {
    color: '#fff',
    width: 16,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionActive: {
    backgroundColor: 'rgba(120, 255, 160, 0.35)',
  },
  optionText: {
    color: '#fff',
  },
  pipWrapper: {
    ...StyleSheet.absoluteFill,
  },
});
