import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList, AuthStackParamList, HomeStackParamList, ProfileStackparamList } from "../types";
import { COLORS } from "../constants";

// auth Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import VerifyEmailScreen from "../screens/Auth/VerifyEmailScreen";

// main screens
import HomeScreen from "../screens/Home/HomeScreen";
import CreateEditClassScreen from "../screens/Classes/CreateEditClassScreen";

// profile screens
import ProfileScreen from "../screens/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import EditPasswordScreen from "../screens/Profile/EditPasswordScreen";

// class navigator
import { ClassTabNavigator } from "./ClassTabNavigator";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackparamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </AuthStack.Navigator>
    );
}

function HomeNavigator() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="ProfileStack" component={ProfileNavigator} options={{ headerShown: false }} />
            <HomeStack.Screen name="ClassStack" component={ClassTabNavigator} options={{ headerShown: false }} />
            <HomeStack.Screen 
                name="CreateEditClass" 
                component={CreateEditClassScreen} 
                options={{ headerShown: false }} 
            />
        </HomeStack.Navigator>
    );
}

function ProfileNavigator() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: "Editar perfil" }}
            />
            <ProfileStack.Screen
                name="EditPassword"
                component={EditPasswordScreen}
                options={{ title: "Alterar Senha" }}
            />
        </ProfileStack.Navigator>
    );
}

export function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // TO-DO: tela de loading
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={["top", "bottom"]}>
            <NavigationContainer>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <RootStack.Screen name="Main" component={HomeNavigator} />
                    ) : (
                        <RootStack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}
