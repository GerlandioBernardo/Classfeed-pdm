import React from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Button, ButtonProps as PaperButtonProps } from "react-native-paper";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "small" | "medium" | "large";

interface CustomButtonProps extends Omit<PaperButtonProps, 'children'> {
  title: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function CustomButton({
  title,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  style,
  contentStyle,
  labelStyle,
  ...rest
}: CustomButtonProps) {
  const mode = getMode(variant);
  const colors = getColors(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <Button
      mode={mode}
      buttonColor={colors.background}
      textColor={colors.text}
      style={[styles.base, fullWidth && styles.fullWidth, style]}
      contentStyle={[styles.content, { paddingVertical: sizeStyles.paddingVertical }, contentStyle]}
      labelStyle={[styles.label, { fontSize: sizeStyles.fontSize }, labelStyle]}
      {...rest}
    >
      {title}
    </Button>
  );
}

/* ----------------- helpers ----------------- */

function getMode(variant: Variant): PaperButtonProps["mode"] {
  switch (variant) {
    case "outline":
      return "outlined";
    case "secondary":
      return "contained-tonal";
    default:
      return "contained";
  }
}

function getColors(variant: Variant) {
  switch (variant) {
    case "danger":
      return {
        background: COLORS.error,
        text: COLORS.surface,
      };
    case "secondary":
      return {
        background: COLORS.secondary,
        text: COLORS.surface,
      };
    case "outline":
      return {
        background: "transparent",
        text: COLORS.primary,
      };
    default:
      return {
        background: COLORS.primary,
        text: COLORS.surface,
      };
  }
}

function getSizeStyles(size: Size) {
  switch (size) {
    case "small":
      return {
        paddingVertical: SPACING.xs,
        fontSize: FONT_SIZES.sm,
      };
    case "large":
      return {
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.lg,
      };
    default:
      return {
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZES.md,
      };
  }
}

/* ----------------- styles ----------------- */

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.xll,
  } as ViewStyle,

  fullWidth: {
    width: "100%",
  } as ViewStyle,

  content: {
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,

  label: {
    fontWeight: "600",
  } as TextStyle,
});
