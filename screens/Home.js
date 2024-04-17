import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { firebaseConfig } from './Credentials';
import { useFocusEffect } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


function Home() {
    
    const [tempos, setTempos] = useState([]);
    const [playlistImgs, setPlaylistImgs] = useState({});
    const [, setUserData] = useState({});
    const [profilePic, setProfilePic] = useState('')
    
    const navigation = useNavigation();

    async function saveUserData(userId, userData) {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef, userData);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserData(docSnap.data());
                return;
            } else {
                throw new Error("Document does not exist");
            }
        } catch (e) {
            console.log(e);
        }
        try {
            const docRef = doc(db, 'users', userId);
            await setDoc(docRef, userData);
            console.log("Successfully set user data in Firestore", userId)
        } catch (e){
            console.log(e)
        }
    }

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
                    saveUserData(userData.id, userData);
                    await AsyncStorage.setItem('userId', userData.id);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    setProfilePic(userData.images[0]?.url);
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
            const userId = await AsyncStorage.getItem('userId');
            const playlists = response.data;
            try {
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const firebasePlaylists = docSnap.data().playlists
                    const matchingPlaylists = playlists.items.filter(item => firebasePlaylists.includes(item.id));
                    setTempos(matchingPlaylists);

                    const urls = {}
                    await Promise.all(matchingPlaylists.map(async (item) => {
                        const url = await getImageURI(item.id);
                        urls[item.id] = url;
                    }));
                    setPlaylistImgs(urls);
                } else {
                    console.log("No such document! Please sign in again")
                }
            } catch (e) {
                console.log(e)
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    async function getImageURI(id) {
        const accessToken = await AsyncStorage.getItem("accessToken");
        try {
            const response = await axios({
                method: "GET",
                url: `https://api.spotify.com/v1/playlists/${id}/images`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('image',  response.data[0].url)
            return response.data[0].url;
        } catch (err) {
            console.log(err.message);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getPlaylist();
            return
        }, [])
    );
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{uri: profilePic}} 
                    style={styles.profilePic}
                    resizeMode="cover"
                /> 
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
                            <Image source={{ uri: playlistImgs[item.id] }} style={{ width: 50, height: 50 }} />
                            <Text style={[styles.tempoText]}>{item.name}</Text>
                            <Pressable>
                                <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate("Songs", {data: item, imageUri: playlistImgs[item.id]})}>
                                    <Text style={styles.playButtonText}>Listen</Text>
                                </TouchableOpacity>
                            </Pressable>
                        </View>
                    </View>
                )}
                keyExtractor={(tempo) => tempo.id}
            />

            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Preference0')}>
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
        width: 60,
        height: 60,
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