import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, Pressable, FlatList, RefreshControl } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {Ionicons } from "@expo/vector-icons";
import { ClassStackParamList } from "../../types";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";
import { StudentCard } from "../../components/common/studentCard/StudentCard";
import { User } from "../../types/index";
import { useClasses } from "../../contexts/ClassContext";

type Props = NativeStackScreenProps<ClassStackParamList, "ClassInfoTeacher">;

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

    const [students, setStudents] = useState<User[]>([]);

    const { refreshing, refreshClasses } = useClasses();

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
            latitude: -7.117853719196769,
            longitude: -34.863812289494724
        });

        setStudents([
            {
                id: "1",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
            {
                id: "2",
                name: "Maria de Souza Pereira",
                email: "maria.souza@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2001-02-02"),
            },
            {
                id: "3",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
            {
                id: "4",
                name: "Maria de Souza Pereira",
                email: "maria.souza@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2001-02-02"),
            },
            {
                id: "5",
                name: "João da Silva Pereira",
                email: "joao.silva@gmail.com",
                profilePicture: "https://i.ibb.co/TxknvgR5/4e90b2cab3ba.png",
                birthdate: new Date("2000-01-01"),
            },
        ]);
    }
    async function onRefresh() {
        await refreshClasses();
        loadClass();
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
                    data={students}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <StudentCard
                            name={item.name}
                            imageURL={item.profilePicture}
                        />
                    )}
                    style={{ flex: 1 }}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
                    showsVerticalScrollIndicator={false}
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
    },
    list: {
        gap: SPACING.md,
    },
});
