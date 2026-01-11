import React, { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Class, HomeStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useClasses } from "../../contexts/ClassContext";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import { Avatar, FAB } from "react-native-paper";
import { ClassFilterModal, ClassFilters } from "../../components/Classes/ClassFilterModal";
import ClassCard from "../../components/Classes/ClassCard";
import ClassFilterBar from "../../components/Classes/ClassFilterBar";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
    const { user } = useAuth();
    const { classes, loading, refreshing, refreshClasses } = useClasses();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<ClassFilters>({
        showActive: true,
        showArchived: false,
        showAsTeacher: true,
        showAsStudent: true,
    });

    useFocusEffect(
        useCallback(() => {
            refreshClasses();
        }, []),
    );

    const filteredClasses = useMemo(() => {
        return classes.filter((classItem) => {
            const isProfessor = classItem.teacherId === user?.id;
            const isStudent = !isProfessor;

            const statusMatch =
                (filters.showActive && classItem.status === "Ativo") ||
                (filters.showArchived && classItem.status === "Arquivado");

            if (!statusMatch) return false;

            const roleMatch = (filters.showAsTeacher && isProfessor) || (filters.showAsStudent && isStudent);

            return roleMatch;
        });
    }, [classes, filters, user?.id]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.showActive !== filters.showArchived) count++;
        if (filters.showAsTeacher !== filters.showAsStudent) count++;
        return count;
    }, [filters]);

    function handleApplyFilters(newFilters: ClassFilters) {
        setFilters(newFilters);
    }

    function renderClassCard({ item }: { item: Class }) {
        return (
            <ClassCard
                __class={item}
                onPress={() => navigation.navigate("ClassStack", { classId: item.id })}
                role={user?.id === item.teacherId ? "professor" : "student"}
            />
        );
    }

    function renderFilterBar() {
        return <ClassFilterBar onPress={() => setFilterModalVisible(true)} activeFilterCount={activeFilterCount} />;
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
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
                data={filteredClasses}
                renderItem={renderClassCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderFilterBar}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshClasses} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>{activeFilterCount > 0 ? "🔍" : "📚"}</Text>
                        <Text style={styles.emptyText}>
                            {activeFilterCount > 0
                                ? "Nenhuma turma encontrada com esses filtros"
                                : "Nenhuma turma encontrada"}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {activeFilterCount > 0
                                ? "Tente ajustar os filtros ou limpar todos"
                                : "Crie uma turma usando o botão + ou entre em uma através de um link de convite"}
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                color={COLORS.surface}
                onPress={() => navigation.navigate("CreateEditClass", {})}
                label="Nova Turma"
            />

            <ClassFilterModal
                visible={filterModalVisible}
                filters={filters}
                onClose={() => setFilterModalVisible(false)}
                onApplyFilters={handleApplyFilters}
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
    resultsInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resultsText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        fontWeight: "500",
    },
    clearButton: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    clearButtonText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: "600",
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        paddingTop: SPACING.md
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    studentCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        fontWeight: "500",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SPACING.xxl * 2,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        textAlign: "center",
        paddingHorizontal: SPACING.xl,
    },
    fab: {
        position: "absolute",
        right: SPACING.lg,
        bottom: SPACING.sm,
        backgroundColor: COLORS.primary,
    },
});
