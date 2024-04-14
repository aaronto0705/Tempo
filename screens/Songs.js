import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Audio } from 'expo-av'

const Songs = () => {

    const [tracks, setTracks] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
    const [currentSound, setCurrentSound] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();

    async function getSongs() {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const playlist_id = route.params.data.id;
        try {
            const response = await axios({
                method: "GET",
                url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTracks(response.data.items);
            console.log('response vals', response.data.items);
        } catch (err) {
            console.log(err.message);
        }
    }

    const startMusic = async () => {
        if (tracks.length > 0 && currentTrackIndex === -1) {
            setCurrentTrackIndex(0);
            await play(tracks[0].track);
        }
    }

    const play = async (nextTrack) => {
        const url = nextTrack.preview_url;
        console.log("URL IS", url)
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: false,
            })
            const { sound, status } = await Audio.Sound.createAsync({
                uri: url
            }, {
                shouldPlay: true, isLooping: false
            }
            )
            setCurrentSound(sound);
            await sound.playAsync();
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <View>
            <Text>SongsScreen</Text>
            <Button title="Start Music" onPress={startMusic} />
        </View>
    )
}

export default Songs
