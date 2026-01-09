import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../../constants";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "small" | "medium" | "large";
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = "primary",
    size = "medium",
    loading = false,
    fullWidth = false,
    icon,
    disabled,
    style,
    ...props
}) => {
    const buttonStyles = [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
    ].filter(Boolean);

    const textStyles = [styles.text, styles[`text_${variant}`], styles[`text_${size}`]].filter(Boolean);

    return (
        <TouchableOpacity style={[buttonStyles, style]} disabled={disabled || loading} activeOpacity={0.7} {...props}>
            {loading ? (
                <ActivityIndicator color={variant === "outline" ? COLORS.primary : COLORS.surface} />
            ) : (
                <>
                    {icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.sm,
    },
    button_primary: {
        backgroundColor: COLORS.primary,
    },
    button_secondary: {
        backgroundColor: COLORS.secondary,
    },
    button_outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    button_danger: {
        backgroundColor: COLORS.error,
    },
    button_small: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    button_medium: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    button_large: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
    },
    fullWidth: {
        width: "100%",
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: "600",
        textAlign: "center",
    },
    text_primary: {
        color: COLORS.surface,
    },
    text_secondary: {
        color: COLORS.surface,
    },
    text_outline: {
        color: COLORS.primary,
    },
    text_danger: {
        color: COLORS.surface,
    },
    text_small: {
        fontSize: FONT_SIZES.sm,
    },
    text_medium: {
        fontSize: FONT_SIZES.md,
    },
    text_large: {
        fontSize: FONT_SIZES.lg,
    },
});
