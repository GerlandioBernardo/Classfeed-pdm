import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>👤</Text>
                <Text style={styles.title}>Perfil</Text>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <Button title="Sair" onPress={signOut} variant="danger" fullWidth />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emoji: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    email: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
});
