import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, User } from "../../types";
import { StudentCard } from "../../components/common/studentCard/StudentCard";
import { useClasses } from "../../contexts/ClassContext";
import { COLORS, SPACING } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";
import * as classService from "../../services/classService";

type Props = NativeStackScreenProps<ClassTabParamList, "Students">;

export default function ClassStudentsStudentScreen({ route }: Props) {
    const { classId } = route.params;

    const { getClassById, refreshing, refreshClasses } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation();

    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [classId]);

    async function loadData() {
        setLoading(true);
        try {
            const data = await classService.getStudents(classId);
            setStudents(data);
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao carregar alunos", "error");
        } finally {
            setLoading(false);
        }
    }

    async function onRefresh() {
        await refreshClasses();
        loadData();
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <StudentCard
                        name={item.name}
                        imageURL={item.profilePicture}
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
