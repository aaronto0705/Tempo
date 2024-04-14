import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Preference1() {

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

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>How long do you want to run?</Text>
            <View style={styles.inputContainer}>
                <Text>Hours:</Text>
                <TextInput
                style={styles.input}
                /*save value*/ 
                value={hours.toString()}
                onChangeText={changeHours}
                keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Minutes:</Text>
                <TextInput
                style={styles.input}
                /*save value*/ 
                value={minutes.toString()}
                onChangeText={changeMinutes}
                keyboardType="numeric"
                />
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Preference2')}>
                <Text style={[styles.buttonText]}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor: 'white',
    },
    questionText: {
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginHorizontal: 5,
    },
    buttonContainer: {
        backgroundColor: '#4C7F7E', 
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
      },
    buttonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
})

export default Preference1;