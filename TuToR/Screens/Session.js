import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SessionsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Scheduled');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Sessions</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Scheduled')} style={[styles.tab, activeTab === 'Scheduled' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'Scheduled' && styles.activeTabText]}>Scheduled</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Completed')} style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {activeTab === 'Scheduled' ? (
                    <Text style={styles.placeholderText}>No booked sessions</Text>
                ) : (
                    <Text style={styles.placeholderText}>No completed sessions</Text>
                )}
            </View>

            <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('FindTutor')}>
                <Text style={styles.requestButtonText}>Request a Tutor ?</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: width * 0.05,
    },
    header: {
        top:height*0.03,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    profileIcon: {
        marginLeft: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#23cbfb',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: height * 0.015, // 1.5% of screen height
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#23cbfb',
    },
    tabText: {
        fontSize: width * 0.045, // 4.5% of screen width
        color: '#000',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {

        fontSize: width * 0.045, // 4.5% of screen width
        color: '#23cbfb',
    },
    requestButton: {
        backgroundColor: '#23cbfb',
        borderRadius: width * 0.06, // 6% of screen width
        paddingVertical: height * 0.02, // 2% of screen height
        paddingHorizontal: width * 0.08, // 8% of screen width
        alignItems: 'center',
        bottom: height * 0.07,
        marginBottom: height * 0.02, // 2% of screen height
        alignSelf: 'center',
    },
    requestButtonText: {

        color: '#ffffff',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
});

export default SessionsScreen;
