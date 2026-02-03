import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList, Feedback } from "../../types";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<HomeStackParamList, "FeedbackDetail">;

export default function ProfessorFeedbackDetailScreen({ route }: Props) {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { feedback } = route.params;

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
            <View>
                <Text style={styles.title}>Feedback</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <RatingRow label="Metodologia" value={feedback.methodology} />
                <RatingRow label="Conteúdo" value={feedback.content} />
                <RatingRow label="Engajamento" value={feedback.engagement} />

                <View style={styles.commentBox}>
                    <Text style={styles.commentLabel}>Opinião:</Text>
                    <Text style={styles.commentText}>
                        {feedback.comment || "Sem comentário"}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
type RatingRowProps = {
    label: string;
    value: number;
};

function RatingRow({ label, value }: RatingRowProps) {
    return (
        <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{label}:</Text>

            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= value ? "star" : "star-outline"}
                        size={22}
                        color={COLORS.warning}
                        style={{ marginRight: 6 }}
                    />
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
    arrow: {
        marginTop: 15,
        marginLeft: 10,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        color: COLORS.text.primary,
        paddingTop: SPACING.lg,
    },
    content: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },

    ratingRow: {
        marginBottom: SPACING.md,
    },

    ratingLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },

    starsRow: {
        flexDirection: "row",
    },

    commentBox: {
        marginTop: SPACING.sm,
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
    },

    commentLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
        marginBottom: SPACING.xs,
        color: COLORS.text.primary,
    },

    commentText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
        lineHeight: 20,
    },
});
