import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TutorNavigation = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
                <Ionicons name="home" size={width * 0.06} color="#001F3F" />
                <Text style={styles.label}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Sessions')} style={styles.navItem}>
                <Ionicons name="time" size={width * 0.06} color="#001F3F" />
                <Text style={styles.label}>Sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Earnings')} style={styles.navItem}>
                <FontAwesome5 name="hand-holding-usd" size={width * 0.06} color="#001F3F" />
                <Text style={styles.label}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.navItem}>
                <Ionicons name="chatbubbles" size={width * 0.06} color="#001F3F" />
                <Text style={styles.label}>Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        paddingVertical: height * 0.02, // 2% of screen height
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    navItem: {
        alignItems: 'center',
    },
    label: {

        fontSize: width * 0.03, // 3% of screen width
        color: '#001F3F',
        marginTop: height * 0.005, // 0.5% of screen height
    },
});

export default TutorNavigation;
