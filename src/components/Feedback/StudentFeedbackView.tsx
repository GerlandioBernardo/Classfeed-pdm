import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING, SHADOWS } from "../../constants";

export default function StudentFeedbackView() {
    return (
        <View style={styles.container}>
            <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>Você ainda não enviou feedbacks</Text>
                <Text style={styles.emptySubtext}>Seus feedbacks aparecerão aqui</Text>
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
});
