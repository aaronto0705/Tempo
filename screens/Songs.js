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

    async function startMusic() {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const uri = route.params.data.uri;
        console.log(uri)
        try {
            const playback = await fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    context_uri: uri,
                    offset: {position: 0}
                })
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <Text>SongsScreen</Text>
            <Button title="Start Music" onPress={startMusic} />
        </View>
    )
}

export default Songs
