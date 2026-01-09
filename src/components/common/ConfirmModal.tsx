import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
  confirmLoading?: boolean;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  confirmColor = COLORS.primary,
  confirmLoading = false,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button onPress={onCancel}>Cancelar</Button>
            <Button mode="contained" buttonColor={confirmColor} onPress={onConfirm} loading={confirmLoading}>
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: "85%",
  },

  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },

  message: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
});
