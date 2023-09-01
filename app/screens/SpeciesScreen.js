import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import FolhaIcon from "../components/FolhaIcon";
// import GetSpeciesList from '../components/GetSpeciesList';

const SpeciesScreen = ({ navigation }) => {

    const [speciesList, setSpeciesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');


    const loadMoreItems = async () => {
        // Evitar múltiplas solicitações
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        try {
            console.log('Carregando itens...', currentPage);

            const apikey = 'U1Dh7px20uz1x8mE_auS4t3BQNzCEhbEgS1ToNVjR78';
            var consultURL = '';

            if (searchText == '') {
                // Consultar todas
                consultURL = `https://trefle.io/api/v1/species?token=${apikey}&order[scientific_name]=asc&page=${currentPage}`;
            } else {
                // Consultar por pesquisa
                consultURL = `https://trefle.io/api/v1/species/search?token=${apikey}&order[scientific_name]=asc&q=${searchText}`;
            }

            const response = await fetch( consultURL, { method: 'GET', } );

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                //throw new Error('Erro na requisição à API.');
                return;
            }

            // Pegar os dados
            const responseData = await response.json();

            // Verificar se há resultados
            if (responseData.meta.total == 0) {
                setSpeciesList([]);
                setCurrentPage(1);
            } else {
                setSpeciesList(prevSpeciesList => [...prevSpeciesList, ...responseData.data]);
                setCurrentPage(currentPage + 1);
            }

        } catch (error) {
            console.error('ERROR:', error);
            ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };
    

    // Função de pesquisa
    const searchFilter = (text) => {
        if (text) {
            setSpeciesList([]);
            setSearchText(text);
            loadMoreItems();
        } else {
            setSpeciesList([]);
            setSearchText('');
            loadMoreItems();
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate('Detalhes', { item: item })} >
            
            <View style={styles.cardContent}>
                {item.scientific_name && (
                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.scientific_name}
                    </Text>
                )}

                {item.common_name && (
                    Array.isArray(item.common_name) ? (
                        <Text style={styles.cardParagraph} numberOfLines={1} ellipsizeMode="tail">
                            {item.common_name.slice(0, 2).join(', ')}
                        </Text>
                    )
                    : (
                        <Text style={styles.cardParagraph} numberOfLines={1} ellipsizeMode="tail">
                            {item.common_name}
                        </Text>
                    )
                )}
            </View>

            <View style={styles.cardArrow}>
                <FolhaIcon style={styles.buttonIcon} name="angle-right" />
            </View>
        </TouchableOpacity>
    );


    useEffect(() => {
        loadMoreItems();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <FolhaIcon name="search" style={styles.searchIcon} />
                <TextInput
                    placeholder="Filtrar espécies"
                    style={styles.searchInput}
                    onChangeText={(text) => searchFilter(text)}
                    value={searchText}
                />
            </View>

            <Text style={styles.titleH2}>Espécies disponíveis</Text>

            {/* Carregando vazio */
            isLoading && speciesList.length == 0 ? (
                <ActivityIndicator size="large" style={styles.loading} />
            
            ) : /* Carregando com conteúdo */
            speciesList.length > 0 ? (
                <>
                    <FlatList
                        data={speciesList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        style={styles.result}
                        onEndReached={loadMoreItems}
                        onEndReachedThreshold={0.5}
                    />

                    {isLoading ? (
                        <ActivityIndicator size="large" style={styles.loading} />
                    ) : null}
                </>

            ) : (
                // Nenhum resultado
                <Text style={styles.paragraph}>Nenhum resultado encontrado. Tente novamente mais tarde.</Text>
            )}
            
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F6',
        flex: 1,
        padding: 20,
        alignItems: 'stretch',
        gap: 20
    },


    searchBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        borderRadius: 10,
        minHeight: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchIcon: {
        color: '#1B1B1B',
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        color: '#1B1B1B',
        fontSize: 14,
    },


    titleH2: {
        color: '#030712',
        fontFamily: 'DMSerifDisplay-Regular',
        fontSize: 26,
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
        paddingRight: 5
    },
    cardParagraph: {
        color: '#6B7280',
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontStyle: 'italic',
    },

    cardArrow: {
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 15,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonIcon: {
        color: '#030712',
        fontSize: 18
    },

    loading: {
        marginVertical: 20,
        color: '#14532D',
    }
});

export default SpeciesScreen;
