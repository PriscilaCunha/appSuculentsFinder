import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, StyleSheet, ActivityIndicator, Image } from 'react-native';
import FolhaIcon from './FolhaIcon';
import plantValues from '../assets/data/plantValues.json';


const GetPlantDetails = ({ plantName }) => {

    const [specieName, setSpecieName] = useState('');
    const [specieDetails, setSpecieDetails] = useState([]);
    const [loading, setLoading] = useState(false);


    function transformTextToSlug(text) {
        const lowercaseText = text.toLowerCase();
        const slug = lowercaseText.replace(/\s+/g, '-');
        return slug;
    }
      

    const fetchPlantDetails = async () => {

        setLoading(true);

        const apikey = 'U1Dh7px20uz1x8mE_auS4t3BQNzCEhbEgS1ToNVjR78';
        var consultURL = `https://trefle.io/api/v1/species/${specieName}?token=${apikey}`;

        try {
            console.log('PEGANDO DETALHES...', specieName);
            console.log('URL', consultURL);

            const response = await fetch(consultURL, { method: 'GET', });

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                // throw new Error('Erro na requisição à API.');
                return;
            }

            // Pegar os dados
            const responseData = await response.json();
            console.log('DETALHES', responseData);

            // Verificar se há resultados
            if (responseData.error == true) {
                setSpecieDetails([]);
            } else {
                setSpecieDetails(responseData.data);
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

    useEffect(() => {
        setSpecieName( transformTextToSlug(plantName) );
        fetchPlantDetails();
    }, []);


    return (
        loading ? (
            <ActivityIndicator size="large" style={styles.loading} />

        ) : (
            specieDetails ? (
                <>
                    {/* <Text>{JSON.stringify(specieDetails, null, 2)}</Text> */}

                    { specieDetails.image_url && specieDetails.image_url.length > 0 && (
                        <Image source={{ uri: specieDetails.image_url }} style={styles.mainImage} />
                    )}

                    { specieDetails.scientific_name && specieDetails.scientific_name.length > 0 && (
                        <Text style={styles.title}>{specieDetails.scientific_name}</Text>
                    )}

                    { specieDetails.common_names &&
                        specieDetails.common_names.pt.length > 0 && (
                        Array.isArray(specieDetails.common_names.pt) ? (
                            <Text style={styles.commonNames}>{specieDetails.common_names.pt.slice(0, 2).join(', ')}</Text>
                        ) : (
                            <Text style={styles.commonNames}>{specieDetails.species.commonNames}</Text>
                            
                        )
                    )}
                    
{/* 
                    <View style={styles.gridBox}>
                        <View style={styles.gridHeader}>
                            <FolhaIcon style={styles.gridIcon} name="sun" />
                            <Text style={styles.gridTitle}>Luz</Text>
                        </View>

                        <Text style={styles.gridText}>
                            {plantbookData.max_light_lux}
                        </Text>
                    </View> */}

                    <Text style={styles.commonNames}>{specieDetails.species.scientificNameWithoutAuthor}</Text>
                </>

            ) : (
                <Text>Infelizmente, não foi possível encontrar os detalhes da planta...</Text>
            )
        )
    );

}

const styles = StyleSheet.create({
    loading: {
        marginTop: 20,
        color: '#14532D',
    },

});

export default GetPlantDetails;
