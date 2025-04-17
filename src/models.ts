import { type LayoutRectangle } from 'react-native';

export type DraggableElementInitialPosition = {
  x: number | 'left' | 'right' | 'center';
  y: number | 'top' | 'bottom' | 'center';
};

export type Dimensions = {
  width: number;
  height: number;
};

export type EdgeSide = 'left' | 'right';

export type Edges = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type ContainerLayoutRectangle = Omit<LayoutRectangle, 'x' | 'y'> & {
  x?: number;
  y?: number;
};

export type DestroyArea = {
  position: ContainerLayoutRectangle;
  activeColor: string;
  inactiveColor: string;
};

export type ScreenLayoutDimensions = ContainerLayoutRectangle & {
  horiozntalOffet?: number;
};

export interface PiPViewProps {
  disabled?: boolean;
  destroyArea?: DestroyArea;
  initialPosition?: DraggableElementInitialPosition;
  hideable?: boolean;
  layout: ScreenLayoutDimensions;
  snapToEdges?: boolean;
  onDestroy?: () => void;
  onPress?: () => void;
}
