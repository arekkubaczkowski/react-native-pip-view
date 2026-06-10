export const applyResistance = (
  offset: number,
  min: number,
  max: number,
  resistanceFactor = 0.5
): number => {
  'worklet';
  if (offset < min) {
    return min + (offset - min) * resistanceFactor;
  } else if (offset > max) {
    return max + (offset - max) * resistanceFactor;
  }
  return offset;
};
