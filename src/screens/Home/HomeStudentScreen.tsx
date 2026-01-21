import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from "react-native";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import { useClasses } from "../../contexts/ClassContext";
import ClassCard from "../../components/Classes/ClassCard";
import { Class } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../types";

export default function HomeStudentScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const { user } = useAuth();
    const { studentClasses, loading } = useClasses();

    const classes = useMemo(() => studentClasses, [studentClasses]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    function renderClass({ item }: { item: Class }) {
        return (
            <ClassCard
                __class={item}
                role="student"
                onPress={() =>
                    navigation.navigate("ClassStack", { classId: item.id })
                }
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ClassFeed</Text>
                <Pressable onPress={() => navigation.navigate("ProfileStack")}>
                    <Avatar.Image size={44} source={{ uri: user?.profilePicture }} />
                </Pressable>
            </View>

            <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={renderClass}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.icon}>📚</Text>
                        <Text style={styles.text}>Nenhuma turma encontrada</Text>
                        <Text style={styles.subtext}>
                            Você ainda não está matriculado em nenhuma turma
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.text.primary,
    },

    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.lg,
    },

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SPACING.xxl * 2,
    },

    icon: {
        fontSize: 72,
        marginBottom: SPACING.lg,
    },

    text: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },

    subtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        textAlign: "center",
        paddingHorizontal: SPACING.xl,
    },
});

