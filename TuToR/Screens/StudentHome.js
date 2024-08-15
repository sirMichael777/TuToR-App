import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>


            <Text style={styles.balanceText}>Current Balance</Text>
            <Text style={styles.balanceAmount}>0.0 ZAR</Text>

            <View style={styles.findTutorSection}>
                <Text style={styles.findTutorText}>Connecting UCT students with top tutors</Text>
                <Image source={require('../assets/images/background-image.png')} style={styles.backgroundImage} />

                <TouchableOpacity style={styles.findTutorButton} onPress={() => navigation.navigate('FindTutor')}>
                    <Text style={styles.findTutorButtonText}>Find A Tutor</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sessionsSection}>
                <View style={styles.sessionsHeader}>
                    <Text style={styles.sessionsText}>Upcoming sessions</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.viewAllText}>view all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.noSessionsCard}>
                    <Image source={require('../assets/Calendar.png')} style={styles.calendarIcon} />
                    <Text style={styles.noSessionsText}>No booked sessions</Text>
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // 5% of screen width
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
    balanceText: {

        color: '#008000',
        marginTop: height * 0.01, // 1% of screen height
    },
    balanceAmount: {

        color: '#008000',
        fontWeight: 'bold',
        fontSize: width * 0.05, // 5% of screen width
    },
    findTutorSection: {
        backgroundColor: '#23cbfb',
        borderRadius: width * 0.05, // 5% of screen width
        overflow: 'hidden', // Ensure the image doesn't overflow the container's rounded corners
        marginVertical: height * 0.03, // 3% of screen height
        position: 'relative', // Allows absolute positioning of the button
    },
    backgroundImage: {
        width: '130%',
        top: height * 0.025, // 2.5% of screen height
        right: width * 0.085, // 8% of screen width
        height: height * 0.28, // 28% of screen height
        resizeMode: 'cover', // Ensures the image covers the entire area
    },
    findTutorText: {
        fontSize: width * 0.055, // 5.5% of screen width
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: height * 0.015, // 1.5% of screen height
    },
    findTutorButton: {
        position: 'absolute',
        bottom: height * 0.02, // 2% of screen height
        left: '30%',
        backgroundColor: '#000',
        paddingVertical: height * 0.01, // 1% of screen height
        paddingHorizontal: width * 0.07, // 7% of screen width
        borderRadius: width * 0.02, // 2% of screen width
    },
    findTutorButtonText: {

        color: '#ffffff',
        fontSize: width * 0.04, // 4% of screen width
    },
    sessionsSection: {
        flex: 1,
    },
    sessionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.015, // 1.5% of screen height
    },
    sessionsText: {
        fontSize: width * 0.04, // 4% of screen width
        fontWeight: 'bold',
    },
    viewAllText: {
        color: 'blue',
        fontSize: width * 0.035, // 3.5% of screen width
    },
    noSessionsCard: {
        backgroundColor: '#007AFF',
        padding: height * 0.02, // 2% of screen height
        borderRadius: width * 0.03, // 3% of screen width
        alignItems: 'center',
        flexDirection: 'row', // To align the icon and text horizontally
    },
    calendarIcon: {
        width: width * 0.08, // 8% of screen width
        height: width * 0.08, // 8% of screen width
        marginRight: width * 0.03, // 3% of screen width
    },
    noSessionsText: {

        color: '#ffffff',
        fontSize: width * 0.04, // 4% of screen width
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default HomeScreen;
