import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Preference3() {
  const [selectedOption, setSelectedOption] = useState('constant'); 

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.questionText}>Pace during the run:</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedOption === 'slowDown' && styles.selectedButton]}
          onPress={() => handleOptionPress('slowDown')}
        >
          <Text style={[styles.buttonText, selectedOption === 'slowDown' && styles.selectedButtonText]}>Slow down</Text>
        </TouchableOpacity>
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
      </View>
      <TouchableOpacity style={styles.buttonContainer} >
                <Text style={[styles.createButtonText]}>Create</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 20,
    },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#4C7F7E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#4C7F7E', 
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 60,
  },
createButtonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
},
});

export default Preference3;

