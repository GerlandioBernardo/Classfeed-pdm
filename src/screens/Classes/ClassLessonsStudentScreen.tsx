import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ClassTabParamList } from "../../types";
import { LessonCard } from "../../components/common/lessonCard/LessonCard";
import { useClasses } from "../../contexts/ClassContext";
import { COLORS, SPACING } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<ClassTabParamList, "Lessons">;

interface Lesson {
    id: string;
    title: string;
    date: string;
}

export default function ClassLessonsStudentScreen({ route }: Props) {
    const { classId } = route.params;

    const { getClassById, refreshing, refreshClasses } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation();

    const [lessons, setLessons] = useState<Lesson[]>([]);

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

        setLessons([
            { id: "1", title: "Introdução a DevOps", date: "26 de novembro" },
            { id: "2", title: "Introdução a DevOps 2", date: "26 de novembro" },
            { id: "3", title: "Introdução ao GitLab 1", date: "26 de novembro" },
            { id: "4", title: "Introdução ao GitLab 2", date: "26 de novembro" },
            { id: "5", title: "Introdução ao GitLab 3", date: "26 de novembro" },
        ]);
    }

    async function onRefresh() {
        await refreshClasses();
        loadData();
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <LessonCard title={item.title} date={item.date} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
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
