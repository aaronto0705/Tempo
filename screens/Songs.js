import { StyleSheet, Text, View, Button, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-web';
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";



const Songs = () => {

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
                    offset: { position: 0 }
                })
            })
            console.log(playback)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <LinearGradient colors={['#000000', '#000000']} style={{ flex: 1 }}>
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
        </LinearGradient>
    )
}

export default Songs
