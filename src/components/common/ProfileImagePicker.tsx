import { View, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AVATAR_SIZES, COLORS, FONT_SIZES, SPACING } from "../../constants";
import { ImagePickerAsset } from "expo-image-picker";
import { Avatar, Button } from "react-native-paper";

type Props = {
  uri: string;
  loading: boolean;
  disabled?: boolean;
  onChange: (uri: ImagePickerAsset) => void;
};

const Icon = () => <Ionicons name="camera" size={24} color={COLORS.primary} />;

export function ProfileImagePicker({ uri, loading, disabled, onChange }: Props) {
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  }

  return (
    <View style={[styles.avatarContainer]}>
      <Avatar.Image size={AVATAR_SIZES.xxl} source={{ uri }} />

      <Button
        mode="contained"
        icon={Icon}
        onPress={pickImage}
        loading={loading}
        labelStyle={{ fontSize: FONT_SIZES.sm }}
        textColor={COLORS.primary}
        disabled={disabled ? true : false}
        contentStyle={styles.editBadge}
      >
        Alterar foto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
    display: "flex",
    gap: SPACING.sm,
  },

  editBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  editBadgeText: {
    color: COLORS.primary,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});
