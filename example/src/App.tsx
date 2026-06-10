import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BasicScreen } from './screens/BasicScreen';
import { CustomHandlesScreen } from './screens/CustomHandlesScreen';
import { DestroyAreaScreen } from './screens/DestroyAreaScreen';
import { DisabledScreen } from './screens/DisabledScreen';
import { HideableScreen } from './screens/HideableScreen';
import { PositionsScreen } from './screens/PositionsScreen';

const SCREENS = [
  { key: 'basic', title: 'Basic', component: BasicScreen },
  { key: 'hideable', title: 'Hideable', component: HideableScreen },
  { key: 'handles', title: 'Custom handles', component: CustomHandlesScreen },
  { key: 'destroy', title: 'Destroy area', component: DestroyAreaScreen },
  { key: 'disabled', title: 'Disabled', component: DisabledScreen },
  { key: 'positions', title: 'Positions', component: PositionsScreen },
] as const;

type ScreenKey = (typeof SCREENS)[number]['key'];

export default function App() {
  const [screenKey, setScreenKey] = useState<ScreenKey>('basic');
  const screen = SCREENS.find((item) => item.key === screenKey) ?? SCREENS[0];
  const Screen = screen.component;

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.tabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {SCREENS.map((item) => (
            <Pressable
              key={item.key}
              testID={`tab-${item.key}`}
              style={[styles.tab, item.key === screenKey && styles.tabActive]}
              onPress={() => setScreenKey(item.key)}
            >
              <Text style={styles.tabText}>{item.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Screen key={screen.key} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  tabs: {
    height: 44,
  },
  tabsContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  tab: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tabActive: {
    backgroundColor: 'rgba(80, 120, 255, 0.55)',
  },
  tabText: {
    color: '#fff',
    fontSize: 13,
  },
});
