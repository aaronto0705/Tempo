import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Preference1 from './screens/Preference1';
import Preference2 from './screens/Preference2';
import Preference3 from './screens/Preference3';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Preference3">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Preference1" component={Preference1} />
        <Stack.Screen name="Preference2" component={Preference2} />
        <Stack.Screen name="Preference3" component={Preference3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
