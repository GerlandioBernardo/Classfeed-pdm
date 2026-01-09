import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, VALIDATION } from "../../constants";
import Input from "../../components/common/Input";
import { CustomButton } from "../../components/common/CustomButton";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // reset form when screen is focused
  useFocusEffect(
    useCallback(() => {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }, []),
  );

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function validateForm(): boolean {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!name) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    } else if (name.length < VALIDATION.NAME_MIN_LENGTH) {
      newErrors.name = `Nome deve ter no mínimo ${VALIDATION.NAME_MIN_LENGTH} caracteres`;
      isValid = false;
    }

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
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleAndRemoveError(value: any, field: keyof typeof errors, cb: (value?: any) => any) {
    if (errors[field] !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
    cb(value);
  }

  async function handleRegister() {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp({ name, email, password, confirmPassword });
      navigation.navigate("VerifyEmail", { email });
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      showSnackbar("Erro ao criar conta. Tente novamente mais tarde.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Classfeed e melhore sua experiência educacional</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Erick Silva"
            value={name}
            onChangeText={(text) => handleAndRemoveError(text, "name", setName)}
            errorStr={errors.name}
          />

          <Input
            label="Email"
            placeholder="erick@mail.com"
            value={email}
            onChangeText={(text) => handleAndRemoveError(text, "email", setEmail)}
            errorStr={errors.email}
          />

          <Input
            label="Senha"
            placeholder={showPassword ? "coxinha123" : "••••••••"}
            value={password}
            onChangeText={(text) => handleAndRemoveError(text, "password", setPassword)}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            errorStr={errors.password}
          />

          <Input
            label="Confirmar Senha"
            placeholder={showConfirmPassword ? "coxinha123" : "••••••••"}
            value={confirmPassword}
            onChangeText={(text) => handleAndRemoveError(text, "confirmPassword", setConfirmPassword)}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            errorStr={errors.confirmPassword}
          />

          <CustomButton title="Criar Conta" onPress={handleRegister} loading={loading} style={styles.registerButton} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Faça login</Text>
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
  form: {
    width: "100%",
  },
  registerButton: {
    marginVertical: SPACING.lg,
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
