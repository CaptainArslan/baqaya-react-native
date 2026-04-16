import { Platform } from 'react-native';

const shadow = (
  elevation: number,
  opacity = 0.08,
  radius = 8,
  offsetY = 2,
) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  });

export const Shadows = {
  none: {},
  xs: shadow(1, 0.05, 4, 1),
  sm: shadow(2, 0.07, 6, 2),
  md: shadow(4, 0.08, 10, 3),
  lg: shadow(8, 0.1, 16, 4),
  xl: shadow(12, 0.12, 24, 6),
} as const;
