import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import FolhaIcon from "./FolhaIcon";
import { useNavigation } from '@react-navigation/native';

const GetSpeciesList = ({ onDataLoaded }) => {
    const [speciesData, setSpeciesData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        // getList();
        getListDummy();
    }, []);

    const getList = async () => {

        try {
            const apikey = '2b10872BcGty3dTu0dD9n05QPu';
            const lang = 'pt';

            console.log('ENVIO INICIADO');

            const response = await fetch(`https://my-api.plantnet.org/v2/species?type=kt&lang=${lang}&api-key=${apikey}`, {
                method: 'GET',
            });

            console.log('RECEBENDO DADOS');

            if (!response.ok) {
                throw new Error('Erro na requisição à API.');
            }
            
            const responseData = await response.json();
            console.log('RESULTADO', responseData);

            setSpeciesData(responseData);
            setLoadingData(false);
            onDataLoaded(responseData, false);

        } catch (error) {
            console.error('ERROR:', error);
            ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);

            setLoadingData(false);
            onDataLoaded(responseData, false);
        }
    }
    
    const getListDummy = () => {
        const dummyData = [
            {
                "commonNames": [],
                "gbifId": 5402146,
                "id": "1521289",
                "iucnCategory": null,
                "powoId": "285053-2",
                "scientificNameAuthorship": "D.M.Spooner",
                "scientificNameWithoutAuthor": "Simsia santarosensis"
            },
            {
                "commonNames": [
                    "Sinapidendro de Folha Estreita"
                ],
                "gbifId": 3047770,
                "id": "1358420",
                "iucnCategory": "CR",
                "powoId": "288938-1",
                "scientificNameAuthorship": "(DC.) Lowe",
                "scientificNameWithoutAuthor": "Sinapidendron angustifolium"
            },
            {
                "commonNames": [
                    "Couve da Rocha"
                ],
                "gbifId": 3047767,
                "id": "1358422",
                "iucnCategory": "CR",
                "powoId": "288946-1",
                "scientificNameAuthorship": "Lowe",
                "scientificNameWithoutAuthor": "Sinapidendron rupestre"
            },
            {
                "commonNames": [
                    "Mostarda-branca",
                    "Mostarda"
                ],
                "gbifId": 3047621,
                "id": "1363889",
                "iucnCategory": null,
                "powoId": "288952-1",
                "scientificNameAuthorship": "L.",
                "scientificNameWithoutAuthor": "Sinapis alba"
            },
            {
                "commonNames": [
                    "Gorga",
                    "Mostarda",
                    "Mostarda-dos-campos"
                ],
                "gbifId": 3047598,
                "id": "1363890",
                "iucnCategory": null,
                "powoId": "null",
                "scientificNameAuthorship": "L.",
                "scientificNameWithoutAuthor": "Sinapis arvensis"
            },
            {
                "commonNames": [],
                "gbifId": 3047638,
                "id": "1358424",
                "iucnCategory": null,
                "powoId": "288998-1",
                "scientificNameAuthorship": "Poir.",
                "scientificNameWithoutAuthor": "Sinapis flexuosa"
            },
            {
                "commonNames": [],
                "gbifId": 5389346,
                "id": "1521320",
                "iucnCategory": null,
                "powoId": "236670-2",
                "scientificNameAuthorship": "(Klatt) Rydb.",
                "scientificNameWithoutAuthor": "Sinclairia polyantha"
            }
        ];

        setSpeciesData(dummyData);
        setLoadingData(false);
        onDataLoaded(dummyData, false);
    }
}

export default GetSpeciesList;
