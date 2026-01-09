import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SPACING, FONT_SIZES } from "../../constants";

type HeaderProps = {
    title?: string;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
};

export function Header({ title, showBackButton = true, rightComponent }: HeaderProps) {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            {showBackButton ? (
                <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                </Pressable>
            ) : (
                <View style={styles.sidePlaceholder} />
            )}

            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            {rightComponent ?? <View style={styles.sidePlaceholder} />}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    title: {
        flex: 1,
        textAlign: "center",
        fontSize: FONT_SIZES.xl,
        fontWeight: "600",
        color: COLORS.primary,
    },

    sidePlaceholder: {
        width: 28, // mesmo tamanho do ícone
    },
});
