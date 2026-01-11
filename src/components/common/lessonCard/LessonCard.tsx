import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import { ICON_SIZES } from "../../../constants/index"

interface LessonCardProps extends TouchableOpacityProps {
    title: string,
    date: string
}

export function LessonCard({ title, date, ...rest}: LessonCardProps) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9}>
            <View>
                <Feather name="book" size={ICON_SIZES.md} />
            </View>

            <View>
                <View>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                </View>

                <View>
                    <Text style={styles.date}>
                        {date}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    )

}
