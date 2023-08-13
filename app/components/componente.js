import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const ComponenteBrabo = (props) => {
    return (
        <View>
            <Text style={styles.text}>{props.nome} Brabo (a)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        color: 'pink',
    }
});

export default ComponenteBrabo;