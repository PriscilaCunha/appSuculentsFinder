import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import FolhaIcon from "../components/FolhaIcon";
import GetSpeciesList from '../components/GetSpeciesList';

const SpeciesScreen = ({ navigation }) => {
    const [speciesList, setSpeciesList] = useState([]);
    const [filteredSpeciesList, setFilteredSpeciesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    // Functions for List
    const handleDataLoaded = (species, loading) => {
        setSpeciesList(species);
        setFilteredSpeciesList(species);
        setLoading(loading);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate('Detalhes', { item: item })} >
            
            <View style={styles.cardContent}>

                {item.scientificNameWithoutAuthor && item.scientificNameWithoutAuthor.length > 0 && (
                    <Text style={styles.cardTitle}>{item.scientificNameWithoutAuthor}</Text>
                )}

                {item.commonNames.length > 0 && (
                    Array.isArray(item.commonNames) ? (
                        <Text style={styles.cardParagraph}>
                            {item.commonNames.slice(0, 2).join(', ')}
                        </Text>
                    )
                    : (
                        <Text style={styles.cardParagraph}>{item.commonNames}</Text>
                    )
                )}
                        
            </View>

            <View style={styles.cardArrow}>
                <FolhaIcon style={styles.buttonIcon} name="angle-right" />
            </View>
        </TouchableOpacity>
    );
    

    // Functions for Search
    const searchFilter = (text) => {
        const filteredData = speciesList.filter((item) =>{
            const isInScientificName = item.scientificNameWithoutAuthor.toLowerCase().includes(text.toLowerCase());

            const isInCommonNames = item.commonNames?.some(commonName =>
                commonName.toLowerCase().includes(text.toLowerCase())
            );
            
            return isInScientificName || isInCommonNames;
        });

        setFilteredSpeciesList(filteredData);
        setSearchText(text);
    };


    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Pesquisar..."
                onChangeText={(text) => searchFilter(text)}
                value={searchText}
            />
            
            <Text style={styles.titleH2}>Espécies disponíveis</Text>

            {loading ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                filteredSpeciesList && filteredSpeciesList.length > 0 ? (
                    <FlatList 
                        data={filteredSpeciesList}
                        keyExtractor={(item) => item.scientificNameWithoutAuthor}
                        renderItem={renderItem}
                        style={styles.result} />
                ) : (
                    <Text style={styles.paragraph}>Nenhum resultado encontrado. Tente novamente mais tarde.</Text>
                )
            )}
            <GetSpeciesList onDataLoaded={handleDataLoaded} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F6',
        flex: 1,
        padding: 20,
        alignItems: 'stretch',
    },

    titleH2: {
        color: '#030712',
        fontFamily: 'DMSerifDisplay-Regular',
        fontSize: 26,
        marginBottom: 20,
    },


    result: {
        flex: 1,
    },
    resultCard: {
        alignSelf: 'stretch',
        minHeight: 70,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    cardContent: {
        flexGrow: 1,
        flexShrink: 1,
    },

    cardTitle: {
        color: '#030712',
        fontFamily: 'DMSerifDisplay-Regular',
        fontSize: 18,
        lineHeight: 20,
    },
    cardParagraph: {
        color: '#6B7280',
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontStyle: 'italic',
    },

    cardArrow: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonIcon: {
        color: '#030712',
        fontSize: 18
    },
});

export default SpeciesScreen;
