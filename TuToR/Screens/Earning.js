import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const EarningsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Earnings</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={width * 0.08} color="#001F3F" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="person-circle-outline" size={width * 0.08} color="#001F3F" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.earningsOverview}>
                <Text style={styles.earningsOverviewText}>Earnings Overview</Text>
                <TouchableOpacity onPress={() => { /* Implement 'view all' navigation */ }}>
                    <Text style={styles.viewAllText}>view all</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.earningsCard}>
                <Text style={styles.cardText}>
                    You're all set to start earning! Once you've completed your first tutoring session, your earnings will appear here. Keep an eye out for new student requests and start helping others succeed.
                </Text>
            </View>

            <View style={styles.bottomNavigation}>
                {/* Include your BottomNavigation component here */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // 5% padding
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {

        fontSize: width * 0.06, // 6% of screen width
        fontWeight: 'bold',
        color: '#001F3F',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    earningsOverview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: height * 0.03, // 3% of screen height
    },
    earningsOverviewText: {

        fontSize: width * 0.05, // 5% of screen width
        fontWeight: 'bold',
        color: '#001F3F',
    },
    viewAllText: {

        fontSize: width * 0.04, // 4% of screen width
        color: '#007BFF',
    },
    earningsCard: {
        backgroundColor: '#001F3F',
        borderRadius: width * 0.05, // 5% of screen width
        padding: width * 0.05, // 5% of screen width
        marginBottom: height * 0.02, // 2% of screen height
        alignItems: 'center',
    },
    cardText: {

        fontSize: width * 0.045, // 4.5% of screen width
        color: '#ffffff',
        textAlign: 'center',
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default EarningsScreen;
