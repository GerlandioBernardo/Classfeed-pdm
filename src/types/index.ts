// user types
export interface User {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    birthdate: Date;
    createdAt: Date;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    name: string;
    confirmPassword: string;
}

// class types
export type ClassStatus = "active" | "inactive" | "archived";

export interface Class {
    id: string;
    name: string;
    institution: string;
    status: ClassStatus;
    professorId: string;
    professor: User;
    students: User[];
    inviteLink: string;
    createdAt: Date;
    updatedAt: Date;
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

export type MainTabParamList = {
    ClassesTab: undefined;
    ProfileTab: undefined;
    NotificationsTab: undefined;
};
