import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Preference0() {

    const navigation = useNavigation();

    const [playlistName, setPlaylistName] = useState('');

    const handleInputChange = (text) => {
        setPlaylistName(text);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Playlist Name: </Text>
        <TextInput
        style={styles.input}
        value={playlistName} 
        onChangeText={handleInputChange} 
        placeholder="Playlist Name"
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Preference1')}>
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