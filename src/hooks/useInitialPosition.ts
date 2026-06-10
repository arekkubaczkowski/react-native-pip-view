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
  // Primitives keep the worklet closures stable across consumer re-renders
  // that pass a new (but equal) `layout` object.
  const {
    x: layoutX,
    y: layoutY,
    horizontalOffset: layoutHorizontalOffset,
  } = layout;

  const isNumberValue = (value: any | undefined): value is number => {
    'worklet';
    return typeof value === 'number' && !Number.isNaN(value);
  };

  const resolveXPosition = (
    position?: number | 'left' | 'right' | 'center'
  ) => {
    'worklet';
    if (isNumberValue(position)) {
      const positionWithinContainer =
        position + (layoutX || 0) + (layoutHorizontalOffset ?? 0);
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
        return edges.value.minX + (edges.value.maxX - edges.value.minX) / 2;
      default:
        return 0;
    }
  };

  const resolveYPosition = (
    position?: number | 'top' | 'bottom' | 'center'
  ) => {
    'worklet';
    if (isNumberValue(position)) {
      const positionWithinContainer = position + (layoutY || 0);
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
        return edges.value.minY + (edges.value.maxY - edges.value.minY) / 2;
      default:
        return 0;
    }
  };

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
        translationX.set(initialValues.x);
        translationY.set(initialValues.y);
        prevTranslationX.set(initialValues.x);
        prevTranslationY.set(initialValues.y);
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
