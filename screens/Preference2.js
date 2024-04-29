import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from 'react-native-numeric-input';

// Collects and stores the desired pace
function Preference2() {

    const navigation = useNavigation();

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const changeMinutes = (text) => {
        const minutesInput = parseInt(text) || 0;
        setMinutes(minutesInput);
    }
    const changeSeconds = (text) => {
        const secondsInput = parseInt(text) || 0;
        setSeconds(secondsInput);
    }

    const handleNextPress = async () => {
        try {
            const minutesString = minutes.toString();
            const secondsString = seconds.toString();
            await AsyncStorage.setItem('Preference2m', minutesString);
            await AsyncStorage.setItem('Preference1s', hoursString);
            navigation.navigate('Preference3');
        } catch (error) {
            console.error('Error storing minutes per mile pace:', error);
        }
      }

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>Average Minutes per Mile?</Text>
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
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Seconds</Text>
                <NumericInput 
                    onChange={value => changeSeconds(value)} 
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

export default Preference2;