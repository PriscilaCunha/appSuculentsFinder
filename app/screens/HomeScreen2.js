import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from "react-native-image-picker";


// import { createIconSetFromFontello } from 'react-native-vector-icons';
// import fontelloConfig from '../assets/icons/folhaverde';
// const IconFont = createIconSetFromFontello(fontelloConfig);


const Home = ({ navigation }) => {
  // const BackgroundImage = require('../assets/images/home_background.jpg');

  const [imageUri, setImageUri] = useState('');
  const handleImagePicker = () => {
    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        saveToPhotos: true
      }, response => {
        if (response.didCancel) {
          console.log('ENVIO CANCELADO');
          ToastAndroid.show('Envio Cancelado', ToastAndroid.SHORT);
        } else if (response.error) {
          console.log('ERRO:', response.error);
          ToastAndroid.show('Ocorreu um erro, tente novamente', ToastAndroid.SHORT);
        } else {
          // setImageData(response.data);
          setImageUri(response.assets[0].uri);
          console.log('URI DA IMAGEM', response.assets[0].uri);

          // navigation.navigate('Results', { image: response.data });
          navigation.navigate('Results', { image: response.assets[0].uri });
        }
      }
    );
  };

  return (
    <View style={styles.container}>a
      {/* <ImageBackground source={BackgroundImage} style={styles.backgroundImage}> */}

      <View style={styles.transparentBox}>
        {/* <Text style={styles.title}>FolhaVerde</Text> */}

        <TouchableOpacity
          style={styles.button}
        // onPress={() => navigation.navigate('Camera')} >
        // onPress={() => ImagePicker.launchCamera({
        //     mediaType: "photo",
        //     saveToPhotos: true,
        // }, imagePickerCallback)}>
        // onPress={handleImagePicker} 
        >
          <Icon
            name="camera"
            style={styles.buttonIcon}
          />
          {/* <IconFont name="leaf" size={80} color="#bf1313" /> */}
          <Text style={styles.buttonText}>Identificar Planta</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Dicas')} >
                        <Icon
                            name="bookmark"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>Cuidados Por Espécie</Text>
                    </TouchableOpacity> */}
      </View>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  transparentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",

  },

  title: {
    color: '#14532D',
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 42,
    marginBottom: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 50,
    backgroundColor: "#FFB200",
    borderRadius: 50,
    margin: 10,
  },
  buttonText: {
    color: "#030712",
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  buttonIcon: {
    color: "#030712",
    fontSize: 20,
  }
});

export default Home;
