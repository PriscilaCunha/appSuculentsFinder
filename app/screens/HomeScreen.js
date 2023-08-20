import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FolhaIcon from '../components/FolhaIcon';
import * as ImagePicker from "react-native-image-picker";

const Home = () => {
    const navigation = useNavigation();

    const backgroundImage = require('../assets/images/home_background.jpg');

    const handleGetPhoto = () => {
        ImagePicker.launchCamera(
            {
                mediaType: "photo",
                saveToPhotos: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("ENVIO CANCELADO PELO USUARIO");
                } else if (response.error) {
                    console.log("ERRO: ", response.error);
                    ToastAndroid.show("Ocorreu um erro, tente novamente", ToastAndroid.SHORT);
                } else {
                    console.log("FOTO TIRADA: ", response.assets[0].uri);
                    navigation.navigate('Identificar', { imageUri: response.assets[0].uri });
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
                        onPress={() => navigation.navigate('Busca por Espécie')}
                        style={styles.button}
                    >
                        <FolhaIcon name="leaf" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Cuidados Por Espécie</Text>
                    </TouchableOpacity>

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
