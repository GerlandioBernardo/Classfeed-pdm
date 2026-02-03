import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList, Feedback } from "../../types";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import { useClasses } from "../../contexts/ClassContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as lessonService from "../../services/lessonService";
import * as feedbackService from "../../services/feedbackService";

type Props = NativeStackScreenProps<HomeStackParamList, "ClassInfoTeacher">;

type Location = {
    latitude: number;
    longitude: number;
};

export default function ClassInfoTeacherScreen({ route, navigation }: Props) {
    const { classId, lessonId } = route.params;

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState<Location | null>(null);

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);

    const { refreshClasses } = useClasses();

    useEffect(() => {
        loadData();
    }, [classId, lessonId]);

    async function loadData() {
        setLoading(true);
        try {
            const lesson = await lessonService.getLessonById(classId, lessonId);
            setTitle(lesson.title);
            const lessonDate = new Date(lesson.dateTime);
            setDate(lessonDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
            setTime(lessonDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            if (lesson.location) {
                setLocation(lesson.location);
            }

            const feedbackList = await feedbackService.getFeedbacks(classId, lessonId);
            setFeedbacks(feedbackList);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function onRefresh() {
        await refreshClasses(); // Optional: checks if global refresh needed
        loadData();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.arrow} >
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={COLORS.surface}
                    />
                </Pressable>

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>
                    {date} - {time}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Localização</Text>
                {location && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                    >
                        <Marker coordinate={location} />
                    </MapView>
                )}

                <Text style={styles.titleFeedback}>Feedbacks</Text>

                <FlatList
                    data={feedbacks}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.feedbackItem}
                            onPress={() => navigation.navigate("FeedbackDetail", { feedback: item })}
                        >
                            <Text style={styles.feedbackText}>
                                Feedback (Anon: {item.anonymous ? "Sim" : "Não"})
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="star" size={16} color={COLORS.warning} />
                                <Text style={{ marginLeft: 4, color: COLORS.text.secondary }}>
                                    M:{item.methodology} C:{item.content} E:{item.engagement}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.text.secondary }}>Nenhum feedback recebido.</Text>}
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
        backgroundColor: "#61AC7D",
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        height: 216,
        justifyContent: "center",
        position: "relative",
    },
    arrow: {
        position: "absolute",
        top: 38,
        left: SPACING.lg,
        zIndex: 10,
    },

    title: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
    },

    subtitle: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.sm,
        marginTop: SPACING.xs,
    },

    content: {
        padding: SPACING.lg,
        gap: SPACING.md,
        flex: 1
    },

    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: "600",
        color: COLORS.text.primary,
    },

    map: {
        height: 130,
        borderRadius: 12,
        overflow: "hidden",
    },
    titleFeedback: {
        color: COLORS.text.primary,
        fontSize: FONT_SIZES.xl,
        marginTop: SPACING.lg,
    },
    list: {
        gap: SPACING.md,
    },
    feedbackItem: {
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E4E4E7",
    },
    feedbackText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        fontWeight: "500",
        marginBottom: 4,
    }
});
