import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { firestoreDB } from "../Config/firebaseConfig";
import {collection, query, where, orderBy, limit, onSnapshot, doc} from 'firebase/firestore';
import NotificationIcon from "../Notifications/NotificationIcon";

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [latestReviews, setLatestReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllReviews, setShowAllReviews] = useState(false);



    useEffect(() => {
        let unsubscribeUpcomingSessions;
        let unsubscribeLatestReviews;
        setLoading(true);

        const now = new Date();

        // Fetch upcoming sessions using real-time updates
        const fetchUpcomingSessions = async () => {
            try {
                const sessionsQuery = query(
                    collection(firestoreDB, 'Bookings'),
                    where('student._id', '==', currentUser._id),
                    where('status', '==', 'accepted'),  // Adjust based on your status field
                    where('endTime', '>=', now),  // Ensure the session hasn't ended
                    orderBy('endTime', 'asc'),
                    limit(3)  // Limit to 3 upcoming sessions
                );

                // Listen to real-time updates
                unsubscribeUpcomingSessions = onSnapshot(sessionsQuery, (snapshot) => {
                    const sessionsData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setUpcomingSessions(sessionsData);
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error fetching upcoming sessions:', error);
                setLoading(false);
            }
        };

        // Fetch latest reviews using real-time updates and order by review timestamp
        const fetchLatestReviews = async () => {
            try {
                const studentDocRef = doc(firestoreDB, 'Students', currentUser._id);

                // Listen to real-time updates for the student's document
                unsubscribeLatestReviews = onSnapshot(studentDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const studentData = docSnapshot.data();
                        const reviewsArray = studentData.reviews || [];

                        // Sort reviews by timestamp in descending order and get the most recent 3
                        const sortedReviews = reviewsArray
                            .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())  // Assuming 'timestamp' is a Firestore Timestamp
                        setLoading(false);
                        setLatestReviews(sortedReviews);
                    }
                });
            } catch (error) {
                setLoading(false);
                console.error('Error fetching latest reviews:', error);
            }
        };

        if (currentUser?._id) {
            fetchUpcomingSessions();
            fetchLatestReviews();
        }

        // Clean up the snapshot listeners when the component unmounts
        return () => {
            if (unsubscribeUpcomingSessions) unsubscribeUpcomingSessions();
            if (unsubscribeLatestReviews) unsubscribeLatestReviews();
        };
    }, [currentUser]);  // The effect depends on currentUser
    const formatToZAR = (amount) => {
        return `R${Number(amount).toFixed(2)}`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView contentContainerStyle={styles.container}>
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
                            <Ionicons name="person" size={30} color="black" style={styles.profileIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.headerText}>Welcome {currentUser.name} {currentUser.lastName}</Text>
            {/* Display user rating and rating count */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {currentUser.rating || 'No rating yet'} ({currentUser.ratingCount || 0} ratings)</Text>
            </View>

            <Text style={styles.balanceText}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatToZAR(currentUser.Balance)} ZAR</Text>

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
                    <Text style={styles.sessionsText}>Upcoming Sessions</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Sessions')}>
                        <Text style={styles.viewAllText}>view all</Text>
                    </TouchableOpacity>
                </View>

                {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session, index) => (
                        <View key={index} style={styles.sessionCard}>
                            <Text>Course: {session.course}</Text>
                            <Text>Start: {new Date(session.startTime.seconds * 1000).toLocaleString()}</Text>
                            <Text>End: {new Date(session.endTime.seconds * 1000).toLocaleString()}</Text>
                            <Text>Status: {session.status}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.noSessionsCard}>
                        <Image source={require('../assets/Calendar.png')} style={styles.calendarIcon} />
                        <Text style={styles.noSessionsText}>No upcoming scheduled sessions</Text>
                    </View>
                )}
            </View>

            {/* Display reviews */}
            <View style={styles.reviewsSection}>
                <View style={styles.reviewsHeader}>
                    <Text style={styles.reviewsText}>Latest Reviews</Text>
                </View>
                {latestReviews.length > 0 ? (
                    (showAllReviews ? latestReviews : latestReviews.slice(0, 3)).map((review, index) => (
                        <View key={index} style={styles.reviewCard}>
                            <Text style={styles.reviewText}>Review by {review?.reviewerName}:</Text>
                            <Text style={styles.reviewContent}>{review?.review}</Text>
                            <Text style={styles.reviewRating}>⭐ {review?.rating}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.noReviewsCard}>
                        <Text style={styles.noReviewsText}>No reviews yet</Text>
                    </View>
                )}

                {latestReviews.length > 3 && (
                    <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
                        <Text style={styles.viewAllText}>
                            {showAllReviews ? 'View Less' : 'View All'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#fff',  // Optional: Adjust to match your design
    },
    container: {
        backgroundColor: '#ffffff',
        padding: width * 0.05,
    },
    header: {
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
        marginBottom: 30,
    },
    sessionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sessionsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllText: {
        color: '#007BFF',
    },
    sessionCard: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    noSessionsCard: {
        alignItems: 'center',
        padding: 20,
    },
    calendarIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    noSessionsText: {
        color: '#666',
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
    reviewsSection: {
        marginBottom: 30,
    },
    reviewsHeader: {
        marginBottom: 10,
    },
    reviewsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewCard: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    reviewText: {
        fontWeight: 'bold',
    },
    reviewContent: {
        fontStyle: 'italic',
        marginBottom: 5,
    },
    reviewRating: {
        color: 'gold',
    },
    noReviewsCard: {
        alignItems: 'center',
        padding: 20,
    },
    noReviewsText: {
        color: '#666',
    },

});

export default HomeScreen;
