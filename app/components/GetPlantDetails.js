import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, StyleSheet } from 'react-native';
import FolhaIcon from './FolhaIcon';
import plantValues from '../assets/data/plantValues.json';

const GetPlantBookData = ({ plantbookSearchTerm }) => {

    const plantbookApiKey = '95d2a29aa453af9a8ad4a91f35bf463b47b5323b';
    const [plantbookData, setPlantBookData] = useState(null);

    function determineClima(planta) {
        // Lógica para determinar o clima ideal com base nas informações da planta
    }
    
    function determineSolo(planta) {
        // Lógica para determinar o tipo de solo ideal com base nas informações da planta
    }
    
    function determineAdubacao(planta) {
        // Lógica para determinar a adubação ideal com base nas informações da planta
    }
    
    function determineLuminosidade(planta) {
        // Lógica para determinar a luminosidade ideal com base nas informações da planta
    }
    
    function determineFrequenciaRega(planta) {
        // Lógica para determinar a frequência ideal de rega com base nas informações da planta
    }


    const gridData = [
        {
            icon: 'plant-cycle',
            title: 'Ciclo',
            text: 'Perene',
        },
        {
            icon: 'watering-can',
            title: 'Rega',
            text: 'Moderada',
        },
        {
            icon: 'sun',
            title: 'Sol',
            text: 'Sol pleno, meia-sombra',
        },
        {
            icon: 'shovel',
            title: 'Solo',
            text: 'Baixa',
        },
    ];
    
    useEffect(() => {
        const fetchPlantBookData = async () => {
            try {
                console.log('PLANTBOOK INICIO DO ENVIO');
                console.log('PLANTBOOK SEARCH TERM', plantbookSearchTerm);
                  
                const plantbookResponse = await fetch(`https://open.plantbook.io/api/v1/plant/detail/${plantbookSearchTerm}/`, {
                    method: 'GET',
                    redirect: 'follow',
                    headers: {
                        'Authorization': `Token ${plantbookApiKey}`
                    }
                });
    
                console.log('RECEBENDO DADOS');
                ToastAndroid.show('RECEBENDO DADOS', ToastAndroid.SHORT);
    
                const responseData = await plantbookResponse.json();
                console.log('RESULTADO', responseData);
    
                if (responseData != null && responseData != undefined) {
                    setPlantBookData(responseData);
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log('PLANTBOOK ERROR: ', error);
                ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
            }
        };
    
        fetchPlantBookData();

    }, [plantbookSearchTerm, plantbookApiKey]);


    
    const climaIdeal = determineClima(plantbookData);
    const soloIdeal = determineSolo(plantbookData);
    const adubacaoIdeal = determineAdubacao(plantbookData);
    const luminosidadeIdeal = determineLuminosidade(plantbookData);
    const frequenciaRegaIdeal = determineFrequenciaRega(plantbookData);

    return (
        <View>
          {plantbookData ? (
            <View>


                <Text>{JSON.stringify(plantbookData, null, 2)}</Text>

                <Text>Clima Ideal: {climaIdeal}</Text>
                <Text>Solo Ideal: {soloIdeal}</Text>
                <Text>Adubação Ideal: {adubacaoIdeal}</Text>
                <Text>Luminosidade Ideal: {luminosidadeIdeal}</Text>
                <Text>Frequência de Rega Ideal: {frequenciaRegaIdeal}</Text>

                <View style={styles.gridBox}>
                    <View style={styles.gridHeader}>
                        <FolhaIcon style={styles.gridIcon} name="sun" />
                        <Text style={styles.gridTitle}>Luz</Text>
                    </View>

                    <Text style={styles.gridText}>
                        { plantbookData.max_light_lux }
                    </Text>
                </View>


            </View>
          ) : (
            <Text>Carregando dados do PlantBook...</Text>
          )}
        </View>
      );
    
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        color: 'pink',
    }
});

export default GetPlantBookData;
