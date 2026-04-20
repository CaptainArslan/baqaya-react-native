import React, { type ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type MaterialIconName = NonNullable<ComponentProps<typeof MaterialIcons>['name']>;

type Props = {
  name: MaterialIconName;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof MaterialIcons>['style'];
};

/** Thin wrapper around Material Icons for consistent usage across Baqaya. */
export function MaterialIcon({ name, size = 24, color, style }: Props) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
