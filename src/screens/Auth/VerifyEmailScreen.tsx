import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen({ navigation, route }: Props) {
    const { verifyEmail } = useAuth();
    const { email } = route.params;
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleVerify() {
        if (!code) {
            Alert.alert("Erro", "Digite o código de verificação");
            return;
        }

        setLoading(true);
        try {
            await verifyEmail(code);
        } catch (error) {
            Alert.alert("Erro", "Código inválido. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.icon}>📧</Text>
                    <Text style={styles.title}>Verificar Email</Text>
                    <Text style={styles.subtitle}>
                        Enviamos um código de verificação para{"\n"}
                        <Text style={styles.email}>{email}</Text>
                    </Text>
                </View>

                <Input
                    label="Código de Verificação"
                    placeholder="000000"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                />

                <Button title="Verificar" onPress={handleVerify} loading={loading} fullWidth style={styles.button} />

                <Button title="Voltar" onPress={() => navigation.goBack()} variant="outline" fullWidth />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: SPACING.lg,
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING.xxl,
    },
    icon: {
        fontSize: 64,
        marginBottom: SPACING.md,
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
        textAlign: "center",
        lineHeight: 20,
    },
    email: {
        fontWeight: "600",
        color: COLORS.primary,
    },
    button: {
        marginBottom: SPACING.md,
    },
});
