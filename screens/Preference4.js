import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './Credentials';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

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

    const getTrackTempo = async (trackId, accessToken) => {
        try {
            const apiUrl = `https://api.spotify.com/v1/audio-features/${trackId}`;
    
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            if (response.ok) {
                const trackFeatures = await response.json();
                const tempo = trackFeatures.tempo; // Extract the tempo (BPM) from track features
                console.log(`Tempo (BPM) of track ${trackId}: ${tempo}`);
                return tempo; // Return tempo value
            } else {
                console.error('Failed to fetch track features:', response.statusText);
                return null; // Return null if request fails
            }
        } catch (error) {
            console.error('Error fetching track features:', error);
            return null; // Return null in case of an error
        }
    };

    const getRecommendations = async (limit, targetTempo, genre, numAdded, mpm, minTempo, maxTempo, pace) => {
        try {
            const apiUrl = `https://api.spotify.com/v1/recommendations?` +
                `seed_genres=${encodeURIComponent(genre)}` +
                `&limit=1` +  // Always request one song per API call
                `&market=US` +
                `&min_tempo=${minTempo}` +
                `&max_tempo=${maxTempo}` + 
                `&target_tempo=${targetTempo}`;
    
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            if (response.ok) {
                const recommendation = await response.json();
                console.log('Recommendation:', recommendation);

                // Get tempo of selected track
                let trackId = recommendation.tracks.map((track) => track.id);
                trackId = trackId[0];
                const newTempo = await getTrackTempo(trackId, accessToken)
                if (!newTempo) {
                    newTempo = targetTempo;
                }

                await addSongs(recommendation);
                numAdded++;
    
                // Determine next targetTempo based on pace
                let nextTargetTempo = targetTempo;
    
                // The way I've implemented this, I think we say on preference screen 3 that slowDown/speedUp will change the pace after each song and that by the end of the playlist the pace will have changed by 25%
                const factor = Math.floor(mpm * 0.25 / limit)
                if (pace === 'slowDown') { 
                    nextTargetTempo -= factor; 
                    maxTempo = newTempo;
                    minTempo = newTempo - 100; // change 100 after algorithm is implemented
                } else if (pace === 'speedUp') {
                    nextTargetTempo += factor; 
                    minTempo = newTempo;
                    maxTempo = newTempo + 100; // change 100 after algorithm is implemented
                }
                else {
                    minTempo = targetTempo - 100; // change 100 after algorithm is implemented
                    maxTempo = targetTempo + 100; // change 100 after algorithm is implemented
                }
    
                if (numAdded < limit) {
                    await getRecommendations(limit, nextTargetTempo, genre, numAdded, mpm, minTempo, maxTempo, pace);
                }
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

    const insertDB = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const dbRef = doc(db, 'users', userId);
        const docSnap = await getDoc(dbRef);
        if (docSnap.exists()) {
            var existing = docSnap.data().playlists || [];
            existing.push(await AsyncStorage.getItem('PlaylistId'));
            try {
                await setDoc(dbRef, {playlists: existing}, {merge: true});
            } catch (e) {
                console.log(e)
            }
        }
    }
    
    const handleNextPress = async () => {
        try {
            await AsyncStorage.setItem('Preference4', selectedGenre);
            const genre = selectedGenre
            const pace = await AsyncStorage.getItem('Preference3');

            await handleCreatePlaylist();

            const minutePerMile = parseFloat(await AsyncStorage.getItem('Preference2')) || 0;
            const totalMinutes = parseInt(await AsyncStorage.getItem('Preference1h')) * 60 +
                                 parseInt(await AsyncStorage.getItem('Preference1m')) || 0;

            // 3.5 min is a reasonable avg song length, change if needed
            const limit = Math.ceil(totalMinutes / 3.5); 

            // change this with new algorithm
            const targetTempo = 150; 
            // Change the +- 100 after algorithm is implemented
            await getRecommendations(limit, targetTempo, genre, 0, minutePerMile, targetTempo - 100, targetTempo + 100, pace);
    
            await insertDB();
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error storing playlist name:', error);
        }
    };

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