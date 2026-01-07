import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import { Class } from "../../types";
import { getClasses } from "../../services/classService";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../../constants";

export default function ClassListScreen() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    async function loadClasses() {
        try {
            const data = await getClasses();
            setClasses([data.studentClasses, data.teacherClasses].flat());
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as turmas");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    function onRefresh() {
        setRefreshing(true);
        loadClasses();
    }

    function renderClassCard({ item }: { item: Class }) {
        const isProfessor = item.professorId === user?.id;

        return (
            <TouchableOpacity
                style={styles.card}
                // TO-DO: Navegar para detalhes da turma
                onPress={() => Alert.alert("Em breve", "Detalhes da turma")}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.className}>{item.name}</Text>
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: item.status === "active" ? COLORS.success : COLORS.text.light },
                        ]}
                    >
                        <Text style={styles.badgeText}>{item.status === "active" ? "Ativa" : "Inativa"}</Text>
                    </View>
                </View>

                <Text style={styles.institution}>{item.institution}</Text>

                <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{isProfessor ? "👨‍🏫 Professor" : "👨‍🎓 Aluno"}</Text>
                    </View>
                    <Text style={styles.studentCount}>
                        {item.students.length} aluno{item.students.length !== 1 ? "s" : ""}
                    </Text>
                </View>
            </TouchableOpacity>
        );
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
                <Text style={styles.title}>Minhas Turmas</Text>
                <Button title="+ Nova Turma" onPress={() => Alert.alert("TO-DO", "Criar nova turma")} size="small" />
            </View>

            <FlatList
                data={classes}
                renderItem={renderClassCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📚</Text>
                        <Text style={styles.emptyText}>Nenhuma turma encontrada</Text>
                        <Text style={styles.emptySubtext}>
                            Crie uma turma ou entre em uma através de um link de convite
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
        padding: SPACING.lg,
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
        padding: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: SPACING.sm,
    },
    className: {
        flex: 1,
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginRight: SPACING.sm,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.surface,
        fontWeight: "600",
    },
    institution: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
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
});
