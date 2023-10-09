import getVernacularName from '../helpers/getVernacularName';

// Pegar detalhes vindo da página anterior
const getPlantMainDetails = (item, setDetailsFromResults) => {
    console.log('PEGANDO DETALHES PERENUAL...', item);

    if( item.canonicalName !== undefined && item.canonicalName !== null ){
        // Pega dados vindos da SpeciesScreen

        const vernacularNames = getVernacularName(item.vernacularNames);

        setDetailsFromResults({
            id: item.speciesKey,
            from: 'SpeciesScreen',
            name: item.canonicalName,
            common_name: vernacularNames.vernacularName,
            image_url: ''
        });
        
    } else if ( item.species.scientificName !== undefined && item.species.scientificName !== null ) {
        // Pega dados vindos da IdentifyPlant

        setDetailsFromResults({
            id: item.gbif.id,
            from: 'IdentifyPlant',
            name: item.species.scientificNameWithoutAuthor,
            common_name: item.species.commonNames.join(', '),
            image_url: item.images[0].url.o
        });
    }
}

export default getPlantMainDetails;
