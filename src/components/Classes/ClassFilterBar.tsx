import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../../constants";

interface ClassFilterBarProps {
    onPress: () => void;
    activeFilterCount: number;
}

export default function ClassFilterBar({ onPress, activeFilterCount }: ClassFilterBarProps) {
    return (
        <View style={styles.filterBar}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Ionicons name="funnel-outline" size={20} color={COLORS.primary} />
                <Text style={styles.filterButtonText}>Filtros</Text>
                {activeFilterCount > 0 && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    filterBar: {
        paddingBottom: SPACING.md,
        gap: SPACING.sm,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.sm,
        position: "relative",
        width: 100,
        height: 40,
        ...SHADOWS.sm,
    },
    filterButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.primary,
    },
    filterBadge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: COLORS.error,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SPACING.xs,
    },
    filterBadgeText: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.xs,
        fontWeight: "bold",
    },
});
