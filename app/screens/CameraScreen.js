import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList, ToastAndroid } from 'react-native';
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from 'rn-fetch-blob';



const CameraScreen = ({ navigation }) => {

    const fallbackImage = require("../android/app/src/assets/images.jpeg");

    const [imageUri, setImageUri] = useState('');
    const [plantData, setPlantData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        consultPlantByName();
    }, []);

    function imagePickerCallback(data) {
        if (data.didCancel) {
            console.log('ENVIO CANCELADO');
            ToastAndroid.show('Envio Cancelado', ToastAndroid.SHORT);
            return;
        }
        if (data.error) {
            console.log('ERRO:', response.error);
            ToastAndroid.show('Ocorreu um erro, tente novamente', ToastAndroid.SHORT);
            return;
        }

        setImageUri(data.assets[0].uri);
        console.log('URI DA IMAGEM', data.assets[0].uri);
    }

    const identifyPlant = async () => {
        setLoading(true);
        console.log('ENVIO INICIADO');
        ToastAndroid.show('Enviando imagem', ToastAndroid.SHORT);

        const formData = new FormData();
        const uri = imageUri;
        const imageBlob = await RNFetchBlob.fs.readFile(uri, 'base64');
        const filename = uri.split('/').pop();
        formData.append('organs', 'auto');
        formData.append('images', {
            uri: `data:image/jpeg;base64,${imageBlob}`,
            type: 'image/jpeg',
            name: filename,
        });

        try {
            console.log('INICIO DO ENVIO');
            const apikey = '2b10872BcGty3dTu0dD9n05QPu';
            const lang = 'en';

            const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?include-related-images=true&no-reject=false&type=kt&lang=${lang}&api-key=${apikey}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('RECEBENDO DADOS');
            ToastAndroid.show('Recebendo dados', ToastAndroid.SHORT);
            const responseData = await response.json();

            // const jsonObj = {};
            // for (let i = 0; i < 6; i++) {
            //     const chave = `chave${i + 1}`;
            //     const valor = {
            //         'Nome' : responseData.results[i].species.scientificNameWithoutAuthor,
            //         'Score' : responseData.results[i].score
            //     }
                
            //     jsonObj[chave] = valor;
            // }
            
            // setPlantData(jsonObj);
            // console.log('RESULT', jsonObj);

            setPlantData(responseData.results);
            console.log('RESULT', responseData.results);
            setLoading(false);

            //consultPlantByName(responseData);
        } catch (error) {
            console.error('ERROR:', error);
            ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
            setLoading(false);
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

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.species.scientificNameWithoutAuthor}</Text>
            </View>
        );
    };

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
                style={styles.image}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => identifyPlant()} >
                <Text style={styles.buttonText}>Identificar Planta</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loading} />
            ) : (
                <>{plantData !== {} ? (
                    <View>
                        <Text>Resultado da API:</Text>
                        {/* <Text>{JSON.stringify(plantData)}</Text> */}

                        <FlatList
                            data={plantData}
                            renderItem={renderItem}
                            // keyExtractor={(item) => item.gbif.id}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                    ) : (
                        <Text>Nenhum dado disponível.</Text>
                    )
                }</>
            )}
            
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
    image: {
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
    loading: {
        alignItems: "center",
        justifyContent: "center",
    },


    
    listContainer: {
        paddingVertical: 10,
    },
    itemContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
    },
    itemText: {
        fontSize: 16,
    },
});

export default CameraScreen;
