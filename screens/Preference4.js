import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './Credentials';
import Spinner from 'react-native-loading-spinner-overlay';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function minutesPerMileToMilesPerHour(minutes, seconds) {
    var minutesPerMile = minutes + (seconds / 60);
    if (minutesPerMile <= 0) {
        return "Invalid input: minutes per mile must be greater than zero.";
    }

    // Calculate miles per hour
    var milesPerHour = 60 / minutesPerMile;
    
    return milesPerHour;
}

function getTempoFromMPH(milesPerHour) {
    if (milesPerHour <= 5.0) { //12:00 minutes per mile
        return 100.0
    } else if (milesPerHour >= 10.0) { //6:00 minutes per mile {
        return 180.0;
    } else {
        return (16 * milesPerHour) + 20.0; //linear equation
    }
}


// Collect and store genre and create playlist
function Preference4() {
    const [isLoading, setLoading] = useState(false);

    const navigation = useNavigation();

    const [selectedGenre, setSelectedGenre] = useState('Pop');

    const handleCreatePlaylist = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const accessToken = await AsyncStorage.getItem('accessToken');
            const apiUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

            const name = await AsyncStorage.getItem('Preference0');
            const paceMinutes = await AsyncStorage.getItem('Preference2m');
            const paceSeconds = await AsyncStorage.getItem('Preference2s');
            const genre = await AsyncStorage.getItem('Preference4');
            const initialTempo = await AsyncStorage.getItem('initialTempo');

            // Request payload for creating a new playlist
            const playlistData = {
                name: name,
                description: `Playlist with pace of ${paceMinutes}:${paceSeconds}minutes per mile, initial tempo of ${initialTempo}bpm, and genre of ${genre}`,
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

    // const getRecommendations = async (limit, targetTempo, genre, numAdded, mpm, minTempo, maxTempo, pace, callLimit) => {
    //     try {
    //         const accessToken = await AsyncStorage.getItem('accessToken');
    //         let recUrl = []
    //         while (numAdded < limit) {
    //             const apiUrl = `https://api.spotify.com/v1/recommendations?` +
    //             `seed_genres=${encodeURIComponent(genre)}` +
    //             `&limit=${callLimit}` +  // Always request one song per API call
    //             `&market=US` +
    //             `&min_tempo=${minTempo}` +
    //             `&max_tempo=${maxTempo}` + 
    //             `&target_tempo=${targetTempo}`;
    //             console.log(apiUrl);
    //             console.log(accessToken);
    //             recUrl.push(apiUrl)
    //             numAdded += callLimit;
    //             const factor = Math.floor(mpm * 0.25 / limit)
    //             if (pace === 'slowDown') { 
    //                 targetTempo -= factor; 
    //                 maxTempo = targetTempo+50;
    //                 minTempo = targetTempo - 100; // change 100 after algorithm is implemented
    //             } else if (pace === 'speedUp') {
    //                 targetTempo += factor; 
    //                 minTempo = targetTempo-50;
    //                 maxTempo = targetTempo + 100; // change 100 after algorithm is implemented
    //             }
    //             else {
    //                 minTempo = targetTempo - 100; // change 100 after algorithm is implemented
    //                 maxTempo = targetTempo + 100; // change 100 after algorithm is implemented
    //             }

    //         }
    //         const responses = await Promise.all(recUrl.map(url => fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         })));
    //         console.log(responses)
    //         const recommendations = await Promise.all(responses.map(response => response.json()));
    //         console.log('Recommendations:', recommendations);
    //         await Promise.all(recommendations.map(recommendation => addSongs(recommendation)));
    //         // Continue with the rest of the code...
    //         console.log('added songs')
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }


    const getRecommendations = async (limit, targetTempo, genre, numAdded, mpm, minTempo, maxTempo, pace, callLimit) => {
        try {
            const apiUrl = `https://api.spotify.com/v1/recommendations?` +
                `seed_genres=${encodeURIComponent(genre)}` +
                `&limit=${callLimit}` +  // Always request one song per API call
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
                let newTempo = await getTrackTempo(trackId, accessToken)
                if (!newTempo) {
                    newTempo = targetTempo;
                }

                await addSongs(recommendation);
                numAdded += callLimit;

                // Determine next targetTempo based on pace
                let nextTargetTempo = targetTempo;

                // The way I've implemented this, I think we say on preference screen 3 that slowDown/speedUp will change the pace after each song and that by the end of the playlist the pace will have changed by 25%
                const factor = Math.floor(mpm * 0.25 / limit)
                if (pace === 'slowDown') { 
                    nextTargetTempo -= factor; 
                    maxTempo = newTempo - 1;
                    minTempo = newTempo - 30; 
                } else if (pace === 'speedUp') {
                    nextTargetTempo += factor; 
                    minTempo = newTempo + 1;
                    maxTempo = newTempo + 30; 
                }
                else {
                    minTempo = targetTempo - 15;
                    maxTempo = targetTempo + 15; 
                }

                if (numAdded < limit) {
                    await getRecommendations(limit, nextTargetTempo, genre, numAdded, mpm, minTempo, maxTempo, pace, callLimit);
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
                await setDoc(dbRef, { playlists: existing }, { merge: true });
            } catch (e) {
                console.log(e)
            }
        }
    }

    const handleNextPress = async () => {
        try {
            setLoading(true);
            await AsyncStorage.setItem('Preference4', selectedGenre);
            const genre = selectedGenre
            const pace = await AsyncStorage.getItem('Preference3');

            await handleCreatePlaylist();

            const paceMinutes = parseInt(await AsyncStorage.getItem('Preference2m')) || 0;
            const paceSeconds = parseInt(await AsyncStorage.getItem('Preference2s')) || 0;
            const minutePerMile = paceMinutes + (paceSeconds / 60);
            const totalMinutes = parseInt(await AsyncStorage.getItem('Preference1h')) * 60 +
                parseInt(await AsyncStorage.getItem('Preference1m')) || 0;

            // 3.5 min is a reasonable avg song length, change if needed
            const limit = Math.ceil(totalMinutes / 3.5);
            let callLimit = -1;
            if (pace === 'constant') {
                callLimit = limit;
            } else {
                callLimit = 1;
            }
            const milesPerHour = minutesPerMileToMilesPerHour(paceMinutes, paceSeconds);
            const initialTempo = Math.round(getTempoFromMPH(milesPerHour)); 
            await AsyncStorage.setItem('initialTempo', initialTempo.toString());
            await getRecommendations(limit, initialTempo, genre, 0, minutePerMile, initialTempo - 15, initialTempo + 15, pace, callLimit);
            await insertDB();
            setLoading(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error storing playlist name:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>Genre of music:</Text>

            <Picker
                selectedValue={selectedGenre}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedGenre(itemValue)
            }>
                <Picker.Item label="Ambient" value="ambient" color="white"/>
                <Picker.Item label="Chill" value="chill" color="white"/>
                <Picker.Item label="Country" value="country" color="white"/>
                <Picker.Item label="Dance" value="dance" color="white"/>
                <Picker.Item label="Electronic" value="electronic" color="white"/>
                <Picker.Item label="Groove" value="groove" color="white"/>
                <Picker.Item label="House" value="house" color="white"/>
                <Picker.Item label="Indie" value="indie" color="white"/>
                <Picker.Item label="Metal" value="metal" color="white"/>
                <Picker.Item label="Pop" value="pop" color="white"/>
            </Picker>


            <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
                <Text style={[styles.nextButtonText]}>Create</Text>
            </TouchableOpacity>
            {/* To check if works, got rate limited */}
            <Spinner
                visible={isLoading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#4C7F7E',
    },
    questionText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        backgroundColor: '#4C7F7E',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: '#14333F',
        width: '50%',
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 30,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
});


export default Preference4;