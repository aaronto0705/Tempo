import React, { useState } from 'react';
import { View, Picker, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Preference4() {

    const navigation = useNavigation();

    const [selectedGenre, setSelectedGenre] = useState('Pop');

    return (
        <View>
            <Picker
                selectedValue={selectedGenre}
                onValueChange={(itemValue) =>
                setSelectedGenre(itemValue)
            }>
                <Picker.Item label="Ambient" value="ambient"/>
                <Picker.Item label="Chill" value="chill"/>
                <Picker.Item label="Country" value="country"/>
                <Picker.Item label="Dance" value="dance"/>
                <Picker.Item label="Electronic" value="electronic"/>
                <Picker.Item label="Groove" value="groove"/>
                <Picker.Item label="House" value="house"/>
                <Picker.Item label="Indie" value="indie"/>
                <Picker.Item label="Metal" value="metal"/>
                <Picker.Item label="Pop" value="ambient"/>
            </Picker>


            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Home')}>
                {/* Call create playlist here */}
                <Text style={[styles.nextButtonText]}>Create</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#4C7F7E', 
      width: '100%',
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 10,
    },
    nextButtonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
  });


export default Preference4;