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
        <Text style={styles.text}>Tempo Name: </Text>
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
      backgroundColor: '#4C7F7E',
    },
    input: {
      height: 50,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 15,
      marginBottom: 50,
      backgroundColor: 'white',
      borderRadius: 15,
      fontsize: 16,
    },
    text: {
      fontSize: 20,
      paddingBottom: 20,
      fontWeight: 'bold',
      color: 'white',
    },
  buttonContainer: {
      backgroundColor: '#14333F',
      width: '50%',
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 15,
      marginBottom: 30,
  },
  buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      margin: 10,
  },
  });
  
  export default Preference0;