import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FolhaVerde</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Camera')} >
                <Icon
                    name="camera"
                    size={20}
                    color="white"
                />
                <Text style={styles.buttonText}>Identificar Planta</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Dicas')} >
                <Icon
                    name="camera"
                    size={20}
                    color="white"
                />
                <Text style={styles.buttonText}>Cuidados Por Espécie</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 16,
        paddingVertical: 8,
    },
    button: {
        alignItems: "center",
        backgroundColor: "green",
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        minWidth: 150,
        height: 50,
        borderRadius: 50,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 10
    },
    buttonText: {
        fontSize: 16,
        color: "#FFFFFF",
    }
});

export default Home;
