import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from 'react-native-numeric-input';


function Preference1() {

    const navigation = useNavigation();

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const changeHours = (text) => {
        const hoursInput = parseInt(text) || 0;
        setHours(hoursInput);
    };

    const changeMinutes = (text) => {
        const minutesInput = parseInt(text) || 0;
        setMinutes(minutesInput);
    }

    const handleNextPress = async () => {
        try {
            const hoursString = hours.toString();
            const minutesString = minutes.toString();
            await AsyncStorage.setItem('Preference1h', hoursString);
            await AsyncStorage.setItem('Preference1m', minutesString);
            navigation.navigate('Preference2');
        } catch (error) {
            console.error('Error storing hours and minutes:', error);
        }
      };
      

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>How long do you want to run for?</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Hours</Text>
                <NumericInput 
                    onChange={value => changeHours(value)} 
                    textColor='white'
                    rounded
                    minValue={0}
                    maxValue={24}
                    containerStyle={styles.numericInputContainer}
                    />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Minutes</Text>
                <NumericInput 
                    onChange={value => changeMinutes(value)} 
                    textColor='white'
                    rounded
                    minValue={0}
                    maxValue={59}
                    containerStyle={styles.numericInputContainer}
                    />
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
                <Text style={[styles.buttonText]}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#4C7F7E',
    },
    questionText: {
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20,
        color: 'white'
    },
    numericInputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    label: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'medium',
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: 30,
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
})

export default Preference1;