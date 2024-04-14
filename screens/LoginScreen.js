import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, SafeAreaView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { spotifyCredentials, scopesArr } from './Credentials';
import { getTokens, refreshTokens } from './SpotifyAuth'; 
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();

    const redirectUri = makeRedirectUri({
        scheme: 'exp',
        path: "/spotify-auth-callback"
    });

    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const [, , promptAsync] = useAuthRequest({
        clientId: spotifyCredentials.clientId,
        scopes: scopesArr,
        redirectUri: redirectUri,   
        usePKCE: false,
    }, discovery);

    const handleAuthentication = async () => {
        const result = await promptAsync();

        if (result.type === 'success') {
            const authorizationCode = result.params.code;
            try {
                const tokens = await getTokens(authorizationCode, redirectUri);
                await storeTokens(tokens); 
                navigation.navigate('Home');
            } catch (error) {
                console.error('Token Retrieval Error:', error);
            }
        } else {
        console.error('Authentication Error:', result.error);
        }
    };

    const storeTokens = async (tokens) => {
        await AsyncStorage.setItem('accessToken', tokens.access_token);
        await AsyncStorage.setItem('refreshToken', tokens.refresh_token);
        const expirationTime = new Date().getTime() + tokens.expires_in * 1000;
        await AsyncStorage.setItem('expirationTime', expirationTime.toString());
    };

    const checkTokenValidity = async () => {
        const tokenExpirationTime = parseInt(await AsyncStorage.getItem('expirationTime'));
        if (!tokenExpirationTime) {
            return;
        }

        if (new Date().getTime() > tokenExpirationTime) {
            await refreshTokens(); // Refresh tokens if expired
            return await AsyncStorage.getItem('accessToken'); 
        } else {
            return await AsyncStorage.getItem('accessToken'); 
        }
    };

    useEffect(() => {
        const authenticateUser = async () => {
            const accessToken = await checkTokenValidity();

            if (accessToken) {
                console.log('User is authenticated with access token:', accessToken);
                navigation.navigate('Home');
                console.log('Navigated to home');
            }
        };

        authenticateUser();
    }, []); // Run once on component mount

    return (
        <LinearGradient colors={['#587E7D', '#587E7D']} style={{ flex: 1 }}>
        <SafeAreaView>
            <View style={{ height: 80 }} />
            <View style={{ alignItems: 'center' }}>
            <Image
                source={require('../images/tempo_logo.png')}
                style={{ width: 200, height: 200 }}
            />
            </View>
            <Text
            style={{
                color: 'white',
                fontSize: 40,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 40,
            }}>
            Tempo
            </Text>
            <View style={{ height: 80 }} />
            <Pressable
            onPress={handleAuthentication}
            style={{
                backgroundColor: '#1DB954',
                padding: 10,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 300,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 10,
                flexDirection: 'row',
            }}>
            <Entypo style={{ textAlign: 'center', marginRight: 10 }} name="spotify" size={30} color="white" />
            <Text>Sign In with Spotify</Text>
            </Pressable>
        </SafeAreaView>
        </LinearGradient>
    );
    };

export default LoginScreen;