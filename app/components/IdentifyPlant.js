import React, { useState, useEffect } from "react";
import { View, Image, Text } from 'react-native';
import axios from "axios";

const IdentifyPlant = () => {

    const [plantData, setPlantData] = useState({});

    useEffect(() => {
        const apiUrl = 'https://my-api.plantnet.org/v2/identify';
        const imageUri = '../android/app/src/assets/images.jpeg';
        const requestData = {
            apikey: '2b10872BcGty3dTu0dD9n05QPu',
            images: [imageUri],
            organs: ['leaf'],
            lang: 'pt-BR',
        };

        axios.post(apiUrl, requestData)
            .then(response => {
                const plantResult = response.data.results[0];
                setPlantData(plantResult);
            })
            .catch(error => {
                console.error('Erro ao fazer a solicitação:', error);
            });
    }, []);

    if (!plantData) {
        return (
            <View>
                <Text>Carregando...</Text>
            </View>
        );
    }
    

    return (
        <View>
            <Text>Nome Científico: {plantData.species.scientificNameWithoutAuthor}</Text>
            <Text>Nome Comum: {plantData.species.commonNames.join(', ')}</Text>
            <Text>Família: {plantData.species.family.scientificName}</Text>
            <Image
                source={{ uri: plantData.images[0].url }}
                style={{ width: 200, height: 200 }}
            />
        </View>
    );
};

export default IdentifyPlant;