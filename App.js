import { React } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Login from './screens/LoginScreen';
import Preference0 from './screens/Preference0';
import Preference1 from './screens/Preference1';
import Preference2 from './screens/Preference2';
import Preference3 from './screens/Preference3';
import Preference4 from './screens/Preference4';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Preference0" component={Preference0} />
        <Stack.Screen name="Preference1" component={Preference1} />
        <Stack.Screen name="Preference2" component={Preference2} />
        <Stack.Screen name="Preference3" component={Preference3} />
        <Stack.Screen name="Preference4" component={Preference4} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
