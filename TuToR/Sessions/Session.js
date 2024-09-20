import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    getDoc,
    addDoc,
    arrayUnion,
    onSnapshot
} from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig';
import { useSelector } from 'react-redux';
import SessionCard from './SessionCard';
import ReviewModal from './ReviewModal';
import NotificationIcon from '../Notifications/NotificationIcon';

const { width, height } = Dimensions.get('window');

// Utility function to format Firestore timestamp to a readable date string
const formatFirestoreDate = (timestamp) => {
    return timestamp?.seconds
        ? new Date(timestamp.seconds * 1000).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'long',
        })
        : 'Date not available';
};

const Session = ({ navigation }) => {

    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Scheduled');
    const currentUser = useSelector((state) => state.user.user);
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        let unsubscribe;  // Declare a variable to hold the unsubscribe function

        const fetchSessions = async () => {
            if (!currentUser) return;  // Ensure currentUser is loaded before fetching sessions

            const now = new Date();

            try {
                let sessionsQuery;

                // Adjust query based on role (Student or Tutor)
                if (currentUser.role === 'Student') {
                    sessionsQuery = query(
                        collection(firestoreDB, 'Bookings'),
                        where('student._id', '==', currentUser._id),
                        where('status', 'in', ['accepted','completed','didntHappen'])
                    );
                } else if (currentUser.role === 'Tutor') {
                    sessionsQuery = query(
                        collection(firestoreDB, 'Bookings'),
                        where('tutor._id', '==', currentUser._id),
                    );
                }

                // Listen to changes in real-time

                unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
                    const allSessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                    // Sort sessions by startTime in descending order (latest first)
                    allSessions.sort((a, b) => b.startTime.toDate() - a.startTime.toDate());

                    const scheduled = [];
                    const completed = [];

                    allSessions.forEach((session) => {
                        const endTime = session.endTime.toDate();
                        if (endTime < now) {
                            completed.push(session);
                        } else {
                            scheduled.push(session);
                        }
                    });

                    setScheduledSessions(scheduled);
                    setCompletedSessions(completed);
                    setLoading(false);  // Stop loading after data is received
                });
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setLoading(false);  // Ensure loading is stopped in case of error
            }
        };

        if (currentUser) {
            fetchSessions();  // Call fetchSessions immediately when currentUser is available
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();  // Unsubscribe from the listener when the component unmounts
            }
        };
    }, [currentUser]);  // Only re-run if currentUser changes


    const handleOpenReview = (session) => {
        setSelectedSession(session);
        setReviewModalVisible(true);
    };

    const handleSubmitReview = async ({ rating, review }) => {

        if (!review || typeof review !== 'string') {
            Alert.alert("Validation Error", "Please provide a valid review.");
            return;
        }

        const isStudent = currentUser.role === 'Student';
        const ratedPerson = isStudent ? selectedSession.tutor : selectedSession.student;


        try {
            setReviewLoading(true);

            const sessionRef = doc(firestoreDB, 'Bookings', selectedSession.id);

            const ratedPersonRef = doc(firestoreDB, isStudent ? 'Tutors' : 'Students', ratedPerson._id);

            // Retrieve current data for the tutor or student being rated
            const ratedPersonDoc = await getDoc(ratedPersonRef);
            if (!ratedPersonDoc.exists()) {
                console.error(`${isStudent ? 'Tutor' : 'Student'} document not found`);
                alert(`${isStudent ? 'Tutor' : 'Student'} information not found.`);
                return;
            }

            const ratedPersonData = ratedPersonDoc.data();
            const currentRating = ratedPersonData.rating || 0;
            const currentRatingCount = ratedPersonData.ratingCount || 0;

            // Calculate the new average rating
            const newRatingCount = currentRatingCount + 1;
            const newAverageRating = Number(((currentRating * currentRatingCount + rating) / newRatingCount).toFixed(1));

            // Update the person's reviews and rating information in Firestore
            await updateDoc(ratedPersonRef, {
                reviews: arrayUnion({
                    reviewerName: `${currentUser.name} ${currentUser.lastName}`,
                    rating: rating,
                    review: review,
                    timestamp: new Date(),
                    }),
                rating: newAverageRating, // Update the average rating
                ratingCount: newRatingCount,  // Increment the rating count
            });

            await updateDoc(sessionRef, {
                reviewedBy: arrayUnion(currentUser._id)
            });


            Alert.alert('Success', 'Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit the review, please try again.');
        } finally {
            setReviewLoading(false);
            setReviewModalVisible(false);
        }
    };

    const handleMarkAsComplete = async (session, status) => {

        try {

            const sessionRef = doc(firestoreDB, 'Bookings', session.id);
            const tutorRefInUsers = doc(firestoreDB, 'users', session.tutor._id);  // Reference to tutor in 'users' collection
            const tutorRefInTutors = doc(firestoreDB, 'Tutors', session.tutor._id);  // Reference to tutor in 'Tutors' collection

            await updateDoc(sessionRef, {
                [currentUser.role === 'Student' ? 'studentAck' : 'tutorAck']: true,
            });


            const updatedSession = (await getDoc(sessionRef)).data();

            if (status === 'complete') {

                const tutorDoc = await getDoc(tutorRefInUsers);

                if (!tutorDoc.exists()) {
                    Alert.alert('Error', 'Tutor not found');
                    return;
                }

                const tutorData = tutorDoc.data();

                const currentTutorBalance = tutorData.Balance || 0;  // Fetch the current balance of the tutor
                const sessionCost = session.cost.toFixed(2);  // Ensure session cost has 2 decimal places

                // Mark the session as completed if both parties acknowledged

                if (updatedSession.studentAck && updatedSession.tutorAck) {
                    const newTutorBalance = parseFloat(currentTutorBalance) + parseFloat(sessionCost);

                    // Update the balance in both 'users' and 'Tutors' collections
                    await updateDoc(tutorRefInUsers, {
                        Balance: newTutorBalance.toFixed(2),
                    });

                    await updateDoc(tutorRefInTutors, {
                        Balance: newTutorBalance.toFixed(2),
                    });

                    // Record the payment in the 'payments' collection
                    await addDoc(collection(firestoreDB, 'payments'), {
                        payerName: `${session.student.name} ${session.student.lastName}`,
                        payerId: session.student._id,
                        recipientName: `${session.tutor.firstName} ${session.tutor.lastName}`,
                        recipientId: session.tutor._id,
                        amount: parseFloat(sessionCost).toFixed(2),
                        method: 'earnings',
                        timestamp: new Date(),
                   });
                    Alert.alert('Success', 'Session marked as complete! Payment released.');
                } else {
                    Alert.alert('Pending', 'Waiting for the other party to mark the session as complete.');
                }
            } else if (status === 'didntHappen') {

                await updateDoc(sessionRef, {
                    status: 'didntHappen',
                });

                Alert.alert('Info', "Session marked as 'didn't happen'. Payment refunded to the student.");
            }
        } catch (error) {
            console.error('Error marking session:', error);
            Alert.alert('Error', 'Failed to mark the session, please try again.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Sessions</Text>
                <View style={styles.iconContainer}>
                    <NotificationIcon navigation={navigation} />
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        {currentUser?.imageUrl ? (
                            <Image source={{ uri: currentUser.imageUrl }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab('Scheduled')}
                    style={[styles.tab, activeTab === 'Scheduled' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'Scheduled' && styles.activeTabText]}>Scheduled</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('Completed')}
                    style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#23cbfb" />
                    </View>
                ) : activeTab === 'Scheduled' && scheduledSessions.length > 0 ? (
                    scheduledSessions.map((session) => {
                        const sessionHasEnded = new Date(session.endTime.seconds * 1000) < new Date();

                        return (
                            <SessionCard
                                key={session.id}
                                session={session}
                                role={currentUser.role}
                                onReviewPress={() => handleOpenReview(session)}
                                onMarkAsComplete={(status) => handleMarkAsComplete(session, status)}
                                sessionHasEnded={sessionHasEnded}
                                reviewSubmitted={!selectedSession?.reviewSubmitted}
                            />
                        );
                    })
                ) : activeTab === 'Completed' && completedSessions.length > 0 ? (
                    completedSessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            role={currentUser.role}
                            onReviewPress={() => handleOpenReview(session)}
                            onMarkAsComplete={(status) => handleMarkAsComplete(session, status)}
                            sessionHasEnded={true}
                            enable={true}
                        />
                    ))
                ) : (
                    <View style={styles.noSessionsContainer}>
                        <Text style={styles.placeholderText}>No {activeTab.toLowerCase()} sessions</Text>
                    </View>
                )}
            </ScrollView>


            <ReviewModal
                isVisible={isReviewModalVisible}
                tutorName={selectedSession?.tutor?.name + ' ' + selectedSession?.tutor?.lastName}
                onClose={() => setReviewModalVisible(false)}
                onSubmitReview={handleSubmitReview}
                loading={reviewLoading}
                sessionId={selectedSession?.id}  // Ensure sessionId is passed correctly
            />
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
    profileIcon: {
        marginLeft: 15,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Session;
