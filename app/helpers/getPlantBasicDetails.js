// Conectar com API GBIF
const getPlantBasicDetails = async (plantID, setDetailsFromGBIF, setLoadingBasic) => {
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

export default getPlantBasicDetails;
