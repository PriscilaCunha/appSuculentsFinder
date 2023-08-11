import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import HintsScreen from './screens/HintsScreen';

import CameraScreen from './screens/CameraScreen';
import IdentifyScreen from './screens/IdentifyScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dicas" component={HintsScreen} />

        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Identify" component={IdentifyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
