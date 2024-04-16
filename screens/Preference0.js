import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Preference0() {

    const navigation = useNavigation();

    const [playlistName, setPlaylistName] = useState('');

    const handleInputChange = (text) => {
        setPlaylistName(text);
    }

    const handleNextPress = async () => {
      try {
        await AsyncStorage.setItem('Preference0', playlistName);
        navigation.navigate('Preference1');
      } catch (error) {
        console.error('Error storing playlist name:', error);
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Playlist Name: </Text>
        <TextInput
        style={styles.input}
        value={playlistName} 
        onChangeText={handleInputChange} 
        placeholder="Tempo Name"
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
            <Text style={[styles.buttonText]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
    },
  });
  
  export default Preference0;