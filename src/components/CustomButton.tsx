import { Text, TouchableOpacity, StyleSheet } from "react-native";

type CustomButtonProps = {
    title: string;
    onPress: () => void;
}


export default function CustomButton({title, onPress}: CustomButtonProps) {
  return (
  <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText} > {title} </Text>
  </TouchableOpacity>);
}

const styles = StyleSheet.create({
    button:{
        borderRadius: 6,
        backgroundColor: 'navy',
        padding:12,
        width: 250,
        margin:20
    },
    buttonText:{
        color:'#fff'
    }
})