import React from 'react';
import { Button } from './Button';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Button>, 'variant'>;

export function SecondaryButton(props: Props) {
  return <Button {...props} variant="secondary" />;
}
