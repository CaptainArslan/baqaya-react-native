import React from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors, Radius, Typography } from '../../theme';
import { getInitials } from '../../utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<Size, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

const fontSizeMap: Record<Size, number> = {
  xs: Typography.size.xs,
  sm: Typography.size.sm,
  md: Typography.size.base,
  lg: Typography.size.xl,
  xl: Typography.size.xxl,
};

interface Props {
  name?: string;
  uri?: string;
  size?: Size;
  style?: ViewStyle;
}

export function Avatar({ name = '', uri, size = 'md', style }: Props) {
  const dim = sizeMap[size];
  const containerStyle = [
    styles.container,
    { width: dim, height: dim, borderRadius: Radius.full },
    style,
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image source={{ uri }} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
});
