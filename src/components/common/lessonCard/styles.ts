import {StyleSheet} from "react-native";
import {COLORS, FONT_SIZES, SHADOWS, 
    BORDER_RADIUS, SPACING} from "../../../constants/index";

export const styles = StyleSheet.create({
    container:{
        backgroundColor: "#FBFDFF",
        ...SHADOWS.sm,
        width: 400,
        height: 80,
        borderRadius: BORDER_RADIUS.lg,
        gap: SPACING.lg,
        paddingHorizontal: 20,
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#D4D4D4"
    },
    title:{
        fontSize: FONT_SIZES.xl,
        fontWeight: "bold",
        color: COLORS.text.primary
    },
    date:{
        fontSize: 13,
        fontWeight: "light",
        color: COLORS.text.primary
    }
})
