import type { WithSpringConfig } from 'react-native-reanimated';

export const animationsPresets = {
  responsiveSpring: {
    damping: 80,
    stiffness: 200,
  },
  lazy: {
    damping: 80,
    stiffness: 300,
  },
  softLanding: {
    damping: 2000,
    stiffness: 1000,
    mass: 0.7,
  },
} satisfies Record<string, WithSpringConfig>;
