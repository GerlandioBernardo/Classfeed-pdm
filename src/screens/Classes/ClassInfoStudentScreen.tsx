import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ClassStackParamList } from "../../types";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

type Props = NativeStackScreenProps<ClassStackParamList, "ClassInfoStudent">;

type Location = {
    latitude: number;
    longitude: number;
};

export default function ClassInfoStudentScreen({ route, navigation }: Props) {
    const { classId } = route.params;

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        loadClass();
    }, [classId]);

    // chamar o backend aqui ou o contexto
    function loadClass() {
        // exemplo
        setTitle("Introdução à DevOps");
        setDate("26 de novembro de 2025");
        setTime("15:30");
        setLocation({
            latitude: -23.55052,
            longitude: -46.633308,
        });
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

                <TouchableOpacity style={styles.button} activeOpacity={0.8}>
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
