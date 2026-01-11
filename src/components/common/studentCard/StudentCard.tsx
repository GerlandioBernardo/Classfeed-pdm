import {View, Text,TouchableOpacityProps, TouchableOpacity, Image} from 'react-native';
import {Feather} from "@expo/vector-icons";
import {ICON_SIZES} from "../../../constants/index";
import {styles} from './styles';

interface StudentCardProps extends TouchableOpacityProps {
    imageURL: string,
    name: string
    onDelete: () => void;
}

export function StudentCard({imageURL, name, onDelete}: StudentCardProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9}>

        <View style={styles.left}>
            <Image source={{uri: imageURL}} style={styles.avatar}/>
            <Text style={styles.name}>{name} </Text>
        </View>

         <TouchableOpacity style={styles.icon} activeOpacity={0.7} onPress={onDelete}>
            <Feather name='trash-2' size={ICON_SIZES.md} color="#FF3D3D"/>
        </TouchableOpacity>

    </TouchableOpacity>
  )
}
