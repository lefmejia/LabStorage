import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../services/supbaseClient";
import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";

type FileUploaderProps = {
    title: string;
}


export default function FileUploader({title}: FileUploaderProps) {
    const [fileInfo, setFileInfo] = useState<DocumentPicker.DocumentPickerAsset|null>(null);
    const [fileName, setFileName] = useState("Seleccionar archivo...")
    

    const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // all files
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        console.log(file.name);
        setFileInfo({
          name: file.name,
          uri: file.uri,
          lastModified: Date.now(),
        });
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType ?? 'application/octet-stream',
        } as any);
        const { data, error } = await supabase.storage.from('almacenamientoapp').upload(file.name, formData)
        if (error) {
            console.log("Hubo un error al subir el archivo: ", error.message)
        } else {
            console.log(`Documento ${data.id} subido`)
        }
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  return (
  <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText} > {title} </Text>
  </TouchableOpacity>);
}

const styles = StyleSheet.create({
    button:{
        borderRadius: 6,
        backgroundColor: 'navy',
        padding:12,
        width: 150,
    },
    buttonText:{
        color:'#fff'
    }
})