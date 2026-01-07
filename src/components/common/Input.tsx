import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
}

export function Input({ label, error, icon, rightIcon, onRightIconPress, style, ...props }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                {icon && <View style={styles.iconLeft}>{icon}</View>}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={COLORS.text.light}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity style={styles.iconRight} onPress={onRightIconPress} disabled={!onRightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    inputContainerError: {
        borderColor: COLORS.error,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        paddingVertical: SPACING.md,
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
});
