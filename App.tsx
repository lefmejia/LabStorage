import { StatusBar } from 'expo-status-bar';
import { supabase } from "./src/services/supbaseClient";
import * as DocumentPicker from 'expo-document-picker';
import { Alert, StyleSheet, Text, View } from 'react-native';
import FileUploader from './src/components/FileUploader';
import { useState } from 'react';
import CustomButton from './src/components/CustomButton';

export default function App() {
  const [fileInfo, setFileInfo] = useState<FormData|null>(null);
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

        setFileName(file.name);

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType ?? 'application/octet-stream',
        } as any);

        setFileInfo(formData);

      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const uploadDocument = async () => {
    if(fileName!=="Seleccionar archivo..." && fileInfo)
    {
      const { data, error } = await supabase.storage.from('almacenamientoapp').upload(fileName, fileInfo)
      if (error) {
          Alert.alert(error.message);
      } else {
          Alert.alert("Documento subido con exito. Id: ", data.id);
      }
      setFileInfo(null);
      setFileName("Seleccionar archivo...");
    }
    else
    {
      Alert.alert("Por favor seleccionar archivo para subir");
    }
  };

  return (
    <View style={styles.container}>
      <CustomButton title={fileName} onPress={pickDocument}/>
      <CustomButton title={"Subir documento"} onPress={uploadDocument}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
