import React, { useState, useEffect } from 'react';
import { Text, Pressable, SafeAreaView, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [playlist, setPlaylist] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    // Handle missing access token (user not authenticated)
                    return;
                }

                // Fetch user's liked tracks from Spotify API
                const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // Extract track data from API response
                const tracks = response.data.items.map((item) => ({
                    id: item.track.id,
                    name: item.track.name,
                }));

                // Create a random playlist (e.g., select random tracks)
                const randomPlaylist = tracks.slice(0, 10); // Example: Create a playlist with 10 random tracks
                setPlaylist(randomPlaylist);
            } catch (error) {
                console.error('Failed to fetch playlist:', error);
            }
        };

        fetchPlaylist();
    }, []);

    const handleCreatePlaylist = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                // Handle missing access token (user not authenticated)
                return;
            }

            // Create a playlist on Spotify
            const response = await axios.post(
                'https://api.spotify.com/v1/me/playlists',
                {
                    name: 'My Random Playlist',
                    public: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const playlistId = response.data.id;
            const trackUris = playlist.map((track) => `spotify:track:${track.id}`);

            // Add tracks to the created playlist
            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    uris: trackUris,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Playlist created successfully!');
        } catch (error) {
            console.error('Failed to create playlist:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
                HomeScreen
            </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text>Logout</Text>
            </Pressable>
            <FlatList
                data={playlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                )}
            />
            <Pressable onPress={handleCreatePlaylist} style={{ padding: 100, backgroundColor: 'blue', borderRadius: 10, marginTop: 50, alignSelf: 'center' }}>
                <Text style={{ fontSize: 18, color: 'white' }}>Create Playlist</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default HomeScreen;
