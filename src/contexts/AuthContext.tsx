import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthCredentials, RegisterData } from "../types";
import { STORAGE_KEYS } from "../constants";
import * as authService from "../services/authService";

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (credentials: AuthCredentials) => Promise<void>;
    signUp: (data: RegisterData) => Promise<void>;
    signOut: () => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    async function loadStoredData() {
        try {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
                AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
            ]);

            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading stored data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(credentials: AuthCredentials) {
        try {
            const response = await authService.signIn(credentials);

            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

            setUser(response.user);
        } catch (error) {
            throw error;
        }
    }

    async function signUp(data: RegisterData) {
        try {
            const response = await authService.signUp(data);
            await AsyncStorage.setItem(STORAGE_KEYS.OTP_TOKEN, response.token);
        } catch (error) {
            throw error;
        }
    }

    async function signOut() {
        try {
            await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }

    async function verifyEmail(code: string) {
        try {
            const response = await authService.verifyEmail(code);
            await AsyncStorage.removeItem(STORAGE_KEYS.OTP_TOKEN);
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

            setUser(response.user);
        } catch (error) {
            throw error;
        }
    }

    async function forgotPassword(email: string) {
        try {
            await authService.forgotPassword(email);
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signOut,
                verifyEmail,
                forgotPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
