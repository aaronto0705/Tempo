import { Text, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    const handleCreatePlaylist = () => {
        console.log('Create Playlist button pressed');
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>HomeScreen</Text>
        <Pressable style={{ marginVertical: 20 }} onPress={handleCreatePlaylist}>
            <Text>Create Playlist</Text>
        </Pressable>
        <Pressable onPress={handleLogout}>
            <Text>Logout</Text>
        </Pressable>
        </SafeAreaView>
    );
};

export default HomeScreen;
