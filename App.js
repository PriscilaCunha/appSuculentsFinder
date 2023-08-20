import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './app/screens/HomeScreen';
import IdentifyScreen from './app/screens/IdentifyScreen';
import SpeciesScreen from './app/screens/SpeciesScreen';
import DetailsScreen from './app/screens/DetailsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">

                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Identificar" component={IdentifyScreen} />
                <Stack.Screen name="Busca por Espécie" component={SpeciesScreen} />
                <Stack.Screen name="Detalhes" component={DetailsScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
