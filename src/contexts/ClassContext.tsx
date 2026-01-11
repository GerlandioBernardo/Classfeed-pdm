import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import { Class, CreateClassData, UpdateClassData } from "../types";
import * as classService from "../services/classService";
import { useAuth } from "./AuthContext";

interface ClassContextData {
    // Estado
    classes: Class[];
    teacherClasses: Class[];
    studentClasses: Class[];
    loading: boolean;
    refreshing: boolean;

    // Métodos de busca
    loadClasses: () => Promise<void>;
    refreshClasses: () => Promise<void>;
    getClassById: (classId: string) => Class | undefined;

    // Métodos CRUD
    createClass: (data: CreateClassData) => Promise<Class>;
    updateClass: (data: UpdateClassData) => Promise<Class>;
    deleteClass: (classId: string) => Promise<void>;
    addStudent: (classId: string, studentEmail: string) => Promise<void>;
    removeStudent: (classId: string, studentId: string) => Promise<void>;
}

const ClassContext = createContext<ClassContextData>({} as ClassContextData);

interface ClassProviderProps {
    children: ReactNode;
}

export function ClassProvider({ children }: ClassProviderProps) {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Class[]>([]);
    const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
    const [studentClasses, setStudentClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Carrega as turmas na inicialização
    useEffect(() => {
        loadClasses();
    }, []);

    /**
     * Carrega todas as turmas do usuário (professor e aluno)
     */
    async function loadClasses() {
        try {
            const response = await classService.getClasses();

            setTeacherClasses(response.teacherClasses);
            setStudentClasses(response.studentClasses);
            setClasses([...response.teacherClasses, ...response.studentClasses]);
        } catch (error) {
            console.error("Error loading classes:", error);
            throw error;
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    /**
     * Recarrega as turmas (usado em pull-to-refresh)
     */
    async function refreshClasses() {
        setRefreshing(true);
        await loadClasses();
    }

    /**
     * Busca uma turma específica por ID (do cache local)
     */
    const getClassById = useCallback(
        (classId: string): Class | undefined => {
            return classes.find((c) => c.id === classId);
        },
        [classes],
    );

    async function createClass(data: CreateClassData): Promise<Class> {
        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        const newClass = await classService.createClass(data);

        setClasses((prev) => [...prev, newClass]);
        setTeacherClasses((prev) => [...prev, newClass]);

        return newClass;
    }

    /**
     * Atualiza uma turma existente
     */
    async function updateClass(data: UpdateClassData): Promise<Class> {
        // Verifica se o usuário é o professor da turma
        const classToUpdate = classes.find((c) => c.id === data.id);
        if (!classToUpdate) {
            throw new Error("Turma não encontrada");
        }

        if (classToUpdate.teacherId !== user?.id) {
            throw new Error("Apenas o professor pode editar a turma");
        }

        const updatedClass = await classService.editClass(data.id, data);

        setClasses((prev) => prev.map((c) => (c.id === data.id ? updatedClass : c)));
        setTeacherClasses((prev) => prev.map((c) => (c.id === data.id ? updatedClass : c)));

        return updatedClass;
    }

    /**
     * Deleta uma turma
     */
    async function deleteClass(classId: string): Promise<void> {
        // Verifica se o usuário é o professor da turma
        const classToDelete = classes.find((c) => c.id === classId);
        if (!classToDelete) {
            throw new Error("Turma não encontrada");
        }

        if (classToDelete.teacherId !== user?.id) {
            throw new Error("Apenas o professor pode excluir a turma");
        }

        await classService.deleteClass(classId);

        setClasses((prev) => prev.filter((c) => c.id !== classId));
        setTeacherClasses((prev) => prev.filter((c) => c.id !== classId));
    }

    /**
     * Adiciona um aluno à turma
     */
    async function addStudent(classId: string, studentEmail: string): Promise<void> {
        // Verifica se o usuário é o professor da turma
        const classToUpdate = classes.find((c) => c.id === classId);
        if (!classToUpdate) {
            throw new Error("Turma não encontrada");
        }

        if (classToUpdate.teacherId !== user?.id) {
            throw new Error("Apenas o professor pode adicionar alunos");
        }

        const updatedClass = await classService.addStudent(classId, studentEmail);

        setClasses((prev) => prev.map((c) => (c.id === classId ? updatedClass : c)));
        setTeacherClasses((prev) => prev.map((c) => (c.id === classId ? updatedClass : c)));
    }

    /**
     * Remove um aluno da turma
     */
    async function removeStudent(classId: string, studentId: string): Promise<void> {
        // Verifica se o usuário é o professor da turma
        const classToUpdate = classes.find((c) => c.id === classId);
        if (!classToUpdate) {
            throw new Error("Turma não encontrada");
        }

        if (classToUpdate.teacherId !== user?.id) {
            throw new Error("Apenas o professor pode remover alunos");
        }

        const updatedClass = await classService.removeStudent(classId, studentId);

        setClasses((prev) => prev.map((c) => (c.id === classId ? updatedClass : c)));
        setTeacherClasses((prev) => prev.map((c) => (c.id === classId ? updatedClass : c)));
    }

    return (
        <ClassContext.Provider
            value={{
                classes,
                teacherClasses,
                studentClasses,
                loading,
                refreshing,
                loadClasses,
                refreshClasses,
                getClassById,
                createClass,
                updateClass,
                deleteClass,
                addStudent,
                removeStudent,
            }}
        >
            {children}
        </ClassContext.Provider>
    );
}

/**
 * Hook para acessar o ClassContext
 */
export function useClasses() {
    const context = useContext(ClassContext);
    if (!context) {
        throw new Error("useClasses must be used within a ClassProvider");
    }
    return context;
}
