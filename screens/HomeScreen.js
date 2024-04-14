import { Text, Pressable, SafeAreaView } from 'react-native'
import  React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = () => {
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [currTrack, setCurrTrack] = useState(null);
    
    useEffect(() => {
        async function getProfile() {
            const access_token = await AsyncStorage.getItem('accessToken');
            try {
                const response = await fetch("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                const data = await response.json();
                setUserProfile(data);
                setLoading(false);
                console.log(data);
                return data;
            } catch (err) {
                setLoading(false);
            }
        }
        getProfile();
    }, []);
    console.log(userProfile)
    if (loading) {
        return (

            <SafeAreaView>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text>Logout</Text>
                </Pressable>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView>
            <Text>HomeScreen</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text>Logout</Text>
            </Pressable>
            {userProfile && (
                <Text>{JSON.stringify(userProfile)}</Text>
            )}
        </SafeAreaView>
    );
}

export default HomeScreen
