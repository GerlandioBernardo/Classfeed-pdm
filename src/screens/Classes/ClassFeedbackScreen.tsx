import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, Class, ClassStats, FeedbackRating } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { getClassById } from "../../services/classService";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";
import StudentFeedbackView from "../../components/Feedback/StudentFeedbackView";
import ProfessorFeedbackView from "../../components/Feedback/ProfessorFeedbackView";

type Props = NativeStackScreenProps<ClassTabParamList, "Feedback">;

export default function ClassFeedbackScreen({ route }: Props) {
    const { classId } = route.params;
    const { user } = useAuth();
    const { refreshing } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation();

    const [classData, setClassData] = useState<Class | null>(null);
    const [stats, setStats] = useState<ClassStats | null>(null);

    const isProfessor =
        classData?.teacher?.id === user?.id;

    useEffect(() => {
        loadData();
    }, [classId, user?.id]);

    async function loadData() {
        const __class = await getClassById(classId);

        if (!__class) {
            showSnackbar("Erro ao carregar a turma", "error");
            navigation.goBack();
            return;
        }

        setClassData(__class);
        setStats({
            totalStudents: 0,
            totalLessons: 0,
            totalFeedbacks: 0,
            averageRatings: {
                content: 0 as FeedbackRating,
                methodology: 0 as FeedbackRating,
                engagement: 0 as FeedbackRating,
            },
        });
    }

    if (!isProfessor) {
        return (
            <StudentFeedbackView/>
        );
    }

    return (
        <ProfessorFeedbackView
            stats={stats}
            refreshing={refreshing}
        />
    );
}
