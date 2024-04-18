import { encode as btoa } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spotifyCredentials } from './Credentials';

// Function to store user data in AsyncStorage
const setUserData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('AsyncStorage Error:', error);
    throw error;
  }
};

// Function to retrieve user data from AsyncStorage
const getUserData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('AsyncStorage Error:', error);
    throw error;
  }
};

export const getTokens = async (authorizationCode, redirectUri) => {
  try {
    const credsB64 = btoa(`${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`);
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    // Make sure to generate a code verifier and code challenge prior to this step
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credsB64}`,
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${encodeURIComponent(
        redirectUri)}`,
    });

    const responseJson = await response.json();
    console.log('Token Response:', responseJson);

    const { access_token, refresh_token, expires_in } = responseJson;

    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error('Token Error:', error);
    throw error;
  }
};

export const refreshTokens = async () => {
  try {
    const refreshToken = await getUserData('refreshToken');
    const credsB64 = btoa(`${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      // Handle error appropriately
      console.error('Token Refresh Error:', responseJson.error);
    } else {
      const { access_token, refresh_token, expires_in } = responseJson;
      const expirationTime = new Date().getTime() + expires_in * 1000;
      await setUserData('accessToken', access_token);
      if (refresh_token) {
        await AsyncStorage.setItem('refreshToken', refresh_token);
      }
      await setUserData('expirationTime', expirationTime);
    }
  } catch (error) {
    console.error('Token Refresh Error:', error);
    throw error;
  }
};