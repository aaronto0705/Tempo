import { StyleSheet, Text, View, Pressable, SafeAreaView, Linking } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
    

    return (
        <SafeAreaView>
            <Text>HomeScreen</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text>Logout</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})