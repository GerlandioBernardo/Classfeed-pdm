import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, AVATAR_SIZES } from "../../constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackparamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, List } from "react-native-paper";
import { Header } from "../../components/common/Header";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CustomButton } from "../../components/common/CustomButton";

type Props = NativeStackScreenProps<ProfileStackparamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut, deleteAccount } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function toggleDeleteModal() {
    setDeleteModalVisible(!deleteModalVisible);
  }

  function toggleLogoutModal() {
    setLogoutModalVisible(!logoutModalVisible);
  }

  async function handleRemoveAccount() {
    setDeleting(true);
    try {
      await deleteAccount();
      toggleLogoutModal();
      showSnackbar("Conta excluída com sucesso.", "success");
    } catch (error) {
      showSnackbar("Erro ao excluir a conta. Tente novamente mais tarde.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={AVATAR_SIZES.xxl} source={{ uri: user?.profilePicture }} />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <List.Section>
          <List.Subheader>Conta</List.Subheader>

          <List.Item
            title="Editar perfil"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.listItem}
          />

          <List.Item
            title="Alterar senha"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("EditPassword")}
            style={styles.listItem}
          />

          <List.Item
            title="Excluir conta"
            titleStyle={{ color: COLORS.error }}
            left={(props) => <List.Icon {...props} icon="delete" color={COLORS.error} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" color={COLORS.error} />}
            onPress={toggleDeleteModal}
            style={styles.listItem}
          />
        </List.Section>

        <CustomButton
          title="Sair da conta"
          icon={() => <Ionicons name="log-out-outline" size={20} color={COLORS.surface} />}
          style={{ borderRadius: BORDER_RADIUS.xll, marginTop: SPACING.lg }}
          onPress={toggleLogoutModal}
          size="medium"
        />
      </View>

      <ConfirmModal
        visible={logoutModalVisible}
        title="Tem certeza?"
        message="Deseja realmente sair da conta?"
        confirmText="Sair"
        onCancel={toggleLogoutModal}
        onConfirm={signOut}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        title="Excluir conta"
        message="Essa ação é irreversível. Deseja realmente excluir sua conta?"
        confirmText="Excluir"
        confirmColor={COLORS.error}
        onCancel={toggleDeleteModal}
        onConfirm={handleRemoveAccount}
        confirmLoading={deleting}
      />
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

  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.xs,
  },

  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
  },

  userEmail: {
    fontSize: FONT_SIZES.sm,
  },

  listItem: {
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },

  logoutButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },

  logoutText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
});
