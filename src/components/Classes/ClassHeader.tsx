import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

interface ClassHeaderProps {
    classId: string;
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export function ClassHeader({ classId }: ClassHeaderProps) {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();
    const { getClassById } = useClasses();
    const classData = getClassById(classId);

    const isProfessor = classData?.teacherId === user?.id;

    function handleBack() {
        navigation.goBack();
    }

    function handleEdit() {
        if (!isProfessor) {
            Alert.alert("Permissão negada", "Apenas o professor pode editar a turma");
            return;
        }
        // Navega para a tela de edição da turma
        navigation.navigate("CreateEditClass", { classId });
    }

    if (!classData) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>

                {isProfessor && (
                    <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                        <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.classInfo}>
                <Text style={styles.className}>{classData.name}</Text>
                <Text style={styles.institution}>{classData.institution}</Text>

                <View style={styles.badgeContainer}>
                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor:
                                    classData.status === "Ativo" ? COLORS.success + "20" : COLORS.text.light + "20",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.badgeText,
                                {
                                    color: classData.status === "Ativo" ? COLORS.success : COLORS.text.secondary,
                                },
                            ]}
                        >
                            {classData.status === "Ativo" ? "Ativa" : "Inativa"}
                        </Text>
                    </View>

                    <View style={styles.roleContainer}>
                        <Text style={styles.roleText}>{isProfessor ? "👨‍🏫 Professor" : "👨‍🎓 Aluno"}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    backButton: {
        padding: SPACING.xs,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.primary + "10",
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.xs,
    },
    editButtonText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
    },
    classInfo: {
        paddingHorizontal: SPACING.lg,
    },
    className: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    institution: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
    },
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.md,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: "600",
    },
    roleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    roleText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
});
