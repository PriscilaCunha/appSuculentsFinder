import React from 'react';
import { View, Image } from 'react-native';

function ResultsScreen({ route }) {
  const { image } = route.params;

  return (
    <View>
      <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={{ width: 200, height: 200 }} />
    </View>
  );
}

export default ResultsScreen;
