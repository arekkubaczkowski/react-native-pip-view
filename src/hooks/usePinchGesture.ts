import { Gesture, type PinchGesture } from 'react-native-gesture-handler';
import { clamp, useSharedValue } from 'react-native-reanimated';

import { usePiPViewContext } from '../context/PiPView.provider';

const SCALE_RESISTANCE_FACTOR = 0.4;
const SCALE_MIN = 0.5;
const SCALE_MAX = 1.5;
const SCALE_SNAP_SMALL = 0.7;
const SCALE_SNAP_NORMAL = 1;
const SCALE_SNAP_LARGE = 1.3;
const SCALE_SMALL_THRESHOLD = 0.85;
const SCALE_NORMAL_THRESHOLD = 1.15;

interface Options {
  onEnd: () => void;
}

export const usePinchGesture = ({
  onEnd,
}: Options): {
  pinchGesture: PinchGesture;
} => {
  const scale = usePiPViewContext((state) => state.scale);
  const disabled = usePiPViewContext((state) => state.disabled);
  const isPanActive = usePiPViewContext((state) => state.isPanActive);
  const pinchScaleOffset = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      pinchScaleOffset.set(scale.get());
    })
    .onUpdate((event) => {
      'worklet';
      const pinchDelta = (event.scale - 1) * SCALE_RESISTANCE_FACTOR;
      const value = pinchScaleOffset.get() * (1 + pinchDelta);
      scale.set(clamp(value, SCALE_MIN, SCALE_MAX));
    })
    .onFinalize((_event, success) => {
      'worklet';
      // Snap the scale even when the gesture gets cancelled, so it
      // never settles on an intermediate value.
      let target = SCALE_SNAP_NORMAL;
      if (scale.get() < SCALE_SMALL_THRESHOLD) {
        target = SCALE_SNAP_SMALL;
      } else if (scale.get() < SCALE_NORMAL_THRESHOLD) {
        target = SCALE_SNAP_NORMAL;
      } else {
        target = SCALE_SNAP_LARGE;
      }
      scale.set(target);

      // Re-snap the position only when the pinch actually ended and
      // the pan gesture is not in control anymore — otherwise lifting
      // one finger mid-drag would yank the view to an edge.
      if (success && !isPanActive.get()) {
        onEnd();
      }
    });

  return { pinchGesture };
};
