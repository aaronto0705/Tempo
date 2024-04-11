import { Text, Pressable, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react';
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
            const userId = await AsyncStorage.getItem('userId');
            const accessToken = await AsyncStorage.getItem('accessToken');
            const apiUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

            // Request payload for creating a new playlist
            const playlistData = {
                name: 'New Playlist',
                description: 'New playlist description',
                public: false,
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playlistData),
            });

            if (response.ok) {
                const playlist = await response.json();
                console.log('New playlist created:', playlist);
            } else {
                console.error('Failed to create playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
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
                    await AsyncStorage.setItem('userId', userData.id);
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData(); 
    }, []); 
      

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
