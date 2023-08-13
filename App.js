import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/screens/HomeScreen';
import HintsScreen from './app/screens/HintsScreen';

// import ResultsScreen from './app/screens/ResultsScreen';
// import IdentifyScreen from './app/screens/IdentifyScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    

    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dicas" component={HintsScreen} />

        {/* <Stack.Screen name="Results" component={ResultsScreen} /> */}
        {/* <Stack.Screen name="Identify" component={IdentifyScreen} /> */}

      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;
