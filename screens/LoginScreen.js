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

    const clientId = 'd6172fc8614948aeacebdcadf338de04';
    const clientSecret = '406c862d289c410691ef7df00acde84b';

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'd6172fc8614948aeacebdcadf338de04',
            scopes: [
                'user-read-email',
                'user-library-read',
                'user-read-recently-played',
                'user-top-read',
                'user-read-private',
                'user-read-email',
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
        const checkTokenValidity = async () => {
            await AsyncStorage.clear();

            const accessToken = await AsyncStorage.getItem("accessToken");
            const expirationDate = await AsyncStorage.getItem("accessTokenExpirationTime");
            console.log("Access token:", accessToken);
            console.log("Expiration time:", expirationDate);

            if(accessToken && expirationDate){
                const currentTime = new Date().getTime();
                if(currentTime < parseInt(expirationDate)){
                    navigation.navigate('Main');
            } else {
                // Token would be expired so we need to remove it from the async storage
                AsyncStorage.removeItem("accessToken");
                AsyncStorage.removeItem("accessTokenExpirationTime");
                AsyncStorage.removeItem("userId");
            }
            }
        }

        checkTokenValidity();
        },[])

    useEffect(() => {
        const handleAuthResponse = async () => {
            if (response?.type === 'success') {
                try {
                    const response = await fetch('https://accounts.spotify.com/api/token', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
                    });
              
                    if (!response.ok) {
                      throw new Error('Failed to obtain access token');
                    }
              
                    const responseData = await response.json();
                    const { access_token, expires_in } = responseData;
              
                    // Store access token and expiration time in AsyncStorage
                    await AsyncStorage.setItem('accessToken', access_token);
                    const expirationTime = new Date().getTime() + expires_in * 1000;
                    await AsyncStorage.setItem('accessTokenExpirationTime', expirationTime.toString());
              
                    console.log(responseData);
                    navigation.navigate('Main');

                    const userInfoResponse = await fetch('https://api.spotify.com/v1/me', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    });

                    console.log('User Info Response JSON:', await userInfoResponse.json());

                    if (!userInfoResponse.ok) {
                        console.log(access_token);
                        throw new Error('Failure to fetch user information');
                    }

                    const userInfoData = await userInfoResponse.json();
                    const userId = userInfoData.id;

                    // Store Spotify user ID in AsyncStorage
                    await AsyncStorage.setItem('userId', userId);

                    console.log('Spotify user ID stored:', userId);

                  } catch (error) {
                    console.error('Failed to fetch token:', error);
                  }
            }
        };

        handleAuthResponse();
    }, [response]);

    const authenticate = () => {
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
                    onPress={authenticate}
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