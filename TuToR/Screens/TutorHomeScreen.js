import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView,Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestoreDB } from '../Config/firebaseConfig'; // Replace with your Firebase config
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import MessageListener from "../Chat/MessageListener";
import NotificationIcon from "../Notifications/NotificationIcon";

const { width, height } = Dimensions.get('window');

const TutorHomeScreen = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user); // Get current user from Redux
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch upcoming sessions (limit 3)
        const fetchUpcomingSessions = async () => {
            try {
                const sessionsQuery = query(
                    collection(firestoreDB, 'Bookings'),
                    where('tutor._id', '==', currentUser._id),
                    where('status', '==', 'accepted'),  // Adjust based on your status field
                    orderBy('startTime', 'asc'),
                    limit(3)  // Limit to 3 upcoming sessions
                );

                const sessionDocs = await getDocs(sessionsQuery);
                const sessionsData = sessionDocs.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUpcomingSessions(sessionsData);
            } catch (error) {
                console.error('Error fetching upcoming sessions:', error);
            }
        };
        // Fetch latest reviews (limit 3)
        const fetchReviews = async () => {
            try {
                const reviewsQuery = query(
                    collection(firestoreDB, 'Tutors'),
                    where('_id', '==', currentUser._id),
                    limit(3) // Limit to 3 latest reviews
                );

                const reviewDocs = await getDocs(reviewsQuery);
                const reviewsData = reviewDocs.docs
                    .map((doc) => doc.data().reviews)  // Extract the reviews array from each tutor document
                    .flat()  // Flatten the array of arrays to a single array
                    .slice(0, 3);  // Get the top 3 reviews

                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching latest reviews:', error);
            }
        };

        if (currentUser?._id) {
            fetchUpcomingSessions();
            fetchReviews();
        }
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <MessageListener navigation={navigation} />
            <View style={styles.header}>
                <Text style={styles.headerText}>Home</Text>
                <View style={styles.iconContainer}>
                    <NotificationIcon navigation={navigation} />
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        {currentUser?.imageUrl ? (
                            <Image
                                source={{ uri: currentUser.imageUrl }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="person-outline" size={width * 0.06} color="black" style={styles.profileIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Display tutor rating and rating count */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                    ⭐ {currentUser.rating || 'No rating yet'} ({currentUser.ratingCount || 0} ratings)
                </Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Welcome to Your Tutoring Hub!</Text>
                    <Text style={styles.cardText}>
                        Empower minds and shape futures. Manage your schedule and track your progress as you guide students to success.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SessionsScreen')}>
                        <Text style={styles.viewAll}>view all</Text>
                    </TouchableOpacity>
                </View>

                {/* Display upcoming sessions */}
                {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session, index) => (
                        <View key={index} style={styles.card}>
                            <Ionicons name="calendar-outline" size={width * 0.06} color="white" />
                            <Text style={styles.cardText}>Course: {session.course}</Text>
                            <Text style={styles.cardText}>Start: {new Date(session.startTime.seconds * 1000).toLocaleString()}</Text>
                            <Text style={styles.cardText}>End: {new Date(session.endTime.seconds * 1000).toLocaleString()}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>No scheduled sessions</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Latest Reviews</Text>
                </View>

                {/* Display latest reviews */}
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardText}>Review by {review.reviewerName}</Text>
                            <Text style={styles.cardText}>{review.review}</Text>
                            <Text style={styles.cardText}>⭐ {review.rating}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>No reviews available</Text>
                    </View>
                )}
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
    ratingContainer: {
        alignItems: 'center',
        marginVertical: height * 0.02,
    },
    ratingText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
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
