import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [image, setImage] = useState(null);
  const [processed, setProcessed] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ base64: false });
    if (!result.cancelled) {
      setImage(result.uri);
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });

      const response = await fetch('http://10.0.2.2:5000/enhance', {  // Use local IP or your server IP here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      const json = await response.json();
      setProcessed(`data:image/png;base64,${json.image}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Take Photo & Enhance" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {processed && <Image source={{ uri: processed }} style={{ width: 200, height: 200, marginTop: 10 }} />}
    </View>
  );
}
