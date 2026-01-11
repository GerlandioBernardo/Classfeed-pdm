import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClassTabParamList, Class, User } from "../../types";
import { useClasses } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../../constants";
import { Avatar, FAB } from "react-native-paper";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<ClassTabParamList, "Students">;

export default function ClassStudentsScreen({ route }: Props) {
    const { classId } = route.params;
    const { user } = useAuth();
    const { getClassById, refreshing, refreshClasses } = useClasses();
    const { showSnackbar } = useSnackbar();
    const [classData, setClassData] = useState<Class | null>(null);
    const [students, setStudents] = useState<User[]>([]);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [studentEmail, setStudentEmail] = useState("");

    const navigation = useNavigation();

    const isProfessor = classData?.teacherId === user?.id;

    useEffect(() => {
        loadData();
    }, [classId]);

    function loadData() {
        const classResponse = getClassById(classId);

        if (!classResponse) {
            showSnackbar("Erro ao carregar a turma", "error");
            navigation.goBack();
            return;
        }

        setClassData(classResponse);

        // TO-do: substituir dados mockados por dados reais da API
        setStudents([
            {
                id: "1",
                name: "João Silva",
                email: "joao@gmail.com",
                profilePicture: "https://i.pravatar.cc/150?img=1",
                birthdate: new Date("2000-01-01"),
            },
        ]);
        // setStudents(classResponse.students);
    }

    async function onRefresh() {
        await refreshClasses();
        loadData();
    }

    function handleAddStudent() {
        if (!studentEmail.trim()) {
            Alert.alert("Erro", "Digite o email do aluno");
            return;
        }

        // TO-DO: implementar adição de aluno
        Alert.alert("Em breve", "Funcionalidade de adicionar aluno será implementada");
        setStudentEmail("");
        setShowAddStudent(false);
    }

    function handleRemoveStudent(student: User) {
        Alert.alert("Remover Aluno", `Tem certeza que deseja remover ${student.name} da turma?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: () => {
                    // TO-DO: implementar remoção de aluno
                    Alert.alert("Em breve", "Funcionalidade de remover aluno será implementada");
                },
            },
        ]);
    }

    function handleShareInvite() {
        Alert.alert("Em breve", "Funcionalidade de compartilhar convite será implementada");
    }

    function renderStudentCard({ item }: { item: User }) {
        return (
            <View style={styles.studentCard}>
                <Avatar.Image size={48} source={{ uri: item.profilePicture }} />
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
                {isProfessor && (
                    <TouchableOpacity onPress={() => handleRemoveStudent(item)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Remover</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showAddStudent && isProfessor && (
                <View style={styles.addStudentForm}>
                    <Text style={styles.formLabel}>Email do aluno:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="aluno@email.com"
                        placeholderTextColor={COLORS.text.light}
                        value={studentEmail}
                        onChangeText={setStudentEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.formButtons}>
                        <TouchableOpacity style={styles.formAddButton} onPress={handleAddStudent}>
                            <Text style={styles.formAddButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.formCancelButton}
                            onPress={() => {
                                setShowAddStudent(false);
                                setStudentEmail("");
                            }}
                        >
                            <Text style={styles.formCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={students}
                renderItem={renderStudentCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>👥</Text>
                        <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
                        <Text style={styles.emptySubtext}>
                            {isProfessor
                                ? "Adicione alunos usando o botão + ou compartilhe o link de convite"
                                : "Aguarde o professor adicionar alunos à turma"}
                        </Text>
                    </View>
                }
            />

            {isProfessor && (
                <>
                    <FAB
                        icon="account-plus"
                        style={[styles.fab, styles.fabAdd]}
                        color={COLORS.surface}
                        onPress={() => setShowAddStudent(true)}
                        label="Adicionar"
                    />
                    <FAB
                        icon="share-variant"
                        style={[styles.fab, styles.fabShare]}
                        color={COLORS.surface}
                        onPress={handleShareInvite}
                        label="Convite"
                    />
                </>
            )}
        </View>
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
    addStudentForm: {
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    formLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
    formButtons: {
        flexDirection: "row",
        gap: SPACING.sm,
    },
    formAddButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: "center",
    },
    formAddButtonText: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
    },
    formCancelButton: {
        flex: 1,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    formCancelButtonText: {
        color: COLORS.text.primary,
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
    },
    listContent: {
        padding: SPACING.lg,
    },
    studentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
    },
    studentInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    studentName: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    studentEmail: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    removeButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    removeButtonText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: "600",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SPACING.xxl * 2,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.sm,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        textAlign: "center",
        paddingHorizontal: SPACING.xl,
    },
    fab: {
        position: "absolute",
        backgroundColor: COLORS.primary,
    },
    fabAdd: {
        right: SPACING.lg,
        bottom: SPACING.lg + 70,
    },
    fabShare: {
        right: SPACING.lg,
        bottom: SPACING.lg,
    },
});
