import { type PropsWithChildren } from 'react';
import { type LayoutRectangle } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { type Dimensions, type EdgeSide, type PiPViewProps } from '../models';
import { PiPViewProvider } from '../context/PiPView.provider';
import { PiPViewImpl } from './PiPViewImpl';
import { getEdges } from '../utils/snapping';
import { useInitialPosition } from '../hooks/useInitialPosition';

const OVER_DRAG_OFFSET_MULTIPLIER = 0.4;
const DESTROY_CALLBACK_DELAY_MS = 150;

export const PiPView = ({
  children,
  disabled,
  destroyArea,
  initialPosition,
  hideable,
  layout,
  snapToEdges,
  edgeHandle,
  onDestroy,
  onPress,
}: PropsWithChildren<PiPViewProps>) => {
  const dockSide = useSharedValue<EdgeSide | null>(null);

  const elementLayout = useSharedValue<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const edgeHandleLayout = useSharedValue({
    width: 0,
    height: 0,
  });

  const isInitialized = useDerivedValue(() => {
    const isEdgeHandleInitialized = edgeHandle
      ? edgeHandleLayout.value.width > 0 && edgeHandleLayout.value.height > 0
      : true;

    return (
      elementLayout.value.width > 0 &&
      elementLayout.value.height > 0 &&
      isEdgeHandleInitialized
    );
  });

  const isPanActive = useSharedValue(false);
  const isHighlightAreaActive = useSharedValue(false);
  const isDestroyed = useSharedValue(false);

  const scale = useSharedValue(1);

  const scaledElementLayout = useDerivedValue<Dimensions>(() => ({
    width: elementLayout.value.width * scale.value,
    height: elementLayout.value.height * scale.value,
  }));

  const edges = useDerivedValue(() => {
    if (!isInitialized.value) {
      return null;
    }
    return getEdges(layout, scaledElementLayout);
  });

  const { translationX, translationY, prevTranslationX, prevTranslationY } =
    useInitialPosition({
      initialPosition,
      edges,
      isInitialized,
      layout,
    });

  const overDragOffset = useDerivedValue(
    () => scaledElementLayout.value.width * OVER_DRAG_OFFSET_MULTIPLIER
  );

  const overDragSide = useSharedValue<EdgeSide | null>(null);

  const handleDestroy = () => {
    isDestroyed.set(true);

    setTimeout(() => {
      onDestroy?.();
    }, DESTROY_CALLBACK_DELAY_MS);
  };

  const contextValue = {
    disabled,
    destroyArea,
    initialPosition,
    hideable,
    layout,
    snapToEdges,
    edgeHandle,
    onDestroy,
    onPress,
    dockSide,
    overDragSide,
    scale,
    elementLayout,
    scaledElementLayout,
    isPanActive,
    isHighlightAreaActive,
    isDestroyed,
    isInitialized,
    edges,
    overDragOffset,
    handleDestroy,
    edgeHandleLayout,
    translationX,
    translationY,
    prevTranslationX,
    prevTranslationY,
  };

  return (
    <PiPViewProvider value={contextValue}>
      <PiPViewImpl>{children}</PiPViewImpl>
    </PiPViewProvider>
  );
};
