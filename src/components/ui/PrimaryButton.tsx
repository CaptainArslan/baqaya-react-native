import React from 'react';
import { Button } from './Button';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Button>, 'variant'>;

export function PrimaryButton(props: Props) {
  return <Button {...props} variant="primary" />;
}
