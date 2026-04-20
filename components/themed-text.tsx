import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors, Typography } from "@/src/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.size.lg,
    lineHeight: Typography.size.lg * Typography.lineHeight.relaxed,
  },
  defaultSemiBold: {
    fontSize: Typography.size.lg,
    lineHeight: Typography.size.lg * Typography.lineHeight.relaxed,
    fontWeight: Typography.weight.semibold,
  },
  title: {
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.bold,
    lineHeight: Typography.size.hero,
  },
  subtitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
  },
  link: {
    lineHeight: Typography.size.xl * Typography.lineHeight.relaxed,
    fontSize: Typography.size.lg,
    color: Colors.info,
  },
});
