import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

interface InputProps extends React.ComponentProps<typeof TextInput> {
    leftIcon?: string;
    rightIcon?: string;
    focused?: boolean;
    placeholder?: string;
    keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
    maxLength?: number;
    errorStr?: string;
    onRightIconPress?: () => void;
}

export default function Input({
    leftIcon,
    rightIcon,
    onRightIconPress,
    focused,
    placeholder,
    style,
    keyboardType,
    maxLength,
    errorStr: errorStr,
    ...props
}: InputProps) {
    return (
        <View style={styles.container}>
            {props.label && <Text style={styles.label}>{props.label}</Text>}
            <TextInput
                mode="flat"
                style={[styles.input, style]}
                placeholder={placeholder}
                activeUnderlineColor={props.error ? COLORS.error : COLORS.primary}
                placeholderTextColor={COLORS.text.light}
                error={errorStr ? true : false}
                left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
                right={
                    rightIcon ? (
                        <TextInput.Icon
                            icon={rightIcon}
                            onPress={onRightIconPress}
                            color={(focused) => (focused ? COLORS.primary : COLORS.text.light)}
                        />
                    ) : undefined
                }
                {...props}
                label={undefined}
                keyboardType={keyboardType}
                maxLength={maxLength}
            />

            {errorStr && <Text style={styles.errorText}>{errorStr}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    input: {
        fontSize: FONT_SIZES.md,
        backgroundColor: COLORS.surface,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
});
