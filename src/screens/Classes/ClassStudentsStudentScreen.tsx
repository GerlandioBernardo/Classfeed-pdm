import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, User } from "../../types";
import { StudentCard } from "../../components/common/studentCard/StudentCard";
import { useClasses } from "../../contexts/ClassContext";
import { COLORS, SPACING } from "../../constants";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<ClassTabParamList, "Students">;

export default function ClassStudentsStudentScreen({ route }: Props) {
    const { classId } = route.params;

    const { getClassById, refreshing, refreshClasses } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation();

    const [students, setStudents] = useState<User[]>([]);

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

        setStudents([
            {
                id: "1",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
            {
                id: "2",
                name: "Maria de Souza Pereira",
                email: "maria.souza@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2001-02-02"),
            },
              {
                id: "1",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
            {
                id: "2",
                name: "Maria de Souza Pereira",
                email: "maria.souza@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2001-02-02"),
            },
              {
                id: "1",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
        ]);
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
