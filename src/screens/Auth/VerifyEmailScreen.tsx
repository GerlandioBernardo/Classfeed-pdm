import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import Input from "../../components/common/Input";
import { CustomButton } from "../../components/common/CustomButton";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen({ navigation, route }: Props) {
    const { verifyEmail } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { email } = route.params;
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setCode("");
            setLoading(false);
            setEnabled(false);
        }, []),
    );

    function handleSetCode(value: string) {
        if (value.length === 6) {
            setEnabled(true);
        } else {
            setEnabled(false);
        }
        setCode(value);
    }

    async function handleVerify() {
        if (!code) {
            Alert.alert("Erro", "Digite o código de verificação");
            return;
        }

        setLoading(true);
        try {
            await verifyEmail(code);
            showSnackbar("Email verificado com sucesso!");
        } catch (error) {
            console.error("Error verifying email:", error);
            showSnackbar("Não foi possível verificar o email. Tente novamente.");
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

                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Digite o código abaixo</Text>
                    <Input
                        placeholder="000000"
                        value={code}
                        onChangeText={handleSetCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={{ width: 180, textAlign: "center" }}
                    />
                </View>

                <CustomButton
                    title="Verificar"
                    onPress={handleVerify}
                    disabled={!enabled}
                    loading={loading}
                    fullWidth
                    style={styles.button}
                />
                <CustomButton title="Voltar" onPress={() => navigation.goBack()} variant="outline" fullWidth />
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
    codeContainer: {
        alignItems: "center",
        marginBottom: SPACING.xl,
        width: "50%",
        marginHorizontal: "auto",
        height: 80,
    },
    codeLabel: {
        marginBottom: SPACING.sm,
        color: COLORS.text.primary,
    },
});
