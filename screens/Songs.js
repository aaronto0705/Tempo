import { StyleSheet, Text, View, Pressable, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Entypo } from "@expo/vector-icons";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Songs = () => {

    const [songs, setSongs] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [device, setDevice] = useState([]);

    const navigation = useNavigation();

    const route = useRoute();
    const imageUri = route.params.imageUri;
    console.log(route.params.data)

    async function startMusic() {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const uri = route.params.data.uri;
        console.log(uri)
        try {
            const playback = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
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
                const image = song.album.images.length > 0 ? song.album.images[0].url : null;
                newSongs.push({ 'artist': artists, 'name': song.name, 'image': image })
                setSongs(songs => [...songs, { 'artist': artists, 'name': song.name }]);
            }
            console.log('new songs', newSongs)

            const playlistDetailsResponse = await axios({
                method: "GET",
                url: `https://api.spotify.com/v1/playlists/${playlistId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setPlaylistName(playlistDetailsResponse.data.name);
            setPlaylistDescription(playlistDetailsResponse.data.description);

        } catch (e) { 
            console.log(e)
        }
    }

    async function getDevice() {
        let url = 'https://api.spotify.com/v1/me/player/devices'
        const accessToken = await AsyncStorage.getItem("accessToken");
        try {
            const response = await axios({
                method: "GET",
                url: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('devices', response.data.devices)
            setDevice(response.data.devices[0].id)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getDevice();
        getSongs();
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={{ color: 'white', padding: 20, fontSize: 20, paddingTop:40}}>Back</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, margin: 20 }} />
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
            <Text style={styles.playlistName}>{playlistName}</Text>
            <Text style={styles.playlistDescription}>{playlistDescription}</Text>
            <View > 
                <FlatList
                    data={songs}
                    showsHorizontalScrollIndicator={false}
                    style={styles.flatListContainer}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={[styles.rectangle]}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={{ height: 45, width: 45 }} />
                            ) : (
                                <View style={{ height: 45, width: 45, backgroundColor: 'gray' }} />
                            )}                                
                            <Text style={[styles.tempoText]}>{item.name}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(tempo) => tempo.id}
                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14333F',
    },
    flatListContainer: {
        marginBottom: 20,
        paddingLeft: 20,
    },
    playlistName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 26,
        paddingLeft: 20,
        paddingBottom: 10,
    },
    playlistDescription: {
        color: 'white',
        fontSize: 16,
        paddingLeft: 20,
        paddingBottom: 40,
        width: '60%',
    },
    rectangle: {
        width: '100%', 
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    tempoText: {
        color: 'white',
        paddingLeft: 20,
        fontSize: 16,
    },
    playButton: {
        backgroundColor: 'green',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 20,
    },
    playButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default Songs
