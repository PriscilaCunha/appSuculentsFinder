import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import FolhaIcon from '../components/FolhaIcon';
import GetPlantDetails from '../components/GetPlantDetails';


const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [detailsFromResults, setDetailsFromResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [specieDetails, setSpecieDetails] = useState({});


    // Pegar detalhes vindo da página anterior
    const getPlantDetails = () => {
        console.log('PEGANDO DETALHES...', item);

        if( item.scientific_name !== undefined && item.scientific_name !== null ){
            // Pega dados vindos da SpeciesScreen
            setDetailsFromResults({
                name: item.scientific_name,
                common_name: item.common_name,
                image_url: item.image_url
            });
        } else if ( item.species.scientificNameWithoutAuthor.length !== undefined && item.species.scientificNameWithoutAuthor.length !== null ) {
            // Pega dados vindos da IdentifyPlant
            setDetailsFromResults({
                name: item.species.scientificNameWithoutAuthor,
                common_name: item.species.commonNames,
                image_url: item.images[0].url.o
            });
        } else {
            // Nenhum resultado
            setDetailsFromResults({});
        }
    }

    // Conectar com API
    const getPlantCareDetails = async (plantName) => {
        setLoading(true);

        // Dados para envio da solicitação
        const data = {
            plantname: "african violet"
        };

        try {
            console.log('INICIO DO ENVIO');
            const response = await fetch('http://10.0.2.2:3000/plantdetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                return;
            }
    
            // Pegar os dados
            const responseData = await response.json();
            console.log('DETALHES', responseData);

            // Verificar se há resultados
            if (Object.keys(responseData).length != 0) {
                setSpecieDetails(responseData);
            }

            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error('Erro ao fazer a solicitação POST:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        Object.keys(specieDetails).length == 0 ?
            getPlantCareDetails(detailsFromResults.name) 
            : null
        
    }, []);

    return (
        Object.keys(detailsFromResults).length == 0 ? (
            <>
                <ActivityIndicator size="large" style={styles.loading} />
                { getPlantDetails() }
            </>

        ) : (
            <View>
                <Text style={styles.title}>Title: {detailsFromResults.name}</Text>            
                <Text>{JSON.stringify(detailsFromResults, null, 2)}</Text>

                {loading ? (
                    <ActivityIndicator size={'large'} style={styles.loading} />
                ) : (
                    <Text>{JSON.stringify(specieDetails, null, 2)}</Text>
                )}
            </View>
        )




        // loading ? (
        //     <ActivityIndicator /> 
        // ) : (
        //     <View>
        //         <Text style={styles.title}>PlantNet</Text>
        //         <Text>{JSON.stringify(plantScientificName, null, 2)}</Text>
        //         {/* <Text>{JSON.stringify(detailsFromResults, null, 2)}</Text> */}
        //         {/* <Text>{JSON.stringify(specieDetails, null, 2)}</Text> */}

        //     </View>
        // )


        // <Text style={styles.title}>PlantBook</Text>
        // <GetPlantDetails plantName={item.species.scientificNameWithoutAuthor} />

        // <ScrollView style={styles.container}>
        //     <Image source={{ uri: item.images[0].url.o }} style={styles.image} />

        //     <Text style={styles.title}>{item.species.scientificNameWithoutAuthor}</Text>

        //     {item.species && item.species.commonNames && item.species.commonNames.length > 0 && (
        //         Array.isArray(item.species.commonNames)
        //             ? (
        //                 <Text style={styles.commonNames}>
        //                     {item.species.commonNames.slice(0, 2).join(', ')}
        //                 </Text>
        //             )
        //             : (
        //                 <Text style={styles.commonNames}>{item.species.commonNames}</Text>
        //             )
        //     )}

        //     <View style={styles.gridContainer}>
        //         <FlatList
        //             data={gridData}
        //             numColumns={2}
        //             renderItem={({ item }) => (
        //                 <View style={styles.gridBox}>
        //                     <View style={styles.gridHeader}>
        //                         <FolhaIcon style={styles.gridIcon} name={item.icon} />
        //                         <Text style={styles.gridTitle}>{item.title}</Text>
        //                     </View>

        //                     <Text style={styles.gridText}>{item.text}</Text>
        //                 </View>
        //             )}
        //             keyExtractor={(item, index) => index.toString()}
        //         />
        //     </View>

        //     <Text style={styles.description}>{item.description}</Text>

        //     {loading ? (
        //         <ActivityIndicator />
        //     ) : (
        //         <>
        //             <Text style={styles.title}>PlantBook</Text>

        //             <GetPlantDetails
        //                 plantbookSearchTerm={item.species.scientificNameWithoutAuthor.toLowerCase()}
        //             />
        //         </>
        //     )}

        //     <Text style={styles.title}>PlantNet</Text>
        //     <Text>{JSON.stringify(item, null, 2)}</Text>
        // </ScrollView>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        margin: -5,
    },
    gridBox: {
        flex: 1,
        flexShrink: 1,
        margin: 5,
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
        fontSize: 14,
    },
});

export default DetailsScreen;
