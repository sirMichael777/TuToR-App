import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TutorHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={width * 0.06} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="person-outline" size={width * 0.06} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Welcome to Your Tutoring Hub!</Text>
                    <Text style={styles.cardText}>
                        Empower minds and shape futures. Here, you can manage your schedule and track your progress as you guide the next generation to success. Let's make today a great day for learning!
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification Summary</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.viewAll}>view all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>You're all caught up!</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming sessions</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.viewAll}>view all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <Ionicons name="calendar-outline" size={width * 0.06} color="white" />
                    <Text style={styles.cardTitle}>No scheduled sessions</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Earnings Overview</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.viewAll}>view all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardText}>
                        You're all set to start earning! Once you've completed your first tutoring session, your earnings will appear here. Keep an eye out for new student requests and start helping others succeed.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: width * 0.05, // 5% of screen width
        paddingTop: height * 0.05, // 5% of screen height
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02, // 2% of screen height
    },
    headerText: {
        fontSize: width * 0.06, // 6% of screen width
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    profileIcon: {
        marginLeft: width * 0.04, // 4% of screen width
    },
    content: {
        flex: 1,
    },
    card: {
        backgroundColor: '#001F3F',
        borderRadius: width * 0.05, // 5% of screen width
        padding: width * 0.05, // 5% of screen width
        marginBottom: height * 0.02, // 2% of screen height
        alignItems: 'center',
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.01, // 1% of screen height
    },
    cardText: {
        color: '#ffffff',
        fontSize: width * 0.04, // 4% of screen width
        textAlign: 'center',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.015, // 1.5% of screen height
    },
    sectionTitle: {
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
    viewAll: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: width * 0.04, // 4% of screen width
    },
});

export default TutorHomeScreen;
