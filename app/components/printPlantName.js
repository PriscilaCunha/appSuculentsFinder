import React from "react";
import { Text, StyleSheet } from 'react-native';

const printPlantName = (props) => {
    return (
        <Text style={styles.title}>O nome da planta é: {props.nome}</Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 16,
        paddingVertical: 8,
    },
});

export default printPlantName;