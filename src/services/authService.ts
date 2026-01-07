import api from "./api";
import { AuthCredentials, RegisterData, User } from "../types";

// response after initial sign up
interface CreateUserResponse {
    message: string;
    token: string;
}

// received after confirming OTP
interface PersistUserResponse extends CreateUserResponse {
    user: User;
}

interface AuthResponse {
    token: string;
    user: User;
}

export async function signIn(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export async function signUp(data: RegisterData): Promise<CreateUserResponse> {
    const response = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
    });
    return response.data;
}

export async function verifyEmail(code: string): Promise<PersistUserResponse> {
    const response = await api.post("/auth/confirmOtp", { code });
    return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
}
