import { StatusBar } from 'expo-status-bar';
import { supabase } from "./src/services/supbaseClient";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import CustomButton from './src/components/CustomButton';

export default function App() {
  const [fileInfo, setFileInfo] = useState<FormData|null>(null);
  const [fileName, setFileName] = useState("Seleccionar archivo...");
  const [imageName, setImageName] = useState("Seleccionar imagen...");
  const [image, setImage] = useState<FormData | null>(null);
  

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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const image = result.assets[0];
      const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          name: image.fileName,
          type: image.mimeType ?? 'application/octet-stream',
        } as any);
      setImage(formData);
      setImageName(image.fileName!);
    }
  };

  const uploadDocument = async () => {
    if(fileName!=="Seleccionar archivo..." && fileInfo)
    {
      const { data, error } = await supabase.storage.from('almacenamientoapp').upload(fileName, fileInfo);
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
      Alert.alert("Por favor seleccionar imagen y archivo para subir");
      return;
    }

    if(image && imageName!=="Seleccionar imagen...")
    {
      const { data, error } = await supabase.storage.from('almacenamientoapp').upload(imageName, image);
      if (error) {
        console.log(error.message);
      } else {
        console.log("Documento subido con exito. Id: ", data.id);
      }
      setImage(null);
      setImageName("Seleccionar imagen...");
    }
    else
    {
      Alert.alert("Por favor seleccionar imagen y archivo para subir");
      return;
    }
    
  };

  return (
    <View style={styles.container}>
      <CustomButton title={fileName} onPress={pickDocument}/>
      <CustomButton title={imageName} onPress={pickImage}/>
      <CustomButton title={"Subir documentos"} onPress={uploadDocument}/>
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
