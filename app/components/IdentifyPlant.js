import React, { useState, useEffect } from "react";
import { View, Image, Text, ToastAndroid, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FolhaIcon from "./FolhaIcon";
import { useNavigation } from '@react-navigation/native';


const IdentifyPlant = ({ imageUri }) => {
    const navigation = useNavigation();
    
    // Adicionar imagem para resultados sem foto
    const noImage = require('../assets/images/no_image_available.jpg');

    const [plantData, setPlantData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        identifyPlant();
    }, []);

    const identifyPlant = async () => {
        setLoading(true);

        // Dados para envio da solicitação
        const formData = new FormData();
        const imageBlob = await RNFetchBlob.fs.readFile(imageUri, 'base64');
        const filename = imageUri.split('/').pop();
        formData.append('organs', 'auto');
        formData.append('images', {
            uri: `data:image/jpeg;base64,${imageBlob}`,
            type: 'image/jpeg',
            name: filename,
        });
        const apikey = '2b10872BcGty3dTu0dD9n05QPu';
        const lang = 'pt';

        try {
            console.log('INICIO DO ENVIO');
            const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?include-related-images=true&no-reject=false&type=kt&lang=${lang}&api-key=${apikey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                //throw new Error('Erro na requisição à API.');
                return;
            }

            // Pegar os dados
            const responseData = await response.json();
            //console.log('RESULTADO', responseData.results);

            // Verificar se há resultados
            if (responseData.results != null && responseData.results != undefined && responseData.results.length > 0) {
                setPlantData(responseData.results);
            }

            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error('ERROR:', error);
            ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };


    const renderItem = ({ item }) => (
        <View style={styles.resultCard}>
            <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { item: item })} style={styles.cardImageContainer}>
                {item.images && item.images[0] && item.images[0].url && item.images[0].url.s && item.images[0].url.s.length > 0 ? (
                    <Image source={{ uri: item.images[0].url.s }} style={styles.cardImage} />
                ) : (
                    <Image source={noImage} style={styles.cardImage} />
                )}
            </TouchableOpacity>

            <View style={styles.cardContent}>
                {item.species && item.species.scientificNameWithoutAuthor && item.species.scientificNameWithoutAuthor.length > 0 && (
                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{item.species.scientificNameWithoutAuthor}</Text>
                )}

                {item.species && item.species.commonNames && item.species.commonNames.length > 0 && (
                    Array.isArray(item.species.commonNames) ? (
                        <Text style={styles.cardParagraph} numberOfLines={1} ellipsizeMode="tail">
                            {item.species.commonNames.slice(0, 2).join(', ')}
                        </Text>
                    ) : (
                        <Text style={styles.cardParagraph} numberOfLines={1} ellipsizeMode="tail">{item.species.commonNames}</Text>
                    )
                )}

                <View style={styles.cardButtons}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Detalhes', { item: item })}
                        style={[styles.cardButton, styles.buttonPrimary]}>
                        <Text style={styles.buttonText}>Dicas</Text>
                        <FolhaIcon style={styles.buttonIcon} name="angle-right" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cardButton, styles.buttonSecondary]}>
                        <Text style={styles.buttonText}>Detalhes</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );


    return (
        loading ? (
            <ActivityIndicator size="large" style={styles.loading} />
        ) : (
            plantData.length > 0 ? (
                <>
                    <Text style={styles.paragraph}>Veja as plantas semelhantes</Text>

                    <FlatList 
                        data={plantData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        style={styles.result}
                    />
                </>
            ) : (
                <Text style={styles.paragraph}>Nenhum resultado encontrado. Tente tirar uma nova foto de um ângulo diferente.</Text>
            )
        )
    );
}


const styles = StyleSheet.create({
    loading: {
        marginTop: 20,
        color: '#14532D',
    },

    result: {
        flex: 1,
        marginVertical: 20,
    },
    resultCard: {
        minHeight: 90,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignContent: 'flex-start',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 15,
    },

    cardImageContainer: {
        flexShrink: 0,
        width: 120,
        alignSelf: 'stretch',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    cardContent: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginVertical: 'auto',
    },

    cardTitle: {
        color: '#030712',
        fontFamily: 'DMSerifDisplay-Regular',
        fontSize: 14,
    },
    cardParagraph: {
        color: '#6B7280',
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        fontStyle: 'italic',
    },

    cardButtons: {
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    cardButton: {
        backgroundColor: '#FFB200',
        borderRadius: 50,
        paddingHorizontal: 16,
        height: 20,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
        color: '#030712',
        fontSize: 10,
        marginRight: 5,
    },
    buttonIcon: {
        color: '#030712',
        marginLeft: 5,
    },
    buttonSecondary: {
        backgroundColor: '#E5E7EB',
        fontSize: 10,
    },
});

export default IdentifyPlant;
