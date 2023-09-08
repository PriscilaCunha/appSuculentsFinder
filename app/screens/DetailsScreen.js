import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';

import getVernacularName from '../helpers/getVernacularName';
import FolhaIcon from '../components/FolhaIcon';

//import GetPlantDetails from '../components/GetPlantDetails';


const DetailsScreen = ({ route, navigation }) => { 
    const { item } = route.params;

    const noImage = require('../assets/images/no_image_available.jpg');

    const [detailsFromResults, setDetailsFromResults] = useState({});
    
    const [detailsFromGBIF, setDetailsFromGBIF] = useState({});
    const [loadingBasic, setLoadingBasic] = useState(false);

    const [detailsFromPerenual, setDetailsFromPerenual] = useState({});
    const [loadingPerenual, setLoadingPerenual] = useState(false);

    

    // Pegar detalhes vindo da página anterior
    const getPlantMainDetails = () => {
        console.log('PEGANDO DETALHES...', item);

        if( item.canonicalName !== undefined && item.canonicalName !== null ){
            // Pega dados vindos da SpeciesScreen

            const vernacularNames = getVernacularName(item.vernacularNames);

            setDetailsFromResults({
                id: item.speciesKey,
                name: item.canonicalName,
                common_name: vernacularNames.vernacularName,
                image_url: ''
            });
            console.log('AQUIIIII', detailsFromResults);
            
        } else if ( item.species.scientificName !== undefined && item.species.scientificName !== null ) {
            // Pega dados vindos da IdentifyPlant
            setDetailsFromResults({
                id: item.gbif.id,
                name: item.species.scientificName,
                common_name: item.species.commonNames.join(', '),
                image_url: item.images[0].url.o
            });
        }
    }

    // Conectar com API GBIF
    const getPlantBasicDetails = async (plantID) => {
        setLoadingBasic(true);

        // Dados para envio da solicitação
        console.log('KEY', plantID);
        const apiUrl = `https://api.gbif.org/v1/occurrence/search?taxon_key=${plantID}&mediaType=StillImage`;

        try {
            console.log('Carregando Main Details...');

            const response = await fetch( apiUrl, { method: 'GET', } );

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                //throw new Error('Erro na requisição à API.');
                return;
            }

            // Pegar os dados
            const responseData = await response.json();
            // console.log('DETALHES GBIF', responseData.results[0]);

            // Verificar se há resultados
            if (responseData.count > 0) {
                setDetailsFromGBIF({
                    image_url: responseData.results[0].media[0].identifier,
                    classification: responseData.results[0].kingdom + ' > ' + responseData.results[0].phylum + ' > ' + responseData.results[0].order + ' > ' + responseData.results[0].family + ' > ' + responseData.results[0].genus + ' > ' + responseData.results[0].species
                })
            }

            
        } catch (error) {
            console.error('ERROR:', error);
            // ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
        } finally {
            setLoadingBasic(false);
        }

    }

    // Conectar com API Perenual
    const getPlantFullDetails = async (plantName) => {
        setLoadingPerenual(true);

        // Dados para envio da solicitação
        console.log('CARREGANDO DETALHES...', plantName);
        const apiUrl = `http://10.0.2.2:3000/plantdetails`;
        // const postData = { plantname: plantName, }
        const postData = { plantname: 'african violet', }

        try {
            console.log('Carregando Full Details...');

            const response = await fetch( apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify( postData ),
            });

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                return;
            }
    
            // Pegar os dados
            const responseData = await response.json();
            console.log('RESPONSE PERENUAL', responseData);

            // Verificar se há resultados
            if (responseData.results) {
                //console.log('AQUI');
                setDetailsFromPerenual(responseData.results);
            }

        } catch (error) {
            setLoadingPerenual(false);
            console.error('Erro ao fazer a solicitação POST:', error);
        } finally {
            setLoadingPerenual(false);
        }
    }

    const renderGrid = ({ item }) => (
        <>
            {console.log('ITEM', item)}

            {/* CICLO */}
            <View style={styles.gridBox}>
                <View style={styles.gridHeader}>
                    <FolhaIcon style={styles.gridIcon} name="ciclo" />
                    <Text style={styles.gridTitle}>Ciclo</Text>
                </View>

                <Text style={styles.gridText}>{item.ciclo}</Text>
            </View>

            {/* MANUTENÇÃO */}
            <View style={styles.gridBox}>
                <View style={styles.gridHeader}>
                    <FolhaIcon style={styles.gridIcon} name="manutencao" />
                    <Text style={styles.gridTitle}>Manutenção</Text>
                </View>

                <Text style={styles.gridText}>{item.manutencao}</Text>
            </View>

            {/* REGA */}
            <View style={styles.gridBox}>
                <View style={styles.gridHeader}>
                    <FolhaIcon style={styles.gridIcon} name="rega" />
                    <Text style={styles.gridTitle}>Rega</Text>
                </View>

                <Text style={styles.gridText}>{item.rega}</Text>
            </View>

            {/* SOL */}
            <View style={styles.gridBox}>
                <View style={styles.gridHeader}>
                    <FolhaIcon style={styles.gridIcon} name="sol" />
                    <Text style={styles.gridTitle}>Sol</Text>
                </View>

                <Text style={styles.gridText}>{item.sol}</Text>
            </View>
        </>
    );

    useEffect(() => {
        // Pegar detalhes vindo da página resultados
        getPlantMainDetails();
        console.log('DETALHES', detailsFromResults);

        // Pegar detalhes da API GBIF
        getPlantBasicDetails( detailsFromResults.id );
        // console.log('DETALHES GBIF', detailsFromGBIF);

        // Pegar detalhes da API Perenual
        getPlantFullDetails( detailsFromResults.name );
        //console.log('DETALHES PERENUAL', detailsFromPerenual);
    }, []);

    return (
        <ScrollView style={styles.container}>

            {/* Image */}
            {detailsFromResults.image_url ? (
                <Image style={styles.image} source={{ uri: detailsFromResults.image_url }} />
            ) : (
                detailsFromGBIF.image_url ? (
                    <Image style={styles.image} source={{ uri: detailsFromGBIF.image_url }} />
                ) : (
                    <Image style={styles.image} source={noImage} />
                )
            )}
            
            {/* Name */}
            <Text style={styles.title}>{detailsFromResults.name}</Text>

            {/* Common name */}
            <Text style={styles.commonNames}>{detailsFromResults.common_name}</Text>

            {/* Quadros */}
            {loadingPerenual ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (

                // detailsFromPerenual.length > 0 ? (
                <View style={styles.gridContainer}>
                    {/* CICLO */}
                    <View style={styles.gridBox}>
                        <View style={styles.gridHeader}>
                            <FolhaIcon style={styles.gridIcon} name="plant-cycle" />
                            <Text style={styles.gridTitle}>Ciclo</Text>
                        </View>

                        <Text style={styles.gridText}>{detailsFromPerenual.ciclo}</Text>
                    </View>

                    {/* REGA */}
                    <View style={styles.gridBox}>
                        <View style={styles.gridHeader}>
                            <FolhaIcon style={styles.gridIcon} name="watering-can" />
                            <Text style={styles.gridTitle}>Rega</Text>
                        </View>

                        <Text style={styles.gridText}>{detailsFromPerenual.rega}</Text>
                    </View>

                    {/* SOL */}
                    <View style={styles.gridBox}>
                        <View style={styles.gridHeader}>
                            <FolhaIcon style={styles.gridIcon} name="sun" />
                            <Text style={styles.gridTitle}>Sol</Text>
                        </View>

                        <Text style={styles.gridText}>{detailsFromPerenual.sol}</Text>
                    </View>

                    {/* MANUTENÇÃO */}
                    <View style={styles.gridBox}>
                        <View style={styles.gridHeader}>
                            <FolhaIcon style={styles.gridIcon} name="shovel" />
                            <Text style={styles.gridTitle}>Manutenção</Text>
                        </View>

                        <Text style={styles.gridText}>{detailsFromPerenual.manutencao}</Text>
                    </View>

                </View>
                // ) : (
                    // <Text style={styles.description}>Nenhum dado encontrado para esta planta.</Text>
                // )
            )}

            {/* Description */}
            {loadingBasic ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                <Text style={styles.description}>
                    <Text style={styles.bold}>Classificação: </Text>
                    { detailsFromGBIF.classification }
                </Text>
            )}

            {/* Instruções */}
            {loadingPerenual ? (
               <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                detailsFromPerenual.length > 0 ? (
                    <Text style={styles.description}>
                        <Text style={styles.bold}>Instruções: </Text>
                        {/* { detailsFromPerenual[0].instructions } */}
                    </Text>

                ) : (
                    <Text style={styles.description}>Nenhum dado encontrado para esta planta.</Text>
                )
            )}


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    image: {
        width: '100%',
        height: 280,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },

    title: {
        fontSize: 26,
        fontFamily: 'DMSerifDisplay-Regular',
        fontWeight: 'bold',
        color: '#030712',
    },
    commonNames: {
        color: "#6B7280",
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        fontStyle: 'italic',
        marginBottom: 10,
    },

    gridContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    gridBox: {
        flexBasis: '48%',
        maxWidth: '48%',
        marginBottom: 5,
        marginHorizontal: '1%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#E5E7EB',
        borderRadius: 15,
    },
    gridHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    gridIcon: {
        color: '#030712',
        fontSize: 18,

    },
    gridTitle: {
        color: '#030712',
        fontSize: 14,
        fontFamily: 'Inter-Bold',
    },
    gridText: {
        color: '#030712',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    description: {
        color: '#030712',
        fontFamily: 'Inter-Regular',
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
