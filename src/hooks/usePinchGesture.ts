import { useMemo } from 'react';
import { Gesture, type PinchGesture } from 'react-native-gesture-handler';
import { clamp, useSharedValue } from 'react-native-reanimated';
import { usePiPViewContext } from '../context/PiPView.provider';
import { gesture, scale as scaleConstants } from '../styles/theme';

interface Options {
  onEnd: () => void;
}

export const usePinchGesture = ({
  onEnd,
}: Options): {
  pinchGesture: PinchGesture;
} => {
  const scale = usePiPViewContext((state) => state.scale);
  const pinchScaleOffset = useSharedValue(1);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          'worklet';
          pinchScaleOffset.value = scale.value;
        })
        .onUpdate((event) => {
          'worklet';
          const pinchDelta = (event.scale - 1) * gesture.scaleResistanceFactor;
          const value = pinchScaleOffset.value * (1 + pinchDelta);
          scale.value = clamp(value, scaleConstants.min, scaleConstants.max);
        })
        .onEnd(() => {
          'worklet';
          let target = scaleConstants.normal;
          if (scale.value < scaleConstants.smallThreshold) {
            target = scaleConstants.small;
          } else if (scale.value < scaleConstants.normalThreshold) {
            target = scaleConstants.normal;
          } else {
            target = scaleConstants.large;
          }
          scale.value = target;
          onEnd();
        }),
    [onEnd, pinchScaleOffset, scale]
  );

  return { pinchGesture };
};
