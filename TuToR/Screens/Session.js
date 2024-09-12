import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig';
import { useSelector } from 'react-redux';
import BookingCard from '../FindTutor/BookingCard';  // Assuming you are using BookingCard component
import defaultImage from '../assets/images/defaultImage.jpeg';  // Assuming you have a default image

const { width, height } = Dimensions.get('window');

const Session = ({ navigation }) => {
    const [sessions, setSessions] = useState([]);
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [ongoingSessions, setOngoingSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Scheduled');
    const currentUser = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!currentUser) return;

            const now = new Date(); // Get current date and time

            try {
                let sessionsQuery;

                // Adjust query based on role
                if (currentUser.role === 'Student') {
                    // Fetch sessions where the student ID matches the current user
                    sessionsQuery = query(
                        collection(firestoreDB, 'Bookings'),
                        where('student._id', '==', currentUser._id)
                    );
                } else if (currentUser.role === 'Tutor') {
                    // Fetch sessions where the tutor ID matches the current user
                    sessionsQuery = query(
                        collection(firestoreDB, 'Bookings'),
                        where('tutor._id', '==', currentUser._id)
                    );
                }

                const sessionsSnapshot = await getDocs(sessionsQuery);
                const allSessions = sessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                // Categorize sessions into Scheduled, Ongoing, and Completed based on current time
                const scheduled = [];
                const ongoing = [];
                const completed = [];

                allSessions.forEach((session) => {
                    const startTime = session.startTime.toDate();
                    const endTime = session.endTime.toDate();

                    if (endTime < now) {
                        completed.push(session);  // Session has ended
                    } else if (startTime <= now && endTime >= now) {
                        ongoing.push(session);  // Session is ongoing
                    } else {
                        scheduled.push(session);  // Session is scheduled for the future
                    }
                });

                setScheduledSessions(scheduled);
                setOngoingSessions(ongoing);
                setCompletedSessions(completed);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setLoading(false);
            }
        };

        fetchSessions();
    }, [currentUser]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Sessions</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Image
                            source={currentUser?.imageUrl ? { uri: currentUser.imageUrl } : defaultImage}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Scheduled')} style={[styles.tab, activeTab === 'Scheduled' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'Scheduled' && styles.activeTabText]}>Scheduled</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Ongoing')} style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>Ongoing</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Completed')} style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
                {activeTab === 'Scheduled' && scheduledSessions.length > 0 ? (
                    scheduledSessions.map((session) => (
                        <BookingCard
                            key={session.id}
                            booking={session}
                            role={currentUser.role}
                        />
                    ))
                ) : activeTab === 'Ongoing' && ongoingSessions.length > 0 ? (
                    ongoingSessions.map((session) => (
                        <BookingCard
                            key={session.id}
                            booking={session}
                            role={currentUser.role}
                        />
                    ))
                ) : activeTab === 'Completed' && completedSessions.length > 0 ? (
                    completedSessions.map((session) => (
                        <BookingCard
                            key={session.id}
                            booking={session}
                            role={currentUser.role}
                        />
                    ))
                ) : (
                    <View style={styles.noSessionsContainer}>
                        <Text style={styles.placeholderText}>No {activeTab.toLowerCase()} sessions</Text>
                    </View>
                )}
            </ScrollView>

            {/* Button for students only */}
            {currentUser.role === 'Student' && (
                <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('FindTutor')}>
                    <Text style={styles.requestButtonText}>Book Another Session</Text>
                </TouchableOpacity>
            )}
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
        top: height * 0.03,
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
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
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
        paddingVertical: height * 0.015,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#23cbfb',
    },
    tabText: {
        fontSize: width * 0.045,
        color: '#000',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    contentContainer: {
        flexGrow: 1,
    },
    noSessionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: width * 0.045,
        color: '#23cbfb',
        textAlign: 'center',
    },
    requestButton: {
        backgroundColor: '#23cbfb',
        borderRadius: width * 0.06,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.08,
        alignItems: 'center',
        bottom: height * 0.07,
        marginBottom: height * 0.02,
        alignSelf: 'center',
    },
    requestButtonText: {
        color: '#ffffff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Session;
