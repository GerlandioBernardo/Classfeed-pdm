import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from "../../constants";
import { FeedbackCriteria } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";



export default function StudentFeedbackScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();

    const [criteria, setCriteria] = useState<FeedbackCriteria>({
        content: 0 as any,
        methodology: 0 as any,
        engagement: 0 as any,
    });

    const [comment, setComment] = useState("");

    function handleSelectRating(
        key: keyof FeedbackCriteria,
        value: number
    ) {
        setCriteria((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function handleSubmit() {
        if (
            !criteria.content ||
            !criteria.methodology ||
            !criteria.engagement
        ) {
            Alert.alert(
                "Atenção", "Avalie todos os critérios antes de enviar."
            );
            return;
        }

        const payload = {
            criteria,
            comment,
        };

        console.log("Feedback enviado:", payload);

        Alert.alert("Obrigado!", "Seu feedback foi enviado com sucesso.");

        setCriteria({
            content: 0 as any,
            methodology: 0 as any,
            engagement: 0 as any,
        });
        setComment("");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>ClassFeed</Text>

                <Avatar.Image
                    size={40}
                    source={{ uri: user?.profilePicture }}
                />
            </View>
            <View style={styles.arrow}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={COLORS.text.secondary}
                    />
                </Pressable>

            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Feedback</Text>

                <RatingRow
                    label="Conteúdo"
                    value={criteria.content}
                    onSelect={(v) => handleSelectRating("content", v)}
                />

                <RatingRow
                    label="Metodologia"
                    value={criteria.methodology}
                    onSelect={(v) => handleSelectRating("methodology", v)}
                />

                <RatingRow
                    label="Engajamento"
                    value={criteria.engagement}
                    onSelect={(v) => handleSelectRating("engagement", v)}
                />

                <Text style={styles.inputLabel}>Opinião:</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    placeholder="Escreva sua opinião..."
                    value={comment}
                    onChangeText={setComment}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.text}>Enviar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

function RatingRow({ label, value, onSelect, }: {
    label: string;
    value: number;
    onSelect: (value: number) => void;
}) {
    return (
        <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{label}:</Text>

            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => onSelect(star)}>
                        <Ionicons
                            name={star <= value ? "star" : "star-outline"}
                            size={26}
                            color={star <= value ? "#FFD700" : "#FEE685"}
                            style={{ marginHorizontal: 8 }}
                        />
                    </Pressable>
                ))}
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    logo: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.text.primary,
    },
    content: {
        padding: SPACING.lg,
    },
    arrow:{
        marginTop: 15,
        marginLeft: 10,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        marginBottom: SPACING.lg,
        color: COLORS.text.primary,
    },
    ratingRow: {
        marginBottom: SPACING.md,
    },
    ratingLabel: {
        fontSize: FONT_SIZES.md,
        marginBottom: SPACING.xs,
        fontWeight: "500",
        color: COLORS.text.primary,
    },
    starsRow: {
        flexDirection: "row",
    },
    starFilled: {
        fontSize: 28,
        color: "#FFC107",
        marginRight: 6,
    },
    starEmpty: {
        fontSize: 28,
        color: COLORS.border,
        marginRight: 6,
    },
    inputLabel: {
        fontSize: FONT_SIZES.md,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
        fontWeight: "500",
        color: COLORS.text.primary,
    },
    textArea: {
        height: 128,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        textAlignVertical: "top",
        ...SHADOWS.sm,
    },
    button: {
        marginTop: SPACING.lg,
        backgroundColor: "#00C853",
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.round,
        alignItems: "center",
    },
    text: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
    },
});
