import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from 'rn-fetch-blob';

import PrintPlantName from "../components/printPlantName";


const CameraScreen = ({  }) => {
    const fallbackImage = require("../android/app/src/assets/images.jpeg");

    const [bookCover, setBookCover] = useState('');
    const [nomeDaPlanta, setNomeDaPlanta] = useState('');
    // const [resultados, setResultados] = useState([]);
    
    function imagePickerCallback(data) {
        if (data.didCancel) {
            console.log('Cancelado');
            return;
        }
        if (data.error) {
            console.log('Erro:', response.error);
            return;
        }

        setBookCover(data.assets[0].uri);
        console.log(bookCover);
    }


    const identifyPlant = async () => {

        console.log('ENVIO INICIADO');

        const formData = new FormData();
        formData.append('organs', 'auto');
        const uri = bookCover;
        const imageBlob = await RNFetchBlob.fs.readFile(uri, 'base64');
        const filename = uri.split('/').pop();

        formData.append('images', {
            uri: `data:image/jpeg;base64,${imageBlob}`,
            type: 'image/jpeg',
            name: filename,
        });

        try {
            console.log('INICIO DO ENVIO');

            const response = await fetch('https://my-api.plantnet.org/v2/identify/all?api-key=2b10872BcGty3dTu0dD9n05QPu', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('RECEBENDO DADOS');

            const responseData = await response.json();
            //console.log('Resposta:', responseData.bestMatch);
            //console.log('Resposta2:', responseData.results[0].species.scientificNameWithoutAuthor);

            setNomeDaPlanta(responseData.results[0].species.scientificNameWithoutAuthor);
            // console.log('RESULTS PRIMEIRA POSICAO', responseData.results[0].species.scientificNameWithoutAuthor);
            // console.log('RESULTS SEGUNDA POSICAO', responseData.results[1].species.scientificNameWithoutAuthor);
            // console.log('RESULTS TERCEIRA POSICAO', responseData.results[2].species.scientificNameWithoutAuthor);
            // console.log('BEST MATCH', responseData.bestMatch);
            // console.log('RESULTS', responseData.results);


            const jsonObj = {};

            for (let i = 0; i < 6; i++) {
                
                const chave = `chave${i + 1}`;
                const valor = {
                    'Nome' : responseData.results[i].species.scientificNameWithoutAuthor,
                    'Score' : responseData.results[i].score
                }
                
                jsonObj[chave] = valor;

            }
            console.log('JSON BRABO', jsonObj);

            consultPlantByName(responseData);
        } catch (error) {
            console.error('Erro:', error);
        }

    };

    async function consultPlantByName(returnDaApi) {
        try {
            //console.log('NOME DA PLANTA 2', nomeDaPlanta);

            //await axios.get(`https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${nomeDaPlanta}`).then((response) => {


                //const pages = Object.values(response.data.query.pages);
                //console.log('DESCRIÇÃO', pages[0].extract);

                // console.log(response);
                //console.log('CHEGOU AQUI');
           //})

            console.log('NOME DA PLANTA 2', returnDaApi.results[0].species.scientificNameWithoutAuthor);

            let nomeDaPlantaNormatizado = returnDaApi.results[0].species.scientificNameWithoutAuthor;

            await axios.get(`https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${nomeDaPlantaNormatizado}`).then((response) => {

                const pages = Object.values(response.data.query.pages);
                console.log('RESPOSTA WIKI', pages);
            });

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => ImagePicker.launchCamera({
                    mediaType: "photo",
                    saveToPhotos: true,
                }, imagePickerCallback)}>
                <Text style={styles.buttonText}>Tirar Foto</Text>
            </TouchableOpacity>


            <Image
                source={bookCover ? { uri: bookCover } : fallbackImage}
                style={styles.bookCoverImg}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => identifyPlant()} >
                <Text style={styles.buttonText}>Enviar Imagem</Text>
            </TouchableOpacity>

            
            <PrintPlantName nome={nomeDaPlanta} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 16,
        paddingVertical: 8,
    },
    bookCoverImg: {
        width: 280,
        height: 280,
        alignSelf: "center",
    },
    button: {
        alignItems: "center",
        backgroundColor: "green",
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        minWidth: 150,
        height: 50,
        borderRadius: 50,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 10
    },
    buttonText: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

  
export default CameraScreen;
