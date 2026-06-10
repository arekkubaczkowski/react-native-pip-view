import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PiPView } from 'react-native-pip-view';

import {
  DragAreaIndicator,
  PipContent,
  ScreenInfo,
  usePipLayout,
} from './shared';

const BLOCK_COLORS = ['#f66', '#fa6', '#fd6', '#6f9', '#6cf', '#96f'];

export const DisabledScreen = () => {
  const layout = usePipLayout(40, 260);
  const [disabled, setDisabled] = useState(true);
  const [innerTaps, setInnerTaps] = useState(0);
  const [pipPresses, setPipPresses] = useState(0);

  return (
    <View style={styles.container}>
      <ScreenInfo>
        disabled — pan and pinch are off, onPress still works (PiP:
        {pipPresses}). The scroll view and the button INSIDE the PiP must keep
        working when disabled=true (gestures must not steal touches). Toggle and
        compare.
      </ScreenInfo>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>disabled: {String(disabled)}</Text>
        <Switch value={disabled} onValueChange={setDisabled} />
      </View>

      <View style={styles.pipWrapper} pointerEvents="box-none">
        <DragAreaIndicator layout={layout} />
        <PiPView
          disabled={disabled}
          hideable={false}
          snapToEdges
          onPress={() => setPipPresses((count) => count + 1)}
          initialPosition={{ x: 'center', y: 'center' }}
          layout={layout}
        >
          <PipContent size={132} style={styles.pipContent}>
            <Pressable
              style={styles.innerButton}
              onPress={() => setInnerTaps((count) => count + 1)}
            >
              <Text style={styles.innerButtonText}>inner:{innerTaps}</Text>
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}
            >
              {BLOCK_COLORS.map((color) => (
                <View
                  key={color}
                  style={[styles.block, { backgroundColor: color }]}
                />
              ))}
            </ScrollView>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  switchLabel: {
    color: '#fff',
  },
  pipWrapper: {
    ...StyleSheet.absoluteFill,
  },
  pipContent: {
    padding: 8,
    justifyContent: 'space-between',
  },
  innerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  innerButtonText: {
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  scroll: {
    flexGrow: 0,
  },
  block: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 6,
  },
});
