import { StyleSheet, Text, View, Pressable, Image, FlatList, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Entypo } from "@expo/vector-icons";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Songs = () => {

    const [songs, setSongs] = useState([]);

    const navigation = useNavigation();

    const route = useRoute();
    const imageUri = route.params.imageUri;
    console.log(route.params.data)

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
                    offset: { position: 0 }
                })
            })
            console.log(playback)
        } catch (err) {
            console.log(err);
        }
    }

    async function getSongs() {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const playlistId = route.params.data.id;
        console.log(playlistId)
        console.log(accessToken)
        try {
            var url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks/`// +  
            const response = await axios({
                method: "GET",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const cursongs = response.data.items
            const newSongs = []
            for (let i = 0; i < cursongs.length; i++) {
                let song = cursongs[i].track
                const artists = song.artists || [{'name': 'Unknown'}];
                newSongs.push({ 'artist': artists, 'name': song.name })
                setSongs(songs => [...songs, { 'artist': artists, 'name': song.name }]);
            }
            console.log('new songs', newSongs)
        } catch (e) { 
            console.log(e)
        }
    }

    useEffect(() => {
        getSongs();
    }, [])

    return (
        <LinearGradient colors={['#000000', '#000000']} style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={{ color: 'white', padding: 50}}>Back</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, borderRadius: 10, margin: 20 }} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 30 }}>
                <Pressable
                    onPress={startMusic}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#1DB954",
                    }}
                >
                    <Entypo name="controller-play" size={24} color="white" />
                </Pressable>
            </View>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 80 }}>Songs</Text>
            <View>
                <FlatList
                    data={songs}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={[styles.rectangle]}>
                                <Text style={[styles.tempoText]}>{item.name}</Text>
                                <Pressable>
                                </Pressable>
                            </View>
                        </View>
                    )}
                    keyExtractor={(tempo) => tempo.id}
                />
            </View>
        </LinearGradient>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#14333F',
    },
    profileContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "white",
        marginBottom: 70,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangle: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    tempoText: {
        color: 'black',
        fontSize: 16,
        padding: 15,
    },
    playButton: {
        backgroundColor: 'green',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    playButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        backgroundColor: '#4C7F7E',
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Songs
