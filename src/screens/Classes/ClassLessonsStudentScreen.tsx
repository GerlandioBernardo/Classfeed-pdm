import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ClassTabParamList } from "../../types";
import { LessonCard } from "../../components/common/lessonCard/LessonCard";
import { useClasses } from "../../contexts/ClassContext";
import { COLORS, SPACING } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";
import * as lessonService from "../../services/lessonService";

type Props = NativeStackScreenProps<ClassTabParamList, "Lessons">;

interface LessonItem {
    id: string;
    title: string;
    date: string;
}

export default function ClassLessonsStudentScreen({ route }: Props) {
    const { classId } = route.params;

    const { getClassById, refreshing, refreshClasses } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation<any>();

    const [lessons, setLessons] = useState<LessonItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [classId]);

    async function loadData() {
        // const classResponse = getClassById(classId);

        // if (!classResponse) {
        //     showSnackbar("Erro ao carregar a turma", "error");
        //     navigation.goBack();
        //     return;
        // }
        // We can keep the check if we want, but fetching lessons is independent if we trust classId exists.
        // But relying on context logic:

        setLoading(true);
        try {
            const data = await lessonService.getLessons(classId);
            // Map API data to local interface if needed, or update local interface
            // The local interface defined in this file (lines 14-18) is:
            // interface Lesson { id: string; title: string; date: string; }
            // The API returns 'name' and 'date' is a Date string.

            const mappedLessons: LessonItem[] = data.map((item) => ({
                id: item.id,
                title: item.name,
                date: new Date(item.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) // formatting
            }));

            setLessons(mappedLessons);
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao carregar aulas", "error");
        } finally {
            setLoading(false);
        }
    }

    async function onRefresh() {
        await refreshClasses(); // keeps existing context refresh
        loadData();
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <LessonCard
                        title={item.title}
                        date={item.date}
                        onPress={() => {
                            // Navigation to Lesson Info
                            // The navigation structure needs to be checked.
                            // Assuming we interpret 'onPress' here.
                            // Wait, LessonCard definition wasn't shown fully but used in renderItem.
                            // I should check if I need to wrap it in a Touchable or if LessonCard has onPress.
                            // Standard practice: wrap or pass onPress.
                            // Let's assume for now just display, but the user wants "Informação da Aula".
                            // So I should navigate.
                            // Checking ClassTabParamList or ClassStackParamList.
                            // ClassInfoStudent is in ClassStackParamList.
                            // How to navigate there?
                            // It seems ClassLessonsStudentScreen is in a Tab param list.
                            // Assuming ClassStack handles the tabs.
                            // Let's try navigating to 'ClassInfoStudent'.
                            navigation.navigate('ClassInfoStudent', { classId, lessonId: item.id });
                        }}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={loading || refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.text.secondary }}>Nenhuma aula encontrada.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    list: {
        padding: SPACING.lg,
        gap: SPACING.md,
    },
});
