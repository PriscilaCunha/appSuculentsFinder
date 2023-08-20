import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import IdentifyPlant from '../components/IdentifyPlant';

const IdentifyScreen = ({ route }) => {
    const { imageUri } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.sourceImage} />

            <Text style={styles.titleH2}>Resultados</Text>
            <Text style={styles.paragraph}>Veja as plantas semelhantes</Text>

            <IdentifyPlant imageUri={imageUri} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F6',
        flex: 1,
        padding: 20,
        alignItems: 'stretch',
    },

    sourceImage: {
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 20,
        marginBottom: 20,
    },

    titleH2: {
        color: '#030712',
        fontFamily: 'DMSerifDisplay-Regular',
        fontSize: 26,
    },
    paragraph: {
        color: '#6B7280',
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        marginBottom: 20,
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 24,
        paddingVertical: 12,
        height: 50,
        backgroundColor: "#FFB200",
        borderRadius: 50,
        margin: 10,
    },
    buttonText: {
        color: "#030712",
        fontSize: 14,
        fontFamily: 'Inter-Bold',
    },
    buttonIcon: {
        color: "#030712",
        fontSize: 20,
    }
});

export default IdentifyScreen;
