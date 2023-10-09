import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';

import FolhaIcon from '../components/FolhaIcon';
import getPlantMainDetails from '../helpers/getPlantMainDetails';
import getPlantBasicDetails from '../helpers/getPlantBasicDetails';
import getPlantFullDetails from '../helpers/getPlantFullDetails';
import getTranslation from '../helpers/getTranslation';

const DetailsScreen = ({ route, navigation }) => { 
    const { item } = route.params;

    const noImage = require('../assets/images/no_image_available.jpg');

    const [detailsFromResults, setDetailsFromResults] = useState({});
    
    const [detailsFromGBIF, setDetailsFromGBIF] = useState({});
    const [loadingBasic, setLoadingBasic] = useState(false);

    const [detailsFromPerenual, setDetailsFromPerenual] = useState({});
    const [loadingPerenual, setLoadingPerenual] = useState(false);

    const [detailsFromPerenualPT, setDetailsFromPerenualPT] = useState({});
    const [loadingPerenualPT, setLoadingPerenualPT] = useState(false);
    const [translationRequested, setTranslationRequested] = useState(false);

    const getPlantFullDetailsDummy = () => {
        const data = {"results": {"ciclo": "Herbaceous Perennial", "manutencao": "Medium", "podaExplicacao": "African violets (Saintpaulia ionantha) should be pruned regularly throughout the season, but typically no more than once a month. Prune off dead or dying leaves and flowers to promote healthy new foliage and blooms. Begin pruning in late winter or early spring, just before new growth appears.", "rega": "Average", "regaExplicacao": "African violets should be watered once every 5-7 days, depending on the local conditions such as humidity and temperature. Watering for African violets should be deep and thorough but take care not to overwater. The size of the pot and type of potting medium also affect the amount of water needed. About 3 tablespoons of water per plant is recommended, but this may need to be adjusted depending on the size of the pot and the potting medium.", "sol": "part shade,part sun/part shade", "solExplicacao": "African Violets require low-to-medium indirect sunlight for optimal growth and flowering. They do best with 4-6 hours of bright, indirect sunlight each day, through a lightly curtained window or other indirect light source. Avoid direct sunlight, as this could cause the delicate leaves to burn. If the African Violet gets too little light, it will not bloom. However, too much direct sunlight can cause the leaves to wilt or turn yellow and can cause burning of the petals."}}

        setDetailsFromPerenual(data.results);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pegar detalhes vindo da página resultados
                await getPlantMainDetails(item, setDetailsFromResults);
            } catch (error) {
                console.error('Erro ao buscar detalhes:', error);
            }
        };
    
        fetchData();
    }, [item]);

    // observar o estado de detailsFromResults
    useEffect(() => {
        console.log('USE EFFECT DETALHES', detailsFromResults);

        // Pegar detalhes da API GBIF
        if (detailsFromResults.id) {
            getPlantBasicDetails(detailsFromResults.id, setDetailsFromGBIF, setLoadingBasic);
            // console.log('DETALHES GBIF', detailsFromGBIF);
        }

        // Pegar detalhes da API Perenual
        // getPlantFullDetailsDummy();
        if (detailsFromResults.name) {
            getPlantFullDetails( detailsFromResults.name, setDetailsFromPerenual, setLoadingPerenual);
            console.log('DETALHES PERENUAL', detailsFromPerenual);
        }
    }, [detailsFromResults]);

    useEffect(() => {
        // Pegar detalhes da API Perenual Traduzido
        if (detailsFromPerenual.ciclo && !translationRequested) {
            getTranslation(detailsFromPerenual, setDetailsFromPerenualPT, setLoadingPerenualPT, translationRequested);
            setTranslationRequested(true);
        }
    }, [detailsFromPerenual, translationRequested]);

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
            {loadingPerenualPT ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                detailsFromPerenualPT && detailsFromPerenualPT.ciclo ? (
                    <View style={styles.gridContainer}>
                        {/* CICLO */}
                        <View style={styles.gridBox}>
                            <View style={styles.gridHeader}>
                                <FolhaIcon style={styles.gridIcon} name="plant-cycle" />
                                <Text style={styles.gridTitle}>Ciclo</Text>
                            </View>

                            <Text style={styles.gridText}>{detailsFromPerenualPT.ciclo}</Text>
                        </View>

                        {/* REGA */}
                        <View style={styles.gridBox}>
                            <View style={styles.gridHeader}>
                                <FolhaIcon style={styles.gridIcon} name="watering-can" />
                                <Text style={styles.gridTitle}>Rega</Text>
                            </View>

                            <Text style={styles.gridText}>{detailsFromPerenualPT.rega}</Text>
                        </View>

                        {/* SOL */}
                        <View style={styles.gridBox}>
                            <View style={styles.gridHeader}>
                                <FolhaIcon style={styles.gridIcon} name="sun" />
                                <Text style={styles.gridTitle}>Sol</Text>
                            </View>

                            <Text style={styles.gridText}>{detailsFromPerenualPT.sol}</Text>
                        </View>

                        {/* MANUTENÇÃO */}
                        <View style={styles.gridBox}>
                            <View style={styles.gridHeader}>
                                <FolhaIcon style={styles.gridIcon} name="shovel" />
                                <Text style={styles.gridTitle}>Manutenção</Text>
                            </View>

                            <Text style={styles.gridText}>{detailsFromPerenualPT.manutencao}</Text>
                        </View>

                    </View>
                ) : (
                    // <Text style={styles.description}>Nenhum dado encontrado para esta planta.</Text>
                    null
                )
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
            {loadingPerenualPT ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                detailsFromPerenualPT ? (
                    <View>
                        <Text style={styles.description}>
                            <Text style={styles.bold}>Rega: </Text>
                            { detailsFromPerenualPT.regaExplicacao }
                        </Text>

                        <Text style={styles.description}>
                            <Text style={styles.bold}>Sol: </Text>
                            { detailsFromPerenualPT.solExplicacao }
                        </Text>

                        <Text style={styles.description}>
                            <Text style={styles.bold}>Poda: </Text>
                            { detailsFromPerenualPT.podaExplicacao }
                        </Text>
                    </View>
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
        marginBottom: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
