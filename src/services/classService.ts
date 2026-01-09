import api from "./api";
import { Class } from "../types";

interface AllClassesResponse {
    teacherClasses: Class[];
    studentClasses: Class[];
}

export async function getClasses(): Promise<AllClassesResponse> {
    const response = await api.get("/class");
    return response.data;
}
