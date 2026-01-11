import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { SnackbarProvider } from "./src/contexts/SnackBarContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SnackbarProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SnackbarProvider>
      </AuthProvider>
    </SafeAreaProvider>

  );
}
