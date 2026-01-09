import api from "./api";
import { UpdateProfileData, User } from "../types";
import { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

export async function updateProfilePicture(image: ImagePickerAsset): Promise<User> {
    const formData = new FormData();

    formData.append("image", {
        uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
        name: image.fileName,
        type: image.mimeType ?? "image/jpeg",
    } as any);

    const response = await api.patch("/user/profilePicture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response.status !== 200) {
        throw new Error("Failed to upload image");
    }

    return response.data;
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
    const { name, email } = data;
    const response = await api.patch("/user", { name, email });
    return response.data;
}

export async function deleteAccount(): Promise<void> {
    await api.delete("/user");
}

export async function updatePassword(currentPassword: String, newPassword: String): Promise<void> {
    await api.patch("/user/updatePassword", { currentPassword, newPassword });
}
