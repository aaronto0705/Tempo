import React, { useEffect } from 'react';
import { Text, View, SafeAreaView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '0619c1f2aa5d4d97b2da4d1a2926cf73',
            scopes: [
                'user-read-email',
                'user-library-read',
                'user-read-recently-played',
                'user-top-read',
                'playlist-read-private',
                'playlist-read-collaborative',
                'playlist-modify-public'
            ],
            redirectUri: makeRedirectUri({
                useProxy: true,
            }),
        },
        discovery
    );

    const navigation = useNavigation();

    useEffect(() => {
        const handleAuthResponse = async () => {
            if (response?.type === 'success') {
                const { access_token } = response.params;

                // Store the access token in AsyncStorage
                await AsyncStorage.setItem('accessToken', access_token);

                // Navigate to Main screen
                navigation.navigate('Main');
            }
        };

        handleAuthResponse();
    }, [response]);

    const handlePress = () => {
        // Initiate Spotify authentication
        promptAsync();
    };

    return (
        <LinearGradient colors={["#587E7D", "#587E7D"]} style={{ flex: 1 }}>
            <SafeAreaView>
                <View style={{ height: 80 }} />
                <View style={{ alignItems: "center" }}>
                    <Image
                        source={require('../images/tempo_logo.png')}
                        style={{ width: 200, height: 200 }}
                    />
                </View>
                <Text
                    style={{
                        color: "white",
                        fontSize: 40,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 40,
                    }}>
                    Tempo
                </Text>
                <View style={{ height: 80 }} />
                <Pressable
                    onPress={handlePress}
                    style={{
                        backgroundColor: "#1DB954",
                        padding: 10,
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 300,
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: 10,
                        flexDirection: "row"
                    }}>
                    <Entypo
                        style={{ textAlign: "center", marginRight: 10 }}
                        name="spotify"
                        size={30}
                        color="white" />
                    <Text>Sign In with Spotify</Text>
                </Pressable>
            </SafeAreaView>
        </LinearGradient>
    );
}

export default LoginScreen;
