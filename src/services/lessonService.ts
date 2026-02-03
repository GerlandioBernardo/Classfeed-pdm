import api from "./api";
import { CreateLessonData, Lesson } from "../types";

function transformLesson(backendLesson: any): Lesson {
    const { location, ...rest } = backendLesson;
    let transformedLocation = undefined;

    if (location && location.type === "Point" && Array.isArray(location.coordinates)) {
        transformedLocation = {
            longitude: location.coordinates[0],
            latitude: location.coordinates[1],
        };
    }

    return {
        ...rest,
        location: transformedLocation,
    } as Lesson;
}

export async function getLessons(classId: string): Promise<Lesson[]> {
    const response = await api.get(`/class/${classId}/lesson`);
    return response.data.map(transformLesson);
}

export async function getLessonById(classId: string, lessonId: string): Promise<Lesson> {
    const response = await api.get(`/class/${classId}/lesson/${lessonId}`);
    return transformLesson(response.data);
}

export async function createLesson(classId: string, lessonData: Omit<CreateLessonData, "classId">): Promise<Lesson> {
    // Transform frontend format to backend format
    const { name, date, time, location } = lessonData;

    console.log("Received lessonData:", { name, date, time, location });

    // Combine date and time into a single DateTime
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);

    const backendPayload = {
        title: name,
        dateTime: dateTime.toISOString(),
        location: location ? [location.longitude, location.latitude] : undefined,
    };

    console.log("Sending to backend:", backendPayload);

    const url = `/class/${classId}/lesson`;
    console.log("POST URL:", url);
    console.log("classId:", classId);

    const response = await api.post(url, backendPayload);
    return transformLesson(response.data);
}

export async function updateLesson(classId: string, lessonId: string, lessonData: Partial<CreateLessonData>): Promise<Lesson> {
    const response = await api.patch(`/class/${classId}/lesson/${lessonId}`, lessonData);
    return response.data;
}

export async function deleteLesson(classId: string, lessonId: string): Promise<void> {
    await api.delete(`/class/${classId}/lesson/${lessonId}`);
}
