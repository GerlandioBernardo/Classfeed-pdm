import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList, ClassStatus } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import Input from "../../components/common/Input";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";
import { CustomButton } from "../../components/common/CustomButton";
import { Header } from "../../components/common/Header";
import { SegmentedButtons } from "react-native-paper";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<HomeStackParamList, "CreateEditClass">;

export default function CreateEditClassScreen({ navigation, route }: Props) {
    const { classId } = route.params || {};
    const isEditing = !!classId;
    const { getClassById, createClass, updateClass } = useClasses();
    const { showSnackbar } = useSnackbar();

    const [name, setName] = useState("");
    const [institution, setInstitution] = useState("");
    const [subject, setSubject] = useState("");
    const [status, setStatus] = useState<ClassStatus>("Ativo");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    const [errors, setErrors] = useState({
        name: "",
        institution: "",
    });

    useEffect(() => {
        if (isEditing && classId) {
            loadClassData();
        }
    }, [classId]);

    function loadClassData() {
        try {
            const classData = getClassById(classId!);
            if (!classData) {
                showSnackbar("Turma não encontrada", "error");
                navigation.goBack();
                return;
            }
            setName(classData.name);
            setInstitution(classData.institution);
            setSubject(classData.subject || "");
            setStatus(classData.status);
        } catch (error) {
            showSnackbar("Erro ao carregar turma", "error");
            navigation.goBack();
        } finally {
            setInitialLoading(false);
        }
    }

    function handleAndRemoveError(value: any, field: keyof typeof errors, cb: (value?: any) => any) {
        if (errors[field] !== "") {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
        }
        cb(value);
    }

    function validate(): boolean {
        let valid = true;
        const newErrors = { name: "", institution: "" };

        if (!name.trim()) {
            newErrors.name = "Nome é obrigatório";
            valid = false;
        }

        if (!institution.trim()) {
            newErrors.institution = "Instituição é obrigatória";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    async function handleSubmit() {
        console.log("Submit pressed");
        if (!validate()) {
            console.log("Validation failed", errors);
            return;
        }

        setLoading(true);
        try {
            console.log("Starting create/update request");
            if (isEditing && classId) {
                await updateClass({
                    id: classId,
                    name: name.trim(),
                    institution: institution.trim(),
                    subject: subject.trim() || undefined,
                    status,
                });
                showSnackbar("Turma atualizada com sucesso", "success");
            } else {
                console.log("Creating class with data:", { name, institution, subject, status });
                const newClass = await createClass({
                    name: name.trim(),
                    institution: institution.trim(),
                    subject: subject.trim() || undefined,
                    status,
                });
                console.log("Class created:", newClass);
                showSnackbar("Turma criada com sucesso", "success");
                navigation.replace("ClassStack", { classId: newClass.id } as any);
                return;
            }
            navigation.goBack();
        } catch (error: any) {
            console.error("Submit error:", error);
            const message = error?.response?.data?.message || error?.message || "Não foi possível salvar a turma";
            Alert.alert("Erro", message); // Using Alert to ensure user sees it
            showSnackbar(message, "error");
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Header title={isEditing ? "Editar Turma" : "Nova Turma"} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View>
                    <Input
                        label="Nome da Turma *"
                        value={name}
                        onChangeText={(value) => handleAndRemoveError(value, "name", setName)}
                        placeholder="Ex: Matemática Avançada"
                        errorStr={errors.name}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Instituição *"
                        value={institution}
                        onChangeText={(value) => handleAndRemoveError(value, "institution", setInstitution)}
                        placeholder="Ex: Colégio São Paulo"
                        errorStr={errors.institution}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Disciplina (opcional)"
                        value={subject}
                        onChangeText={setSubject}
                        placeholder="Ex: Matemática"
                        autoCapitalize="words"
                    />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Status da Turma</Text>
                        <SegmentedButtons
                            value={status}
                            onValueChange={setStatus}
                            density="small"
                            theme={{
                                colors: {
                                    secondaryContainer: COLORS.primary,
                                    onSecondaryContainer: "white",
                                    outline: COLORS.text.light,
                                },
                            }}
                            buttons={[
                                {
                                    value: "Ativo",
                                    label: "Ativa",
                                    icon: status === "Ativo" ? "check" : undefined,
                                },
                                {
                                    value: "Arquivado",
                                    label: "Arquivada",
                                    icon: status === "Arquivado" ? "check" : undefined,
                                },
                            ]}
                        />
                    </View>
                </View>

                {!isEditing && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>ℹ️ Sobre a turma</Text>
                        <Text style={styles.infoText}>• Você será o professor desta turma</Text>
                        <Text style={styles.infoText}>• Poderá adicionar alunos por email ou link de convite</Text>
                        <Text style={styles.infoText}>• Poderá criar aulas e receber feedbacks</Text>
                    </View>
                )}
                <CustomButton
                    title={isEditing ? "Salvar Alterações" : "Criar Turma"}
                    onPress={handleSubmit}
                    loading={loading}
                    size="medium"
                    fullWidth
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    section: {
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    infoBox: {
        backgroundColor: COLORS.primary + "10",
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        marginBottom: SPACING.lg,
    },
    infoTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xs,
    },
});
