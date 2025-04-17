import type { WithSpringConfig } from 'react-native-reanimated';

export const ARROW_WIDTH = 24;
export const ARROW_HEIGHT = 84;

export const customAnimations = {
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
