import { StyleSheet } from "react-native";
import {COLORS } from "../../../constants/index";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        width: 360,
        height: 76,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#AEAEAE"
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 64,
    },
    name: {
        fontSize: 22,
        color: COLORS.text.primary
    },
    icon:{
        marginRight: 10,
    }
})
