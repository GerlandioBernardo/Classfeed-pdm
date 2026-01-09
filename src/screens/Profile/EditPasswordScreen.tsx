import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackparamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, VALIDATION } from "../../constants";
import { Header } from "../../components/common/Header";
import Input from "../../components/common/Input";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CustomButton } from "../../components/common/CustomButton";
import { AxiosError } from "axios";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<ProfileStackparamList, "EditPassword">;

export default function EditPasswordScreen({ navigation }: Props) {
  const { updatePassword } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ current: "", newPassword: "", confirmNewPassword: "" });

  useFocusEffect(
    useCallback(() => {
      setCurrent("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswords(false);
      setLoading(false);
      setErrors({ current: "", newPassword: "", confirmNewPassword: "" });
    }, []),
  );

  function validateForm(): boolean {
    const newErrors = { current: "", newPassword: "", confirmNewPassword: "" };
    let isValid = true;

    if (!current) {
      newErrors.current = "Senha atual é obrigatória";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória";
      isValid = false;
    } else if (newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.newPassword = `Nova senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
      isValid = false;
    }

    if (confirmNewPassword !== newPassword) {
      newErrors.confirmNewPassword = "As senhas não coincidem";
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

  async function handleUpdate() {
    if (!validateForm()) return;
    setLoading(true);

    try {
      await updatePassword(current, newPassword);
      showSnackbar("Senha atualizada com sucesso!", "success");
      setTimeout(() => {
        setLoading(false);
        navigation.goBack();
      }, 800);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setErrors((prev) => ({ ...prev, current: "Senha atual incorreta" }));
      } else {
        showSnackbar("Erro ao atualizar a senha. Verifique sua senha atual e tente novamente.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleShowPasswords() {
    setShowPasswords((prev) => !prev);
  }

  return (
    <View style={styles.container}>
      <Header title="Alterar Senha" />

      <View style={styles.content}>
        <Pressable style={styles.toggleContainer} onPress={toggleShowPasswords}>
          <Ionicons name={showPasswords ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.primary} />
          <Text style={styles.toggleText}>{showPasswords ? "Ocultar senhas" : "Mostrar senhas"}</Text>
        </Pressable>

        <View>
          <Input
            label="Senha Atual"
            value={current}
            onChangeText={(text) => handleAndRemoveError(text, "current", setCurrent)}
            secureTextEntry={!showPasswords}
            errorStr={errors.current}
            placeholder={showPasswords ? "" : "••••••••"}
          />
          <Input
            label="Nova Senha"
            value={newPassword}
            onChangeText={(text) => handleAndRemoveError(text, "newPassword", setNewPassword)}
            secureTextEntry={!showPasswords}
            errorStr={errors.newPassword}
            placeholder={showPasswords ? "" : "••••••••"}
          />
          <Input
            label="Confirmar Nova Senha"
            value={confirmNewPassword}
            onChangeText={(text) => handleAndRemoveError(text, "confirmNewPassword", setConfirmNewPassword)}
            secureTextEntry={!showPasswords}
            errorStr={errors.confirmNewPassword}
            placeholder={showPasswords ? "" : "••••••••"}
          />
        </View>

        <CustomButton
          title="Salvar Alterações"
          icon={() => <Ionicons name="save-sharp" size={18} color={COLORS.surface} />}
          onPress={handleUpdate}
          loading={loading}
          size="medium"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  input: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  saveText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: BORDER_RADIUS.md,
  },
  toggleText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: "500",
  },
});
