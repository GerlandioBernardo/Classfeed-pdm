import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, Class, ClassStats, FeedbackRating, Feedback } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { getClassById } from "../../services/classService";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";
import StudentFeedbackView from "../../components/Feedback/StudentFeedbackView";
import ProfessorFeedbackView from "../../components/Feedback/ProfessorFeedbackView";
import * as lessonService from "../../services/lessonService";
import * as feedbackService from "../../services/feedbackService";

type Props = NativeStackScreenProps<ClassTabParamList, "Feedback">;

export default function ClassFeedbackScreen({ route }: Props) {
    const { classId } = route.params;
    const { user } = useAuth();
    const { refreshing } = useClasses();
    const { showSnackbar } = useSnackbar();
    const navigation = useNavigation();

    const [classData, setClassData] = useState<Class | null>(null);
    const [stats, setStats] = useState<ClassStats | null>(null);
    const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([]);

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

        try {
            const lessons = await lessonService.getLessons(classId);
            const allFeedbacks = await feedbackService.getClassFeedbacks(classId);

            if (isProfessor) {
                const totalFeedbacks = allFeedbacks.length;
                let sumContent = 0;
                let sumMethodology = 0;
                let sumEngagement = 0;

                allFeedbacks.forEach(f => {
                    sumContent += f.content;
                    sumMethodology += f.methodology;
                    sumEngagement += f.engagement;
                });

                setStats({
                    totalStudents: __class.students?.length ?? 0,
                    totalLessons: lessons.length,
                    totalFeedbacks: totalFeedbacks,
                    averageRatings: {
                        content: (totalFeedbacks > 0 ? sumContent / totalFeedbacks : 0) as FeedbackRating,
                        methodology: (totalFeedbacks > 0 ? sumMethodology / totalFeedbacks : 0) as FeedbackRating,
                        engagement: (totalFeedbacks > 0 ? sumEngagement / totalFeedbacks : 0) as FeedbackRating,
                    },
                });
            } else {
                setStudentFeedbacks(allFeedbacks);
            }
        } catch (error) {
            console.error("Error loading feedback data:", error);
            showSnackbar("Erro ao carregar feedbacks", "error");
        }
    }

    async function onRefresh() {
        loadData();
    }

    if (!isProfessor) {
        return (
            <StudentFeedbackView feedbacks={studentFeedbacks} refreshing={refreshing} onRefresh={onRefresh} />
        );
    }

    return (
        <ProfessorFeedbackView
            stats={stats}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
}
