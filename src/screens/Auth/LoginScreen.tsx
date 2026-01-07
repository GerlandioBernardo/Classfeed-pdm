import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { COLORS, SPACING, FONT_SIZES, VALIDATION } from "../../constants";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });

    function validateForm(): boolean {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!email) {
            newErrors.email = "Email é obrigatório";
            isValid = false;
        } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
            newErrors.email = "Email inválido";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Senha é obrigatória";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    async function handleLogin() {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signIn({ email, password });
        } catch (error: any) {
            Alert.alert(
                "Erro ao fazer login",
                error.response?.data?.message || "Verifique suas credenciais e tente novamente"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.logo}>📚</Text>
                    <Text style={styles.title}>Classfeed</Text>
                    <Text style={styles.subtitle}>Conectando professores e alunos para uma educação melhor</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="joao@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                    />

                    <Input
                        label="Senha"
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        error={errors.password}
                        rightIcon={<Text>{showPassword ? "🙈" : "👁️"}</Text>}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Entrar"
                        onPress={handleLogin}
                        loading={loading}
                        fullWidth
                        style={styles.loginButton}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Não tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.footerLink}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        alignItems: "center",
        marginBottom: SPACING.xxl,
    },
    logo: {
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
    },
    form: {
        width: "100%",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: SPACING.lg,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
    },
    loginButton: {
        marginBottom: SPACING.lg,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    footerLink: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: "600",
    },
});
