import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

export interface ClassFilters {
    showActive: boolean;
    showArchived: boolean;
    showAsTeacher: boolean;
    showAsStudent: boolean;
}

interface ClassFilterModalProps {
    visible: boolean;
    filters: ClassFilters;
    onClose: () => void;
    onApplyFilters: (filters: ClassFilters) => void;
}

export function ClassFilterModal({ visible, filters, onClose, onApplyFilters }: ClassFilterModalProps) {
    const [localFilters, setLocalFilters] = React.useState<ClassFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    function toggleFilter(key: keyof ClassFilters) {
        setLocalFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    function handleApply() {
        onApplyFilters(localFilters);
        onClose();
    }

    function handleClearAll() {
        const clearedFilters: ClassFilters = {
            showActive: true,
            showArchived: false,
            showAsTeacher: true,
            showAsStudent: true,
        };
        setLocalFilters(clearedFilters);
    }

    function renderCheckbox(
        label: string,
        description: string,
        key: keyof ClassFilters,
        icon: keyof typeof Ionicons.glyphMap
    ) {
        const isChecked = localFilters[key];

        return (
            <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => toggleFilter(key)}
                activeOpacity={0.7}
            >
                <View style={styles.checkboxLeft}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <Ionicons name="checkmark" size={16} color={COLORS.surface} />}
                    </View>
                    <View style={styles.labelContainer}>
                        <View style={styles.labelRow}>
                            <Ionicons name={icon} size={18} color={COLORS.text.primary} />
                            <Text style={styles.checkboxLabel}>{label}</Text>
                        </View>
                        <Text style={styles.checkboxDescription}>{description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const activeFilterCount =
        (localFilters.showActive ? 1 : 0) +
        (localFilters.showArchived ? 1 : 0) +
        (localFilters.showAsTeacher ? 1 : 0) +
        (localFilters.showAsStudent ? 1 : 0);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Filtrar Turmas</Text>
                            <Text style={styles.subtitle}>
                                {activeFilterCount} {activeFilterCount === 1 ? "filtro ativo" : "filtros ativos"}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Status da Turma</Text>
                            {renderCheckbox(
                                "Turmas Ativas",
                                "Mostrar turmas em andamento",
                                "showActive",
                                "checkmark-circle-outline"
                            )}
                            {renderCheckbox(
                                "Turmas Arquivadas",
                                "Mostrar turmas pausadas ou finalizadas",
                                "showArchived",
                                "archive-outline"
                            )}
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Meu Papel</Text>
                            {renderCheckbox(
                                "Como Professor",
                                "Turmas que você leciona",
                                "showAsTeacher",
                                "school-outline"
                            )}
                            {renderCheckbox(
                                "Como Aluno",
                                "Turmas que você estuda",
                                "showAsStudent",
                                "book-outline"
                            )}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearAll}
                        >
                            <Text style={styles.clearButtonText}>Limpar Filtros</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApply}
                        >
                            <Text style={styles.applyButtonText}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: "80%",
        ...SHADOWS.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: SPACING.md,
    },
    checkboxLeft: {
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    labelContainer: {
        flex: 1,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    checkboxLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "500",
        color: COLORS.text.primary,
    },
    checkboxDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        lineHeight: FONT_SIZES.sm * 1.4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    footer: {
        flexDirection: "row",
        padding: SPACING.lg,
        gap: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    clearButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.background,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    clearButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.text.primary,
    },
    applyButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    applyButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.surface,
    },
});
