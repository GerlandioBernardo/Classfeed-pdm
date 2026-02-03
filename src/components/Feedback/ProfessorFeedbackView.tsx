import { ScrollView, View, Text, RefreshControl, StyleSheet } from "react-native";
import { ClassStats } from "../../types";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from "../../constants";

type ProfessorFeedbackViewProps = {
    stats: ClassStats | null;
    refreshing: boolean;
    onRefresh: () => void;
};

export default function ProfessorFeedbackView({ stats, refreshing, onRefresh }: ProfessorFeedbackViewProps) {
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
            <View style={styles.statsCard}>
                <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>

                <View style={styles.statsGrid}>
                    {[
                        { label: "Alunos", value: stats?.totalStudents ?? 0 },
                        { label: "Aulas", value: stats?.totalLessons ?? 0 },
                        { label: "Feedbacks", value: stats?.totalFeedbacks ?? 0 },
                    ].map(({ label, value }) => (
                        <View key={label} style={styles.statItem}>
                            <Text style={styles.statValue}>{value}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {stats && stats.totalFeedbacks > 0 ? (
                <View style={styles.statsCard}>
                    <Text style={styles.sectionTitle}>Médias por Critério</Text>
                    <View style={styles.criteriaGrid}>
                        {[
                            { label: "Conteúdo", value: stats.averageRatings.content },
                            { label: "Metodologia", value: stats.averageRatings.methodology },
                            { label: "Engajamento", value: stats.averageRatings.engagement },
                        ].map(({ label, value }) => (
                            <View key={label} style={styles.criteriaItem}>
                                <Text style={styles.criteriaValue}>{value.toFixed(1)}</Text>
                                <Text style={styles.criteriaLabel}>{label}</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Text key={star} style={styles.star}>
                                            {star <= Math.round(value) ? "⭐" : "☆"}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={styles.emptyText}>Nenhum feedback disponível</Text>
                    <Text style={styles.emptySubtext}>Os gráficos aparecerão aqui quando houver feedbacks</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    statsCard: {
        margin: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        marginTop: SPACING.xs,
    },
    emptyCard: {
        margin: SPACING.lg,
        marginTop: 0,
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: "center",
        ...SHADOWS.md,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
        textAlign: "center",
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        textAlign: "center",
    },
    criteriaGrid: {
        marginTop: SPACING.sm,
    },
    criteriaItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    criteriaLabel: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        marginLeft: SPACING.md,
    },
    criteriaValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        width: 40,
    },
    starsRow: {
        flexDirection: "row",
    },
    star: {
        fontSize: 14,
        marginHorizontal: 1,
    },
});
