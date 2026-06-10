import { type PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export const HEADER_HEIGHT = 200;

// Root view has paddingTop: 60, and the pip wrapper (absoluteFill) lives
// inside it — layout coordinates are relative to the wrapper, so absolute
// screen positions need to be shifted by this padding.
export const ROOT_TOP_PADDING = 60;

export const usePipLayout = (bottomInset = 40, topOffset = HEADER_HEIGHT) => {
  const { width, height } = useWindowDimensions();

  return {
    x: 0,
    y: topOffset - ROOT_TOP_PADDING,
    width,
    // getEdges treats layout.height as the BOTTOM boundary coordinate
    // (maxY = height - elementHeight - horizontalOffset), not a relative
    // height.
    height: height - ROOT_TOP_PADDING - bottomInset,
    horizontalOffset: 12,
  };
};

type PipLayout = ReturnType<typeof usePipLayout>;

export const DragAreaIndicator = ({ layout }: { layout: PipLayout }) => {
  const offset = layout.horizontalOffset ?? 0;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.dragArea,
        {
          left: layout.x + offset,
          top: layout.y,
          width: layout.width - layout.x - offset * 2,
          height: layout.height - offset - layout.y,
        },
      ]}
    />
  );
};

export const ScreenInfo = ({ children }: PropsWithChildren) => (
  <View style={styles.info}>
    <Text style={styles.infoText}>{children}</Text>
  </View>
);

interface PipContentProps {
  label?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const PipContent = ({
  label,
  size = 84,
  style,
  children,
}: PropsWithChildren<PipContentProps>) => (
  <View
    testID="pip-element"
    style={[
      styles.pipContainer,
      { width: size, height: size, borderRadius: size / 4 },
      style,
    ]}
  >
    {children ?? <Text style={styles.pipLabel}>{label ?? 'PiP'}</Text>}
  </View>
);

const styles = StyleSheet.create({
  dragArea: {
    position: 'absolute',
    backgroundColor: 'rgba(80, 120, 255, 0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(80, 120, 255, 0.3)',
    borderRadius: 12,
  },
  info: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  pipContainer: {
    backgroundColor: 'rgba(120, 255, 160, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(120, 255, 160, 0.6)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});
