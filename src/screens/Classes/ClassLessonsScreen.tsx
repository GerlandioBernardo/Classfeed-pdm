import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, Class, Lesson } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as lessonService from "../../services/lessonService";

type Props = NativeStackScreenProps<ClassTabParamList, "Lessons">;

export default function ClassLessonsScreen({ route }: Props) {
    const { classId } = route.params;
    const { user } = useAuth();
    const { getClassById } = useClasses();
    const { showSnackbar } = useSnackbar();
    const [classData, setClassData] = useState<Class | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    const isProfessor = classData?.teacherId === user?.id;

    // Reload lessons when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [classId])
    );

    async function loadData() {
        try {
            setLoading(true);
            const classResponse = getClassById(classId);

            if (!classResponse) {
                showSnackbar("Erro ao carregar a turma", "error");
                navigation.goBack();
                return;
            }

            setClassData(classResponse);

            // Fetch lessons from backend
            const lessonsData = await lessonService.getLessons(classId);
            setLessons(lessonsData);
        } catch (error) {
            console.error("Error loading lessons:", error);
            showSnackbar("Erro ao carregar aulas", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleAddLesson() {
        navigation.navigate("CreateLesson", { classId } as any);
    }
    function renderLesson({ item }: { item: Lesson }) {
        const lessonDate = new Date(item.dateTime);
        const formattedDate = lessonDate.toLocaleDateString("pt-BR");
        const formattedTime = lessonDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        function handleLessonPress() {
            if (isProfessor) {
                navigation.navigate("ClassInfoTeacher", { classId, lessonId: item.id });
            } else {
                navigation.navigate("ClassInfoStudent", { classId, lessonId: item.id });
            }
        }

        return (
            <TouchableOpacity style={styles.lessonCard} onPress={handleLessonPress}>
                <View style={styles.lessonHeader}>
                    <Text style={styles.lessonTitle}>{item.title}</Text>
                    <Text style={styles.lessonDate}>{formattedDate}</Text>
                </View>
                <Text style={styles.lessonTime}>🕐 {formattedTime}</Text>
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
            {lessons.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyText}>Nenhuma aula cadastrada</Text>
                    <Text style={styles.emptySubtext}>
                        {isProfessor
                            ? "Adicione aulas usando o botão abaixo"
                            : "As aulas criadas para esta turma aparecerão aqui"}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={lessons}
                    renderItem={renderLesson}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

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
    listContent: {
        padding: SPACING.md,
    },
    lessonCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    lessonHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.xs,
    },
    lessonTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.text.primary,
        flex: 1,
    },
    lessonDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    lessonTime: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
});
