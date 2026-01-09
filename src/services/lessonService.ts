import api from "./api";
import { Lesson, CreateLessonData } from "../types";

export async function getLessonsByClass(classId: string): Promise<Lesson[]> {
    const response = await api.get(`/class/${classId}/lessons`);
    return response.data;
}

export async function getLessonById(lessonId: string): Promise<Lesson> {
    const response = await api.get(`/lesson/${lessonId}`);
    return response.data;
}

export async function createLesson(data: CreateLessonData): Promise<Lesson> {
    const response = await api.post("/lesson", data);
    return response.data;
}

export async function updateLesson(lessonId: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    const response = await api.put(`/lesson/${lessonId}`, data);
    return response.data;
}

export async function deleteLesson(lessonId: string): Promise<void> {
    await api.delete(`/lesson/${lessonId}`);
}
