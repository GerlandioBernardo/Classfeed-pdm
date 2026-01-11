import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, Class } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<ClassTabParamList, "Lessons">;

export default function ClassLessonsScreen({ route }: Props) {
    const { classId } = route.params;
    const { user } = useAuth();
    const { getClassById } = useClasses();
    const { showSnackbar } = useSnackbar();
    const [classData, setClassData] = useState<Class | null>(null);
    const navigation = useNavigation();

    const isProfessor = classData?.teacherId === user?.id;

    useEffect(() => {
        loadData();
    }, [classId]);

    function loadData() {
        const classResponse = getClassById(classId);

        if (!classResponse) {
            showSnackbar("Erro ao carregar a turma", "error");
            navigation.goBack();
            return;
        }

        setClassData(classResponse);
    }

    function handleAddLesson() {
        Alert.alert("Em breve", "Criar nova aula");
    }

    return (
        <View style={styles.container}>
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>Nenhuma aula cadastrada</Text>
                <Text style={styles.emptySubtext}>
                    {isProfessor
                        ? "Adicione aulas usando o botão abaixo"
                        : "As aulas criadas para esta turma aparecerão aqui"}
                </Text>
            </View>

            {isProfessor && (
                <TouchableOpacity style={styles.fab} onPress={handleAddLesson}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            )}
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
        bottom: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.lg,
    },
    fabIcon: {
        fontSize: 32,
        color: COLORS.surface,
        fontWeight: "300",
    },
});
