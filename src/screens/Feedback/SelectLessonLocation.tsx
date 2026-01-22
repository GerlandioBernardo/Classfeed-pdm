import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../types";
import { COLORS, SPACING } from "../../constants";

type Props = NativeStackScreenProps<HomeStackParamList, "SelectLessonLocation">;

type Coords = {
    latitude: number;
    longitude: number;
};

export function SelectLessonLocation({ navigation, route }: Props) {
    const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
    const [markerLocation, setMarkerLocation] = useState<Coords | null>(null);

    async function loadUserLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permissão necessária para acessar localização");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        setCurrentLocation(coords);
        setMarkerLocation(coords);
    }


    function handleMapPress(event: MapPressEvent) {
        setMarkerLocation(event.nativeEvent.coordinate);
    }

    function handleConfirmLocation() {
        if (!markerLocation) return;

        navigation.navigate("CreateLesson", {
            location: markerLocation,
        });
    }

    useEffect(() => {
        loadUserLocation();
    }, []);

    if (!currentLocation) return null;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
                onPress={handleMapPress}
                showsUserLocation
            >
                {markerLocation && (
                    <Marker
                        coordinate={markerLocation}
                        draggable
                        onDragEnd={(e) =>
                            setMarkerLocation(e.nativeEvent.coordinate)
                        }
                    />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmLocation}
            >
                <Text style={styles.confirmText}>Confirmar localização</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    map: {
        flex: 1,
    },
    inputFocused: {
        borderColor: COLORS.primary,
    },

    confirmButton: {
        position: "absolute",
        bottom: SPACING.lg,
        left: SPACING.lg,
        right: SPACING.lg,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.success,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.xl
    },

    confirmText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: "600",
    },
});
