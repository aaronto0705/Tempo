import { Text, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
      try {
        navigation.navigate('Login');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('expirationTime');    
        console.log('Logout successful');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
    

    const handleCreatePlaylist = async () => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const apiUrl = 'https://api.spotify.com/v1/me';
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
            if (response.ok) {
                const userData = await response.json(); 
                console.log('User Data:', userData); 
          } else {
                console.error('Failed to fetch user data:', response.statusText);
          }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
      };
      

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>HomeScreen</Text>
        <Pressable style={{ marginVertical: 20 }} onPress={handleCreatePlaylist}>
            <Text>Create Playlist</Text>
        </Pressable>
        <Pressable onPress={handleLogout}>
            <Text>Logout</Text>
        </Pressable>
        </SafeAreaView>
    );
};

export default HomeScreen;
