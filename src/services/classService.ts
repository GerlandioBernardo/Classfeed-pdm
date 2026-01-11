import api from "./api";
import { Class, CreateClassData, User } from "../types";

interface AllClassesResponse {
    teacherClasses: Class[];
    studentClasses: Class[];
}

// class management

export async function getClasses(): Promise<AllClassesResponse> {
    const response = await api.get("/class");
    return response.data;
}

export async function getClassById(classId: string): Promise<Class> {
    const response = await api.get(`/class/${classId}`);
    return response.data;
}

export async function createClass(classData: CreateClassData): Promise<Class> {
    const response = await api.post("/class", classData);
    return response.data;
}

export async function editClass(classId: string, classData: Partial<CreateClassData>): Promise<Class> {
    const response = await api.patch(`/class/${classId}`, classData);
    return response.data;
}

export async function deleteClass(classId: string): Promise<void> {
    await api.delete(`/class/${classId}`);
}

// student management

export async function getStudent(classId: string): Promise<User> {
    const response = await api.get(`/class/${classId}/student`);
    return response.data;
}

export async function getStudents(classId: string): Promise<Class["students"]> {
    const response = await api.get(`/class/${classId}/student`);
    return response.data;
}

export async function addStudent(classId: string, studentEmail: string): Promise<Class> {
    const response = await api.post(`/class/${classId}/student`, { email: studentEmail });
    return response.data;
}

export async function removeStudent(classId: string, studentId: string): Promise<Class> {
    const response = await api.delete(`/class/${classId}/student${studentId}`);
    return response.data;
}

export async function dropClass(classId: string): Promise<void> {
    await api.delete(`/class/${classId}/drop`);
}
