import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { clamp, useSharedValue } from 'react-native-reanimated';
import { usePiPViewContext } from '../context/PiPView.provider';

interface Options {
  onEnd: () => void;
}

export const usePinchGesture = ({ onEnd }: Options) => {
  const scale = usePiPViewContext((state) => state.scale);
  const pinchScaleOffset = useSharedValue(1);
  const SCALE_RESISTANCE_FACTOR = 0.4;

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          pinchScaleOffset.value = scale.value;
        })
        .onUpdate((event) => {
          const pinchDelta = (event.scale - 1) * SCALE_RESISTANCE_FACTOR;
          const value = pinchScaleOffset.value * (1 + pinchDelta);
          scale.value = clamp(value, 0.5, 1.5);
        })
        .onEnd(() => {
          let target = 1;
          if (scale.value < 0.85) {
            target = 0.7;
          } else if (scale.value < 1.15) {
            target = 1;
          } else {
            target = 1.3;
          }
          scale.value = target;
          onEnd();
        }),
    [onEnd, pinchScaleOffset, scale]
  );

  return { pinchGesture };
};
