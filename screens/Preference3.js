import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Preference3() {

  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState('constant'); 

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleNextPress = async () => {
    try {
      await AsyncStorage.setItem('Preference3', selectedOption);
      navigation.navigate('Preference4');
    } catch (error) {
      console.error('Error storing playlist name:', error);
    }
  }

  return (
    <View style={styles.container}>
        <Text style={styles.questionText}>Pace during the run:</Text>
        <Text></Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedOption === 'slowDown' && styles.selectedButton]}
          onPress={() => handleOptionPress('slowDown')}
        >
          <Text style={[styles.buttonText, selectedOption === 'slowDown' && styles.selectedButtonText]}>Slow down</Text>

        </TouchableOpacity>
        {selectedOption === 'slowDown' && (
        <Text style={styles.description1}>Decrease pace by 25%</Text>
        )}
        <TouchableOpacity
          style={[styles.button, selectedOption === 'constant' && styles.selectedButton]}
          onPress={() => handleOptionPress('constant')}
        >
          <Text style={[styles.buttonText, selectedOption === 'constant' && styles.selectedButtonText]}>Constant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedOption === 'speedUp' && styles.selectedButton]}
          onPress={() => handleOptionPress('speedUp')}
        >
          <Text style={[styles.buttonText, selectedOption === 'speedUp' && styles.selectedButtonText]}>Speed up</Text>
        </TouchableOpacity>
        {selectedOption === 'speedUp' && (
        <Text style={styles.description2}>Increase pace by 25%</Text>
        )}
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
                <Text style={[styles.nextButtonText]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#4C7F7E',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionText: {
    color: 'white',
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4C7F7E',
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#14333F',
  },
  description1: {
    paddingTop: 20,
    width: '50%',
    position: 'absolute',
    paddingBottom: 100,
    top: '70%',
    color: 'white',
  },
  description2: {
    paddingTop: 20,
    position: 'absolute',
    top: '70%', 
    right: 0, 
    color: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#14333F',
    width: '50%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 20,
  },
  nextButtonText: {
      color: 'white', 
      fontSize: 20, 
      fontWeight: 'bold', 
      margin: 10,
  },
});

export default Preference3;

