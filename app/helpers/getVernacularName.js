const getVernacularName = (names) => {
    const preferredLanguages = ['por', 'eng'];

    // Verificar se há nomes em idiomas preferidos
    for (const language of preferredLanguages) {
        const selectedName = names.find((name) => name.language === language);
        if (selectedName) {
            return selectedName;
        }
    }

    // Se não houver nomes em idiomas preferidos, pegar os sem idioma
    const nameWithoutLanguage = names.find((name) => !name.language);
    if (nameWithoutLanguage) {
        return nameWithoutLanguage;
    }

    // Se não houver nenhum nome sem idioma, retornar null
    return null;
};

export default getVernacularName;
