import React from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';

const Home = () => {

    const tempos = [
        { id: '1', name: 'playlist 1' },
        { id: '2', name: 'playlist 2' },
        { id: '3', name: 'playlist 3' }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
            {/* <Image
                source={require('./path_to_your_image/profile_pic.png')} 
                style={styles.profilePic}
                resizeMode="cover"
            /> */}
            </View>

            <Text style={styles.text}>Current Tempos: </Text>

            <FlatList
                data={tempos}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                <View style={[styles.rectangle]}>
                    <Text style={[styles.tempoText]}>{item.name}</Text>
                </View>
                )}
                keyExtractor={(tempo) => tempo.id}
            />

            <TouchableOpacity style={styles.buttonContainer}>
                <Text style={[styles.buttonText]}>CREATE A TEMPO</Text>
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
      backgroundColor: '#14333F',
    },
    profileContainer: {
        width: 50,
        height: 50,
        borderRadius: 50, 
        backgroundColor: "white",
        marginBottom: 70,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    text: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 20,
    },
    rectangle: {
      backgroundColor: 'white',
      width: 300,
      height: 50,
      marginVertical: 5,
      borderRadius: 10,
    },
    tempoText: {
        color: 'black', 
        fontSize: 16, 
        padding: 15,
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
  });
  
  export default Home;