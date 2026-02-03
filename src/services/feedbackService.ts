import api from "./api";
import { Feedback } from "../types";

export interface CreateFeedbackData {
    content?: number;
    methodology?: number;
    engagement?: number;
    comment?: string;
    anonymous?: boolean;
}

export async function createFeedback(classId: string, lessonId: string, feedbackData: CreateFeedbackData): Promise<Feedback> {
    const response = await api.post(`/class/${classId}/lesson/${lessonId}/feedback`, feedbackData);
    return response.data;
}

export async function getFeedbacks(classId: string, lessonId: string): Promise<Feedback[]> {
    const response = await api.get(`/class/${classId}/lesson/${lessonId}/feedback`);
    return response.data;
}

export async function getFeedbackById(classId: string, lessonId: string, feedbackId: string): Promise<Feedback> {
    const response = await api.get(`/class/${classId}/lesson/${lessonId}/feedback/${feedbackId}`);
    return response.data;
}

export async function getClassFeedbacks(classId: string): Promise<Feedback[]> {
    const response = await api.get(`/class/${classId}/feedback`);
    return response.data;
}
