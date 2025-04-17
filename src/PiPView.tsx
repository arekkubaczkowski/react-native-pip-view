import React, { useCallback, useMemo, type PropsWithChildren } from 'react';
import { type LayoutRectangle } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { type Dimensions, type EdgeSide, type PiPViewProps } from './models';
import { PiPViewProvider } from './PiPView.provider';
import { PiPViewImpl } from './PiPViewImpl';
import { useInitialPosition } from './useInitialPosition';
import { getEdges } from './utils';

export const PiPView = ({
  children,
  ...props
}: PropsWithChildren<PiPViewProps>) => {
  const { layout, initialPosition, onDestroy } = props;

  const dockSide = useSharedValue<EdgeSide | null>(null);

  const elementLayout = useSharedValue<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const isInitialized = useDerivedValue(
    () => elementLayout.value.width > 0 && elementLayout.value.height > 0,
  );

  const isActive = useSharedValue(false);
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

  const positionValues = useInitialPosition({
    initialPosition,
    edges,
    isInitialized,
    layout,
  });

  const overDragOffset = useDerivedValue(
    () => scaledElementLayout.value.width * 0.4,
  );

  const overDragSide = useSharedValue<EdgeSide | null>(null);

  const handleDestroy = useCallback(() => {
    isDestroyed.value = true;

    const timeout = setTimeout(() => {
      onDestroy?.();
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDestroyed, onDestroy]);

  const contextValue = useMemo(
    () => ({
      dockSide,
      overDragSide,
      scale,
      elementLayout,
      scaledElementLayout,
      isActive,
      isHighlightAreaActive,
      isDestroyed,
      isInitialized,
      edges,
      overDragOffset,
      handleDestroy,
      ...positionValues,
      ...props,
    }),
    [
      dockSide,
      overDragSide,
      scale,
      elementLayout,
      isActive,
      overDragOffset,
      handleDestroy,
      isHighlightAreaActive,
      scaledElementLayout,
      isDestroyed,
      positionValues,
      isInitialized,
      edges,
      props,
    ],
  );

  return (
    <PiPViewProvider {...contextValue}>
      <PiPViewImpl>{children}</PiPViewImpl>
    </PiPViewProvider>
  );
};
