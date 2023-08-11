import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid, ActivityIndicator, FlatList } from 'react-native';
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from 'rn-fetch-blob';

const IdentifyScreen = ({ navigation }) => {
    const fallbackImage = require("../android/app/src/assets/images.jpeg");
    const resultsJson = {};

    const [imageUri, setImageUri] = useState('');
    const [plantData, setPlantData] = useState({});
    const [loading, setLoading] = useState(false);

    const ResultsItem = ({ title, commonNames, family, description, image }) => (
        <View style={styles.result}>
            <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
            />
            <Text style={styles.title}>{ title }</Text>
            <Text>Nome Comum: { commonNames }</Text>
            <Text>Família: { family }</Text>
            <Text style={styles.itemText}>{ description }</Text>
        </View>
    );
    const renderItem = ({ item }) => (
        <Item 
            title={ item.scientificNameWithoutAuthor }
            commonNames={ item.commonNames.join(', ') }
            family={ item.family.scientificName }
            description={ getPlantDescriptionWiki( item.scientificNameWithoutAuthor )} 
            image={ fallbackImage } 
        />
    );

    function imagePickerCallback(data) {
        if (data.didCancel) {
            console.log('Cancelado');
            ToastAndroid.show('Cancelado', ToastAndroid.SHORT);
            return;
        }
        if (data.error) {
            console.log('Erro:', response.error);
            ToastAndroid.show('Ocorreu um erro, tente novamente', ToastAndroid.SHORT);
            return;
        }

        setImageUri(data.assets[0].uri);
        console.log(imageUri);
    }

    const identifyPlant = async () => {
        console.log('ENVIO INICIADO');
        ToastAndroid.show('ENVIO INICIADO', ToastAndroid.SHORT);

        const formData = new FormData();
        const imageBlob = await RNFetchBlob.fs.readFile(imageUri, 'base64');
        const filename = imageUri.split('/').pop();
        formData.append('organs', 'auto');
        formData.append('images', {
            uri: `data:image/jpeg;base64,${imageBlob}`,
            type: 'image/jpeg',
            name: filename,
        });

        try {
            console.log('INICIO DO ENVIO');
            ToastAndroid.show('INICIO DO ENVIO', ToastAndroid.SHORT);
            setLoading(true);

            const response = await fetch('https://my-api.plantnet.org/v2/identify/all?api-key=2b10872BcGty3dTu0dD9n05QPu', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('RECEBENDO DADOS');
            ToastAndroid.show('RECEBENDO DADOS', ToastAndroid.SHORT);
            const responseData = await response.json();
            
            
            for (let i = 0; i < 6; i++) {                
                const key = `result${i + 1}`;
                const value = {
                    'Nome' : responseData.results[i].species.scientificNameWithoutAuthor,
                    'Score' : responseData.results[i].score
                }
                resultsJson[key] = value;
            }
            console.log('RESULTS', resultsJson);
            setLoading(false);
            setPlantData( resultsJson );
            
        } catch (error) {
            setLoading(false); 
            console.error('ERROR:', error);
            ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
        }
    }

    async function getPlantDescriptionWiki(returnDaApi) {
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
                source={imageUri ? { uri: imageUri } : fallbackImage}
                style={styles.bookCoverImg}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => identifyPlant()} >
                <Text style={styles.buttonText}>Enviar Imagem</Text>
            </TouchableOpacity>

            
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loading} />
            ) : (
                <>
                    {plantData ? (
                        <View>
                            <Text>Resultado da API:</Text>
                            <Text>{JSON.stringify(plantData)}</Text>
                        </View>
                    ) : (
                        <Text>Nenhum dado disponível.</Text>
                    )}
                </>
            )}


            {/* { !plantData ?
                <View>
                    <Text>Carregando...</Text>
                </View>

                :
                <FlatList
                    data={plantData}
                    renderItem={renderItem}
                    keyExtractor={item => plantData.species}
                />
            } */}
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

export default IdentifyScreen;
