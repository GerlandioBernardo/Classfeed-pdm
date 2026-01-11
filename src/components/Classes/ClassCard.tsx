import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from "../../constants";
import { Class } from "../../types";

interface ClassCardProps {
    __class: Class;
    onPress: () => void;
    role: "professor" | "student";
}

export default function ClassCard({ __class, role, onPress }: ClassCardProps) {
    const { name, status, institution } = __class;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <Text style={styles.className}>{name}</Text>
                <View
                    style={[styles.badge, { backgroundColor: status === "Ativo" ? COLORS.success : COLORS.text.light }]}
                >
                    <Text style={styles.badgeText}>{status === "Ativo" ? "Ativa" : "Arquivada"}</Text>
                </View>
            </View>

            <Text style={styles.institution}>{institution}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{role == "professor" ? "👨‍🏫 Professor" : "👨‍🎓 Aluno"}</Text>
                </View>
                <Text style={styles.studentCount}>
                    {/* {item.students.length} aluno{item.students.length !== 1 ? "s" : ""} */}1
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
});
