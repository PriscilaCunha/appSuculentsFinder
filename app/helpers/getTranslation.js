import axios from 'axios';
import Config from 'react-native-config';

const getTranslation = async (detailsFromPerenual, setDetailsFromPerenualPT, setLoadingPerenualPT) => {
  setLoadingPerenualPT(true);

  // Defina aqui as variáveis sourceLanguage e targetLanguage com os valores corretos
  const sourceLanguage = 'en';
  const targetLanguage = 'pt';

  const translateText = async (text, sourceLang, targetLang) => {
    console.log('Traduzindo...');

    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2', null, {
        params: {
          q: text,
          source: sourceLang,
          target: targetLang,
          key: Config.GOOGLE_TRANSLATE_API_KEY,
        },
      });

      console.log('RESPONSE TRANSLATED', response.data.data.translations[0].translatedText);
      return response.data.data.translations[0].translatedText;
      
    } catch (error) {
      console.error('Erro na tradução:', error);
      return text; // Em caso de erro, retornar o texto original
    }
  };

  const translatedJSON = {};

  for (const key in detailsFromPerenual) {
    if (typeof detailsFromPerenual[key] === 'string') {
      // Traduzir apenas valores de texto
      const translation = await translateText(detailsFromPerenual[key], sourceLanguage, targetLanguage);
      translatedJSON[key] = translation;
    } else {
      // Manter valores não-textuais inalterados
      translatedJSON[key] = detailsFromPerenual[key];
    }
  }

  setLoadingPerenualPT(false);
  setDetailsFromPerenualPT(translatedJSON);
};

export default getTranslation;
