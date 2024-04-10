import { Text, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
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
