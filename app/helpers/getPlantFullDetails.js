// Conectar com API Perenual
const getPlantFullDetails = async (plantName, setDetailsFromPerenual, setLoadingPerenual) => {
    setLoadingPerenual(true);

    // Dados para envio da solicitação
    console.log('CARREGANDO DETALHES...', plantName);
    const apiUrl = `http://10.0.2.2:3000/plantdetails`;
    const postData = { plantname: plantName, }
    // const postData = { plantname: 'african violet', }

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

export default getPlantFullDetails;
