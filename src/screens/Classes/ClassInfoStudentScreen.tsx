import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ClassStackParamList, HomeStackParamList } from "../../types"; // Added HomeStackParamList
import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import * as lessonService from "../../services/lessonService";

type Props = NativeStackScreenProps<HomeStackParamList, "ClassInfoStudent">; // Changed ClassStackParamList to HomeStackParamList

type Location = {
    latitude: number;
    longitude: number;
};

export default function ClassInfoStudentScreen({ route, navigation }: Props) {
    const { classId, lessonId } = route.params;

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        loadClass();
    }, [classId, lessonId]);

    async function loadClass() {
        try {
            const lesson = await lessonService.getLessonById(classId, lessonId);
            setTitle(lesson.title);
            const lessonDate = new Date(lesson.dateTime);
            setDate(lessonDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
            setTime(lessonDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            if (lesson.location) {
                setLocation(lesson.location);
            }
        } catch (error) {
            console.error(error);
            // Alert or Snackbar could be added here
        }
    }

    function handleFeedback() {
        // Navigate to Feedback screen
        // "Feedback" is in ClassTabParamList, so we might need to navigate to the 'Feedback' route in the TabNavigator if reachable.
        // Assuming "Feedback" screen is registered as "Feedback".
        navigation.navigate("StudentFeedback", { classId, lessonId }); // Changed "Feedback" to "StudentFeedback"
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

                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleFeedback}>
                    <Feather
                        name="message-square"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.buttonText}>
                        Cadastrar Feedback
                    </Text>
                </TouchableOpacity>
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

    button: {
        backgroundColor: "#70689D",
        height: 64,
        paddingVertical: SPACING.md,
        borderRadius: 80,
        paddingLeft: 15,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        marginTop: SPACING.lg,
    },

    buttonText: {
        color: COLORS.surface,
        fontSize: FONT_SIZES.md,
        fontWeight: "600",
    },
});
