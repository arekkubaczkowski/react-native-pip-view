import { useCallback } from 'react';
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import {
  type PiPViewInitialPosition,
  type Edges,
  type ScreenLayoutDimensions,
} from '../models';

interface Options {
  edges: SharedValue<Edges | null>;
  initialPosition?: PiPViewInitialPosition;
  isInitialized: SharedValue<boolean>;
  layout: ScreenLayoutDimensions;
}

export const useInitialPosition = ({
  edges,
  initialPosition,
  isInitialized,
  layout,
}: Options) => {
  const isNumberValue = (value: any | undefined): value is number => {
    'worklet';
    return typeof value === 'number' && !Number.isNaN(value);
  };

  const resolveXPosition = useCallback(
    (position?: number | 'left' | 'right' | 'center') => {
      'worklet';
      if (isNumberValue(position)) {
        const positionWithinContainer =
          position + (layout.x || 0) + (layout.horizontalOffset ?? 0);
        return positionWithinContainer;
      }

      if (!edges.value) {
        return 0;
      }

      switch (position) {
        case 'left':
          return edges.value.minX;
        case 'right':
          return edges.value.maxX;
        case 'center':
          return (edges.value.maxX - edges.value.minX) / 2;
        default:
          return 0;
      }
    },
    [edges.value, layout.horizontalOffset, layout.x]
  );

  const resolveYPosition = useCallback(
    (position?: number | 'top' | 'bottom' | 'center') => {
      'worklet';
      if (isNumberValue(position)) {
        const positionWithinContainer = position + (layout.y || 0);
        return positionWithinContainer;
      }

      if (!edges.value) {
        return 0;
      }

      switch (position) {
        case 'top':
          return edges.value.minY;
        case 'bottom':
          return edges.value.maxY;
        case 'center':
          return (edges.value.maxY - edges.value.minY) / 2;
        default:
          return 0;
      }
    },
    [edges.value, layout.y]
  );

  const initials = useDerivedValue(() => {
    if (!isInitialized.value || !edges.value) {
      return null;
    }

    return {
      x: resolveXPosition(initialPosition?.x),
      y: resolveYPosition(initialPosition?.y),
    };
  });

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  useAnimatedReaction(
    () => ({
      initialized: isInitialized.value,
      initialValues: initials.value,
    }),
    ({ initialized, initialValues }, prev) => {
      if (initialValues && initialized && prev?.initialized !== initialized) {
        translationX.value = initialValues.x;
        translationY.value = initialValues.y;
        prevTranslationX.value = initialValues.x;
        prevTranslationY.value = initialValues.y;
      }
    }
  );

  return {
    translationX,
    translationY,
    prevTranslationX,
    prevTranslationY,
  };
};
