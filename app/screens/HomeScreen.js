import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ToastAndroid, TextBase } from 'react-native';

import FolhaIcon from '../components/FolhaIcon';
import * as ImagePicker from "react-native-image-picker";

const Home = ({ navigation }) => {

   const backgroundImage = require('../assets/images/home_background.jpg');

   const [imageUri, setImageUri] = useState(null);
   const handleGetPhoto = () => {
      ImagePicker.launchCamera(
         {
            mediaType: "photo",
            saveToPhotos: true,
         },
         (response) => {
            if (response.didCancel) {
               console.log("ENVIO CANCELADO");
               ToastAndroid.show("Envio Cancelado", ToastAndroid.SHORT);
            } else if (response.error) {
               console.log("ERRO:", response.error);
               ToastAndroid.show("Ocorreu um erro, tente novamente", ToastAndroid.SHORT);
            } else {
               console.log("FOTO TIRADA", response.assets[0].uri);
               ToastAndroid.show("FOTO TIRADA", ToastAndroid.SHORT);
               setImageUri(response.assets[0].uri);
            }
         }
      );
   };


   return (
      <View style={styles.container}>
         <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={styles.transparentBox}>

               <Text style={styles.title}>FolhaVerde</Text>

               <TouchableOpacity
                  onPress={handleGetPhoto}
                  style={styles.button}
               >
                  <FolhaIcon name="camera" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Identificar Planta</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={() => navigation.navigate('Dicas')}
                  style={styles.button}
               >
                  <FolhaIcon name="leaf" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cuidados Por Espécie</Text>
               </TouchableOpacity>


               {imageUri ? (
                  <View>
                     <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
                 </View>
               ) : null}

            </View>
         </ImageBackground>
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
