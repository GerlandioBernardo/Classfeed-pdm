import React, { useState } from "react";
import * as lessonService from "../../services/lessonService";
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Pressable,
    Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../types";
import { COLORS, SPACING } from "../../constants";
import { Feather, Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<HomeStackParamList, "CreateLesson">;

export function CreateLessonScreen({ route, navigation }: Props) {
    const location = route.params?.location;

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [focusedField, setFocusedField] = useState<
        "name" | "date" | "time" | null
    >(null);

    function handleOpenMap() {
        navigation.navigate("SelectLessonLocation", {
            location,
            classId: route.params.classId,
        });
    }


    function isValidDate(date: string) {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return regex.test(date);
    }
    function isValidTime(time: string) {
        const regex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    }


    // chama o backend aqui
    async function handleCreateLesson() {
        if (!name.trim()) {
            Alert.alert("Erro", "Informe o nome da aula");
            return;
        }

        if (!isValidDate(date)) {
            Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA");
            return;
        }

        if (!isValidTime(time)) {
            Alert.alert("Erro", "Horário inválido. Use HH:mm");
            return;
        }
        // Location is optional in types, but checked here.
        // if (!location) { ... } 
        // Keeping existing validation if desired, or making it optional.
        // The type has location?: ...
        // If the user wants location to be mandatory according to previous code:
        if (!location) {
            Alert.alert("Erro", "Selecione a localização");
            return;
        }

        const [day, month, year] = date.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);

        const lessonData = {
            name,
            date: dateObj,
            time,
            location
        };

        try {
            await lessonService.createLesson(route.params.classId, lessonData);
            Alert.alert('Sucesso', 'Aula criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível criar a aula.");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.arrow}>
                <Pressable >
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={COLORS.text.secondary}
                    />
                </Pressable>

            </View>
            <Text style={styles.title}>Criar Aula</Text>
            <Text style={styles.label}>Nome</Text>

            <View style={[styles.inputContainer, focusedField === "name" && styles.inputFocused]}>
                <Feather name="book" size={20}
                    color={
                        focusedField === "name"
                            ? COLORS.primary
                            : COLORS.text.secondary
                    } />

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome da aula"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                />
            </View>

            <Text style={styles.label}>Data</Text>

            <View style={[styles.inputContainer,
            focusedField === "date" && styles.inputFocused
            ]}>
                <Feather name="calendar" size={20} color={
                    focusedField === "date"
                        ? COLORS.primary
                        : COLORS.text.secondary
                } />

                <TextInput
                    style={styles.input}
                    placeholder="Digite a data da aula"
                    value={date}
                    onChangeText={setDate}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                />
            </View>


            <Text style={styles.label}>Horário</Text>

            <View style={[styles.inputContainer, focusedField === "time" && styles.inputFocused]}>
                <Feather name="clock" size={20} color={
                    focusedField === "time"
                        ? COLORS.primary
                        : COLORS.text.secondary
                } />

                <TextInput
                    style={styles.input}
                    placeholder="Digite o horário da aula"
                    value={time}
                    onChangeText={setTime}
                    onFocus={() => setFocusedField("time")}
                    onBlur={() => setFocusedField(null)}
                />
            </View>

            <Text style={styles.label}>Localização</Text>

            <TouchableOpacity activeOpacity={0.9} onPress={handleOpenMap}>
                <MapView
                    pointerEvents="none"
                    style={styles.smallMap}
                    initialRegion={{
                        latitude: location?.latitude ?? -23.55052,
                        longitude: location?.longitude ?? -46.633308,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {location && <Marker coordinate={location} />}
                </MapView>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateLesson}
            >
                <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: SPACING.lg,
        marginTop: 15,
    },
    arrow: {
        marginTop: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xs,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        borderWidth: 1,
        borderColor: "#71717B",
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.md,
    },

    input: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: 14,
        color: COLORS.text.primary,
    },
    inputFocused: {
        borderColor: COLORS.primary,
    },
    smallMap: {
        width: "100%",
        height: 140,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: SPACING.lg,
    },

    button: {
        height: 52,
        borderRadius: 26,
        backgroundColor: "#00C950",
        alignItems: "center",
        justifyContent: "center",
        marginTop: SPACING.lg,
    },

    buttonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: "600",
    },
});
