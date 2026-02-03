import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING, SHADOWS } from "../../constants";
import { Feedback } from "../../types";
import { Ionicons } from "@expo/vector-icons";

type StudentFeedbackViewProps = {
    feedbacks: Feedback[];
    refreshing: boolean;
    onRefresh: () => void;
};

export default function StudentFeedbackView({ feedbacks, refreshing, onRefresh }: StudentFeedbackViewProps) {
    const renderFeedbackItem = ({ item }: { item: Feedback }) => (
        <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
                <Text style={styles.lessonLabel}>{item.lessonTitle || `Aula: ${item.lessonId.substring(0, 8)}...`}</Text>
                <Text style={styles.dateLabel}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</Text>
            </View>
            <View style={styles.ratingsRow}>
                <RatingItem label="C" value={item.content} />
                <RatingItem label="M" value={item.methodology} />
                <RatingItem label="E" value={item.engagement} />
            </View>
            {item.comment && (
                <Text style={styles.commentText} numberOfLines={2}>{item.comment}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={feedbacks}
                keyExtractor={(item) => item.id}
                renderItem={renderFeedbackItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyText}>Você ainda não enviou feedbacks</Text>
                        <Text style={styles.emptySubtext}>Seus feedbacks aparecerão aqui</Text>
                    </View>
                }
            />
        </View>
    );
}

function RatingItem({ label, value }: { label: string, value: number }) {
    return (
        <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>{label}:</Text>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons
                        key={s}
                        name={s <= value ? "star" : "star-outline"}
                        size={12}
                        color={s <= value ? COLORS.warning : COLORS.text.light}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    listContent: {
        padding: SPACING.md,
    },
    feedbackCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    feedbackHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACING.xs,
    },
    lessonLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.text.secondary,
        fontWeight: "600",
    },
    dateLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.text.light,
    },
    ratingsRow: {
        flexDirection: "row",
        gap: SPACING.md,
        marginBottom: SPACING.xs,
    },
    ratingItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.text.secondary,
    },
    starsRow: {
        flexDirection: "row",
    },
    commentText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.primary,
        fontStyle: "italic",
        marginTop: 4,
    },
});
