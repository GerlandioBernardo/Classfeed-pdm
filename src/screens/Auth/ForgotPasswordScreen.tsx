import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, VALIDATION } from "../../constants";
import Input from "../../components/common/Input";
import { CustomButton } from "../../components/common/CustomButton";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { forgotPassword } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setLoading(false);
      setError("");
    }, []),
  );

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
    await forgotPassword(email);
    showSnackbar("Verifique sua caixa de entrada para instruções de recuperação de senha.", "success");
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  }

  function handleAndRemoveError(value: string) {
    if (error !== "") {
      setError("");
    }
    setEmail(value);
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
          onChangeText={handleAndRemoveError}
          keyboardType="email-address"
          autoCapitalize="none"
          errorStr={error}
        />

        <CustomButton title="Enviar Email" onPress={handleSubmit} loading={loading} fullWidth style={styles.button} />

        <CustomButton title="Voltar" onPress={() => navigation.goBack()} variant="outline" fullWidth />
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
    marginVertical: SPACING.lg,
  },
});
