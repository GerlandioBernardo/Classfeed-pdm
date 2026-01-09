import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackparamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, VALIDATION } from "../../constants";
import { Header } from "../../components/common/Header";
import Input from "../../components/common/Input";
import { ProfileImagePicker } from "../../components/common/ProfileImagePicker";
import { ImagePickerAsset } from "expo-image-picker";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CustomButton } from "../../components/common/CustomButton";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<ProfileStackparamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
    const { user, updateUserProfilePicture, updateUserProfile } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [loading, setLoading] = useState(false);
    const [loadingImageUpload, setLoadingImageUpload] = useState(false);
    const [errors, setErrors] = useState({ email: "", name: "" });

    useFocusEffect(
        useCallback(() => {
            setName(user?.name ?? "");
            setEmail(user?.email ?? "");
            setLoading(false);
            setLoadingImageUpload(false);
            setErrors({ email: "", name: "" });
        }, []),
    );

    function validateForm(): boolean {
        const newErrors = { email: "", name: "" };
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

        setErrors(newErrors);
        return isValid;
    }

    function handleAndRemoveError(value: any, field: keyof typeof errors, cb: (value?: any) => any) {
        if (errors[field] !== "") {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
        }
        cb(value);
    }

    async function handleInfoUpdate() {
        if (!validateForm()) return;
        setLoading(true);

        try {
            await updateUserProfile({ name, email });
            showSnackbar("Perfil atualizado com sucesso", "success");
        } catch {
            showSnackbar("Erro ao atualizar perfil", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(image: ImagePickerAsset) {
        if (!image) return;
        setLoadingImageUpload(true);

        try {
            await updateUserProfilePicture(image);
            showSnackbar("Foto de perfil atualizada com sucesso", "success");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            showSnackbar("Erro ao atualizar foto de perfil", "error");
        } finally {
            setLoadingImageUpload(false);
        }
    }

    return (
        <View style={styles.container}>
            <Header title="Editar perfil" />

            <View style={styles.content}>
                <ProfileImagePicker
                    disabled={loading}
                    loading={loadingImageUpload}
                    uri={user?.profilePicture || ""}
                    onChange={handleImageUpload}
                />
                <View style={styles.form}>
                    <Input
                        label="Nome"
                        value={name}
                        onChangeText={(value) => handleAndRemoveError(value, "name", setName)}
                        rightIcon="close-circle"
                        errorStr={errors.name}
                        onRightIconPress={() => handleAndRemoveError("", "name", setName)}
                    />
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={(value) => handleAndRemoveError(value, "email", setEmail)}
                        rightIcon="close-circle"
                        errorStr={errors.email}
                        onRightIconPress={() => handleAndRemoveError("", "email", setEmail)}
                    />
                </View>

                <CustomButton
                    title="Salvar alterações"
                    onPress={handleInfoUpdate}
                    icon={() => <Ionicons name="save-sharp" size={18} color={COLORS.surface} />}
                    loading={loading}
                    disabled={loadingImageUpload}
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

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: FONT_SIZES.xl,
        fontWeight: "600",
        color: COLORS.primary,
    },

    content: {
        padding: SPACING.md,
    },

    form: {
        marginBottom: SPACING.lg,
    },

    input: {
        marginBottom: SPACING.md,
        backgroundColor: COLORS.background,
    },
});
