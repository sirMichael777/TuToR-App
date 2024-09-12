import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { firestoreDB } from "../Config/firebaseConfig";
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import MessageListener from "../Chat/MessageListener";

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user);
    const [upcomingSession, setUpcomingSession] = useState(null); // Store only one upcoming session

    // Fetch upcoming sessions for the current user (Student) and filter to show only scheduled ones
    useEffect(() => {
        const fetchUpcomingSession = async () => {
            try {
                if (currentUser.role === 'Student') {
                    const q = query(
                        collection(firestoreDB, 'Bookings'),
                        where('student._id', '==', currentUser._id),
                        where('status', '==', 'scheduled'),
                        orderBy('startTime'), // Order by start time
                        limit(1) // Fetch only the first one
                    );

                    const querySnapshot = await getDocs(q);
                    const session = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))[0]; // Get the first (and only) session

                    setUpcomingSession(session);
                }
            } catch (error) {
                console.error("Error fetching upcoming session:", error);
            }
        };

        fetchUpcomingSession();
    }, [currentUser]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    // Conditionally render for students only
    if (currentUser.role !== 'Student') {
        return (
            <View style={styles.container}>
                <Text style={styles.errorMessage}>
                    This screen is for students only. Please navigate to your dashboard.
                </Text>
                <TouchableOpacity
                    style={styles.tutorButton}
                    onPress={() => navigation.navigate('TutorDashboard')}
                >
                    <Text style={styles.tutorButtonText}>Go to Tutor Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MessageListener navigation={navigation} />
            <View style={styles.header}>
                <Text style={styles.headerText}>Home</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        {currentUser?.imageUrl ? (
                            <Image
                                source={{ uri: currentUser.imageUrl }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.balanceText}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(currentUser.Balance)} ZAR</Text>

            <View style={styles.findTutorSection}>
                <Text style={styles.findTutorText}>
                    Connecting UCT students with top tutors
                </Text>
                <Image source={require('../assets/images/background-image.png')} style={styles.backgroundImage} />
                <TouchableOpacity style={styles.findTutorButton} onPress={() => navigation.navigate('FindTutor')}>
                    <Text style={styles.findTutorButtonText}>Find A Tutor</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sessionsSection}>
                <View style={styles.sessionsHeader}>
                    <Text style={styles.sessionsText}>Upcoming session</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SessionsScreen')}>
                        <Text style={styles.viewAllText}>view all</Text>
                    </TouchableOpacity>
                </View>

                {upcomingSession ? (
                    <View style={styles.sessionCard}>
                        <Text>Course: {upcomingSession.course}</Text>
                        <Text>
                            Start: {new Date(upcomingSession.startTime.seconds * 1000).toLocaleString()}
                        </Text>
                        <Text>
                            End: {new Date(upcomingSession.endTime.seconds * 1000).toLocaleString()}
                        </Text>
                        <Text>Status: {upcomingSession.status}</Text>
                    </View>
                ) : (
                    <View style={styles.noSessionsCard}>
                        <Image source={require('../assets/Calendar.png')} style={styles.calendarIcon} />
                        <Text style={styles.noSessionsText}>No upcoming scheduled sessions</Text>
                    </View>
                )}
            </View>
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
        marginTop: height * 0.04,
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
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 15,
    },
    balanceText: {
        color: '#008000',
        marginTop: height * 0.02,
    },
    balanceAmount: {
        color: '#008000',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    findTutorSection: {
        backgroundColor: '#23cbfb',
        borderRadius: width * 0.05,
        overflow: 'hidden',
        marginVertical: height * 0.03,
        position: 'relative',
    },
    backgroundImage: {
        width: '130%',
        top: height * 0.025,
        right: width * 0.085,
        height: height * 0.28,
        resizeMode: 'cover',
    },
    findTutorText: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: height * 0.015,
    },
    findTutorButton: {
        position: 'absolute',
        bottom: height * 0.02,
        left: '30%',
        backgroundColor: '#000',
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.07,
        borderRadius: width * 0.02,
    },
    findTutorButtonText: {
        color: '#ffffff',
        fontSize: width * 0.04,
    },
    sessionsSection: {
        flex: 1,
    },
    sessionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.015,
    },
    sessionsText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    viewAllText: {
        color: 'blue',
        fontSize: width * 0.035,
    },
    sessionCard: {
        backgroundColor: '#007AFF',
        padding: height * 0.02,
        borderRadius: width * 0.03,
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    noSessionsCard: {
        backgroundColor: '#007AFF',
        padding: height * 0.02,
        borderRadius: width * 0.03,
        alignItems: 'center',
        flexDirection: 'row',
    },
    calendarIcon: {
        width: width * 0.08,
        height: width * 0.08,
        marginRight: width * 0.03,
    },
    noSessionsText: {
        color: '#ffffff',
        fontSize: width * 0.04,
    },
    errorMessage: {
        fontSize: width * 0.05,
        textAlign: 'center',
        marginVertical: height * 0.1,
        color: 'red',
    },
    tutorButton: {
        backgroundColor: '#007AFF',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.1,
        borderRadius: width * 0.03,
        alignSelf: 'center',
    },
    tutorButtonText: {
        color: '#ffffff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
