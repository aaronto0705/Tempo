import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Home() {

    const [tempos, setTempos] = useState([]);

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

    // const handleCreatePlaylist = async () => {
    //     try {
    //         const userId = await AsyncStorage.getItem('userId');
    //         const accessToken = await AsyncStorage.getItem('accessToken');
    //         const apiUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;

    //         // Request payload for creating a new playlist
    //         const playlistData = {
    //             name: 'New Playlist',
    //             description: 'New playlist description',
    //             public: false,
    //         };

    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(playlistData),
    //         });

    //         if (response.ok) {
    //             const playlist = await response.json();
    //             console.log('New playlist created:', playlist);
    //         } else {
    //             console.error('Failed to create playlist:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error creating playlist:', error);
    //     }
    // };

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


    const getPlaylist = async () => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        try {
            const response = await axios({
                method: "GET",
                url: `https://api.spotify.com/v1/me/playlists`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Todo: Handle how we name these playlists and get those
            const playlists = response.data.items.slice(0, 3);
            setTempos(playlists);
            console.log(playlists)
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getPlaylist();
    }, []);
    console.log('playlists', tempos )
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* GET SPOTIFY PROFILE PIC 
            <Image
                source={require('./path_to_your_image/profile_pic.png')} 
                style={styles.profilePic}
                resizeMode="cover"
            /> */}
            </View>

            <Pressable onPress={handleLogout}>
                <Text>Logout</Text>
            </Pressable>

            <Text style={styles.text}>Current Tempos: </Text>

            <FlatList
                data={tempos}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={[styles.rectangle]}>
                            <Text style={[styles.tempoText]}>{item.name}</Text>
                            <Pressable>
                                <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate("Songs", {data: item})}>
                                    <Text style={styles.playButtonText}>Listen</Text>
                                </TouchableOpacity>
                            </Pressable>
                        </View>
                    </View>
                )}
                keyExtractor={(tempo) => tempo.id}
            />

            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Preference1')}>
                <Text style={[styles.buttonText]}>CREATE A TEMPO</Text>
            </TouchableOpacity>

        </View>
    );

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

export default Home;