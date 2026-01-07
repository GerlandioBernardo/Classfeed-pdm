import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { COLORS, SPACING, FONT_SIZES, VALIDATION } from "../../constants";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit() {
        if (!email) {
            setError("Email é obrigatório");
            return;
        }
        if (!VALIDATION.EMAIL_REGEX.test(email)) {
            setError("Email inválido");
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            Alert.alert("Email enviado!", "Verifique sua caixa de entrada para instruções de recuperação de senha.", [
                { text: "OK", onPress: () => navigation.navigate("Login") },
            ]);
        } catch (error: any) {
            Alert.alert("Erro", "Não foi possível enviar o email. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Recuperar Senha</Text>
                    <Text style={styles.subtitle}>Digite seu email para receber instruções de recuperação</Text>
                </View>

                <Input
                    label="Email"
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={error}
                />

                <Button title="Enviar Email" onPress={handleSubmit} loading={loading} fullWidth style={styles.button} />

                <Button title="Voltar" onPress={() => navigation.goBack()} variant="outline" fullWidth />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    button: {
        marginBottom: SPACING.md,
    },
});
