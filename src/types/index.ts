// user types
export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    birthdate: Date;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    name: string;
    confirmPassword: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export interface UpdateUserPassword {
    currentPassword: string;
    newPassword: string;
}

// class types
export type ClassStatus = "Ativo" | "Arquivado";

export interface Class {
    id: string;
    name: string;
    institution: string;
    subject?: string;
    status: ClassStatus;
    teacherId: string;
    teacher: User;
    students: User[];
    inviteLink: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateClassData {
    name: string;
    institution: string;
    subject?: string;
    status: ClassStatus;
}

export interface UpdateClassData extends CreateClassData {
    id: string;
}

// lesson types
export interface Lesson {
    id: string;
    classId: string;
    name: string;
    date: Date;
    time: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateLessonData {
    classId: string;
    name: string;
    date: Date;
    time: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
}

// feedback types
export type FeedbackRating = 1 | 2 | 3 | 4 | 5;
export type FeedbackType = "lesson" | "spontaneous"; // lesson = sobre uma aula específica, spontaneous = espontâneo

export interface FeedbackCriteria {
    content: FeedbackRating;
    methodology: FeedbackRating;
    engagement: FeedbackRating;
}

export interface Feedback {
    id: string;
    classId: string;
    lessonId?: string; // undefined se for feedback espontâneo
    studentId?: string; // undefined if anonymous
    criteria: FeedbackCriteria;
    comment?: string;
    isAnonymous: boolean;
    type: FeedbackType;
    createdAt: Date;
}

export interface SubmitFeedbackData {
    classId: string;
    lessonId?: string; // undefined se for feedback espontâneo
    criteria: FeedbackCriteria;
    comment?: string;
    isAnonymous: boolean;
    type: FeedbackType;
}

// stats types
export interface ClassStats {
    totalStudents: number;
    totalLessons: number;
    totalFeedbacks: number;
    averageRatings: FeedbackCriteria;
    attendanceRate?: number;
}

// navigation types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyEmail: { email: string };
};

type Coords = {
    latitude: number;
    longitude: number;
}

export type HomeStackParamList = {
    Home: undefined;
    ProfileStack: undefined;
    ClassStack: { classId: string };
    CreateEditClass: { classId?: string };
    CreateLesson: {
        location?: Coords
    };
    SelectLessonLocation: {
        location?: Coords
    };
    
};

export type ProfileStackparamList = {
    Profile: undefined;
    EditProfile: undefined;
    EditPassword: undefined;
};

export type MainTabParamList = {
    ClassesTab: undefined;
    ProfileTab: undefined;
    NotificationsTab: undefined;
};

export type ClassTabParamList = {
    Feedback: { classId: string };
    Lessons: { classId: string };
    Students: { classId: string };
};

export type ClassStackParamList = {
    ClassDetail: { classId: string };
    CreateEditClass: { classId?: string };
    ClassInfoStudent: {classId: string};
};
