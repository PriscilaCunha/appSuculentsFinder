import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

import FolhaIcon from "../components/FolhaIcon";

const SpeciesScreen = ({ navigation }) => {

    const [speciesList, setSpeciesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchText, setSearchText] = useState('');


    const loadMoreItems = async () => {
        // Evitar múltiplas solicitações
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        try {
            console.log('Carregando itens...', currentPage);

            const limit = 20;
            var consultURL = '';


            // Consultar por pesquisa
            if (searchText.length > 0) {
                consultURL = `https://api.gbif.org/v1/species/search?q=${searchText}&rank=SPECIES&highertaxon_key=6&qField=SCIENTIFIC&status=ACCEPTED`;
                console.log('BUSCANDO POR:', searchText);
            } else {
                consultURL = `https://api.gbif.org/v1/species/search?rank=SPECIES&highertaxon_key=6&status=ACCEPTED&offset=${currentPage}&limit=${limit}`;
                console.log('BUSCANDO TODOS...');
            }

            const response = await fetch( consultURL, { method: 'GET', } );

            // Verificar se a requisição foi bem sucedida
            if (!response.ok) {
                //throw new Error('Erro na requisição à API.');
                return;
            }

            // Pegar os dados
            const responseData = await response.json();
            // console.log('LISTAGEM', responseData.results);

            // Verificar se há resultados
            if (responseData.count > 0) {
                // Há resultados
                console.log('HÀ RESULTADOS');

                // Verifica lista atual
                console.log('LISTA ATUAL', speciesList);
                if (speciesList.length === 0) {
                    // Lista vazia
                    console.log('LISTA VAZIA');
                    setSpeciesList(responseData.results);

                } else {
                    // Lista não vazia
                    console.log('LISTA NÃO VAZIA');
                    setSpeciesList(prevSpeciesList => [...prevSpeciesList, ...responseData.results]);
                    setCurrentPage(currentPage + limit);
                }
            } else {
                // Nenhum resultado
                console.log('NENHUM RESULTADO');
            }


            // const apikey = 'U1Dh7px20uz1x8mE_auS4t3BQNzCEhbEgS1ToNVjR78';
            // var consultURL = '';

            // if (searchText == '') {
            //     // Consultar todas
            //     consultURL = `https://trefle.io/api/v1/species?token=${apikey}&order[scientific_name]=asc&page=${currentPage}`;
            // } else {
            //     // Consultar por pesquisa
            //     consultURL = `https://trefle.io/api/v1/species/search?token=${apikey}&order[scientific_name]=asc&q=${searchText}`;
            // }

            // const response = await fetch( consultURL, { method: 'GET', } );

            // // Verificar se a requisição foi bem sucedida
            // if (!response.ok) {
            //     //throw new Error('Erro na requisição à API.');
            //     return;
            // }

            // // Pegar os dados
            // const responseData = await response.json();

            // // Verificar se há resultados
            // if (responseData.meta.total == 0) {
            //     setSpeciesList([]);
            //     setCurrentPage(1);
            // } else {
            //     setSpeciesList(prevSpeciesList => [...prevSpeciesList, ...responseData.data]);
            //     setCurrentPage(currentPage + 1);
            // }
        } catch (error) {
            console.error('ERROR:', error);
            // ToastAndroid.show('Erro ao fazer a solicitação, tente novamente', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };
    

    // Função de pesquisa
    const searchFilter = (text) => {
        // BUSCAR POR TEXTO
        console.log('BUSCA INICIADA');
        setCurrentPage(0);
        setSpeciesList([]);

        if (text.length > 0) {
            console.log('TEXTO INSERIDO', text);
            setSearchText(text);
        } else {
            console.log('TEXTO APAGADO', text);
            setSearchText('');
        }

        loadMoreItems();
    };


    const renderItem = ({ item }) => {

        const vernacularNames = item.vernacularNames || [];
        // Filtra os resultados com a linguagem "por" (português)
        const portugueseNames = vernacularNames.filter((name) => name.language === "por");
        // Se não houver resultados em português, use os em inglês ("eng")
        const fallbackNames = vernacularNames.filter((name) => name.language === "eng");
        // Escolhe as palavras em português se houverem, caso contrário, usa as em inglês
        const selectedNames = portugueseNames.length > 0 ? portugueseNames : fallbackNames;

        return (
            <TouchableOpacity
                style={styles.resultCard}
                onPress={() => navigation.navigate('Detalhes', { item: item })} >
                
                <View style={styles.cardContent}>
                    {item.canonicalName && (
                        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                            {item.canonicalName}
                        </Text>
                    )}

                    {selectedNames.length > 0 && (
                        <Text style={styles.cardParagraph} numberOfLines={1} ellipsizeMode="tail">
                            {selectedNames.map((vernacular) => vernacular.vernacularName).join(', ')}
                        </Text>
                    )}
                </View>

                <View style={styles.cardArrow}>
                    <FolhaIcon style={styles.buttonIcon} name="angle-right" />
                </View>
            </TouchableOpacity>
        );
    };


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
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    onSubmitEditing={() => searchFilter(searchText)}
                    returnKeyType="done"
                />
            </View>

            <Text style={styles.titleH2}>Espécies disponíveis</Text>

            { isLoading && speciesList.length == 0 ? (
                /* Carregando vazio */
                <ActivityIndicator size="large" style={styles.loading} />
            
            ) : ( 
                /* Carregando com conteúdo */
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
                )
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
