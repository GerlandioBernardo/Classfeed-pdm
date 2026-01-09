import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthCredentials, RegisterData, UpdateProfileData } from "../types";
import { STORAGE_KEYS } from "../constants";
import * as authService from "../services/authService";
import * as userService from "../services/userService";
import { ImagePickerAsset } from "expo-image-picker";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: UpdateProfileData) => Promise<void>;
  updateUserProfilePicture: (image: ImagePickerAsset) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
    const response = await authService.signIn(credentials);

    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

    setUser(response.user);
  }

  async function signUp(data: RegisterData) {
    const response = await authService.signUp(data);
    await AsyncStorage.setItem(STORAGE_KEYS.OTP_TOKEN, response.token);
  }

  async function signOut() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
    setUser(null);
  }

  async function verifyEmail(code: string) {
    const response = await authService.verifyEmail(code);
    await AsyncStorage.removeItem(STORAGE_KEYS.OTP_TOKEN);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

    setUser(response.user);
  }

  // TO-DO
  async function forgotPassword(email: string) {
    // await authService.forgotPassword(email);
  }

  async function updateUserProfile(data: UpdateProfileData) {
    const response = await userService.updateProfile(data);
    setUser(response);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
  }

  async function updateUserProfilePicture(image: ImagePickerAsset) {
    const response = await userService.updateProfilePicture(image);
    setUser(response);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
  }

  async function deleteAccount() {
    await userService.deleteAccount();
    await signOut();
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    await userService.updatePassword(currentPassword, newPassword);
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
        forgotPassword,
        updateUserProfilePicture,
        updateUserProfile,
        deleteAccount,
        updatePassword,
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
