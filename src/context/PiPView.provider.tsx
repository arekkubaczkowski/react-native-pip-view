import { useMemo, type PropsWithChildren } from 'react';
import { type LayoutRectangle } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { createContext, useContextSelector } from 'use-context-selector';

import { type Dimensions, type EdgeSide, type PiPViewProps } from '../models';

type PiPViewContextType =
  | (PiPViewProps & {
      dockSide: SharedValue<EdgeSide | null>;
      overDragSide: SharedValue<EdgeSide | null>;
      scale: SharedValue<number>;
      elementLayout: SharedValue<LayoutRectangle>;
      scaledElementLayout: SharedValue<Dimensions>;

      translationX: SharedValue<number>;
      translationY: SharedValue<number>;
      prevTranslationX: SharedValue<number>;
      prevTranslationY: SharedValue<number>;

      isActive: SharedValue<boolean>;
      isDestroyed: SharedValue<boolean>;
      isHighlightAreaActive: SharedValue<boolean>;

      isInitialized: SharedValue<boolean>;
      overDragOffset: SharedValue<number>;
      handleDestroy: () => void;

      edges: SharedValue<{
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
      } | null>;
    })
  | null;

const PiPViewContext = createContext<PiPViewContextType>(null);

interface Props extends NonNullable<PiPViewContextType> {}

export const PiPViewProvider = ({
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const value = useMemo(() => props, [props]);

  return (
    <PiPViewContext.Provider value={value}>{children}</PiPViewContext.Provider>
  );
};

export const usePiPViewContext = <Selected,>(
  selector: (value: NonNullable<PiPViewContextType>) => Selected
): Selected => {
  return useContextSelector<PiPViewContextType, Selected>(
    PiPViewContext,
    (value) => {
      if (value === null) {
        throw new Error(
          'usePiPViewContext must be used within a PiPViewProvider'
        );
      }
      return selector(value);
    }
  );
};
