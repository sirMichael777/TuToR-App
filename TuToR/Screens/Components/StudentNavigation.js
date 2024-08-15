import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const BottomNavigation = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
                <Ionicons name="home-outline" size={width * 0.08} color="#001F3F" />
                <Text style={styles.label}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('FindTutor')} style={styles.navItem}>
                <Ionicons name="search-outline" size={width * 0.08} color="#001F3F" />
                <Text style={styles.label}>Find Tutor</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Sessions')} style={styles.navItem}>
                <Ionicons name="time-outline" size={width * 0.08} color="#001F3F" />
                <Text style={styles.label}>Sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.navItem}>
                <Ionicons name="chatbubbles-outline" size={width * 0.08} color="#001F3F" />
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
        paddingVertical: height * 0.015, // 1.5% of screen height
        borderTopWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        width: '100%',
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

export default BottomNavigation;
