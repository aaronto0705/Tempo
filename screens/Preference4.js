import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Preference4() {

    const navigation = useNavigation();

    const [selectedGenre, setSelectedGenre] = useState('Pop');

    const handleCreatePlaylist = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const accessToken = await AsyncStorage.getItem('accessToken');
            const apiUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

            const name = await AsyncStorage.getItem('Preference0');
            const pace = await AsyncStorage.getItem('Preference3');
            const genre = await AsyncStorage.getItem('Preference4');

            // Request payload for creating a new playlist
            const playlistData = {
                name: name,
                description: `Playlist with pace of ${pace} and genre of ${genre}`,
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
                await AsyncStorage.setItem('PlaylistId', playlist.id);
                console.log('PLAYLIST ID', playlist.id)
                console.log('New playlist created:', playlist);
            } else {
                console.error('Failed to create playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const getRecommendations = async () => {
        try {
            const hours = parseInt(await AsyncStorage.getItem('Preference1h')) || 0;
            const minutes = parseInt(await AsyncStorage.getItem('Preference1m')) || 0;
            // const minutePerMile = parseFloat(await AsyncStorage.getItem('Preference2')) || 0;
            const genre = await AsyncStorage.getItem('Preference4');
        
            // Calculate total duration in minutes
            const totalMinutes = hours * 60 + minutes;
        
            // Calculate number of songs (limit)
            const limit = Math.ceil(totalMinutes / 3);
        
            // Calculate target BPM for target_tempo (hardcoded, don't know what algorithm to use)
            // Should be using minutePerMile here but idk what the calculation should be
            const targetBPM = 150
            const minTempo = targetBPM - 5;
            const maxTempo = targetBPM + 5;
        
            const apiUrl = `https://api.spotify.com/v1/recommendations?` +
            `seed_genres=${encodeURIComponent(genre)}` +
            `&limit=${limit}` +
            `&market=US` +
            `&min_tempo=${minTempo}` +
            `&max_tempo=${maxTempo}` +
            `&target_tempo=${targetBPM}`;
        
            // Fetch recommendations from Spotify API
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        
            if (response.ok) {
                const recommendations = await response.json();
                console.log('Recommendations:', recommendations);
                await addSongs(recommendations);
            } else {
                console.error('Failed to fetch recommendations:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating recommendations:', error);
        }
      };
      

      const addSongs = async (recommendations) => {
        try {
            const playlistId = await AsyncStorage.getItem('PlaylistId');
            if (!playlistId) {
                console.error('Playlist ID not found in AsyncStorage');
                return;
            }
    
            // Extract track URIs from recommendations
            const uris = recommendations.tracks.map((track) => track.uri);
    
            const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    
            const requestBody = {
                uris: uris,
                position: 0 
            };
    
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token not found in AsyncStorage');
                return;
            }
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                console.log('Tracks added successfully to playlist');
            } else {
                console.error('Failed to add tracks to playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding songs to playlist:', error);
        }
    };
    

    const handleNextPress = async () => {
        try {
            await AsyncStorage.setItem('Preference4', selectedGenre);
            await handleCreatePlaylist();
            await getRecommendations();
            navigation.navigate('Home');
        } 
        catch (error) {
            console.error('Error storing playlist name:', error);
        }
    }

    return (
        <View>
            <Picker
                selectedValue={selectedGenre}
                onValueChange={(itemValue) =>
                setSelectedGenre(itemValue)
            }>
                <Picker.Item label="Ambient" value="ambient"/>
                <Picker.Item label="Chill" value="chill"/>
                <Picker.Item label="Country" value="country"/>
                <Picker.Item label="Dance" value="dance"/>
                <Picker.Item label="Electronic" value="electronic"/>
                <Picker.Item label="Groove" value="groove"/>
                <Picker.Item label="House" value="house"/>
                <Picker.Item label="Indie" value="indie"/>
                <Picker.Item label="Metal" value="metal"/>
                <Picker.Item label="Pop" value="ambient"/>
            </Picker>


            <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
                <Text style={[styles.nextButtonText]}>Create</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#4C7F7E', 
      width: '100%',
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 10,
    },
    nextButtonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
  });


export default Preference4;