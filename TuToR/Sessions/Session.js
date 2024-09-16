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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {collection, query, where, getDocs, arrayUnion, updateDoc, doc, getDoc, addDoc} from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig';
import { useSelector } from 'react-redux';
import BookingCard from '../FindTutor/BookingCard';
import SessionCard from "./SessionCard";
import ReviewModal from "../FindTutor/ReviewModal";
import NotificationIcon from "../Notifications/NotificationIcon";  // Assuming you are using BookingCard component


const { width, height } = Dimensions.get('window');

const Session = ({ navigation }) => {

    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [enable,setEnable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Scheduled');
    const currentUser = useSelector((state) => state.user.user);
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {

        fetchSessions();
    }, [currentUser]);



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
                    where('student._id', '==', currentUser._id),
                    where ('status','!=', 'pending')
                );
            } else if (currentUser.role === 'Tutor') {

                sessionsQuery = query(
                    collection(firestoreDB, 'Bookings'),
                    where('tutor._id', '==', currentUser._id),
                    where ('status','!=', 'pending')
                );
            }

            const sessionsSnapshot = await getDocs(sessionsQuery);
            const allSessions = sessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Categorize sessions into Scheduled, Ongoing, and Completed based on current time
            const scheduled = [];

            const completed = [];

            allSessions.forEach((session) => {

                const startTime = session.startTime.toDate();
                const endTime = session.endTime.toDate();

                if (endTime < now && session.status === 'accepted' ||  session.status === 'completed') {
                    setEnable(true);
                    completed.push(session);
                } else {
                    scheduled.push(session);
                }
            });

            setScheduledSessions(scheduled);
            setCompletedSessions(completed);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    const handleOpenReview = (session) => {
        setSelectedSession(session);  // Set the session that will be reviewed
        setReviewModalVisible(true);
    };

    const handleSubmitReview = async ({ rating, review }) => {
        const isStudent = currentUser.role === 'Student';
        const ratedPerson = isStudent ? selectedSession.tutor : selectedSession.student;  // Person being rated

        if (!ratedPerson) return;

        try {
            setReviewLoading(true);

            // Determine which collection to update based on the role (Tutors or Students)
            const ratedPersonRef = doc(firestoreDB, isStudent ? 'Tutors' : 'Students', ratedPerson._id);

            // Retrieve current data for the tutor or student being rated
            const ratedPersonDoc = await getDoc(ratedPersonRef);
            if (!ratedPersonDoc.exists()) {
                console.error(`${isStudent ? 'Tutor' : 'Student'} document not found`);
                alert(`${isStudent ? 'Tutor' : 'Student'} information not found.`);
                return;
            }

            const ratedPersonData = ratedPersonDoc.data();
            const currentRating = ratedPersonData.rating || 0;  // Default to 0 if no rating exists
            const currentRatingCount = ratedPersonData.ratingCount || 0;  // Default to 0 if no rating count exists

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

            setReviewLoading(false);
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit the review, please try again.');
        } finally {
            setReviewLoading(false);
            setReviewModalVisible(false);  // Close the modal after submission
        }
    };

    const handleMarkAsComplete = async (session) => {
        try {
            const tutorRefInUsers = doc(firestoreDB, 'users', session.tutor._id);  // Reference to tutor in 'users' collection
            const tutorRefInTutors = doc(firestoreDB, 'Tutors', session.tutor._id);  // Reference to tutor in 'Tutors' collection

            // Fetch tutor data from the 'users' collection
            const tutorDoc = await getDoc(tutorRefInUsers);
            if (!tutorDoc.exists()) {
                Alert.alert('Error', 'Tutor not found');
                return;
            }


            const tutorData = tutorDoc.data();

            const currentTutorBalance = tutorData.Balance || 0;  // Fetch the current balance of the tutor
            const sessionCost = session.cost.toFixed(2);  // Ensure session cost has 2 decimal places

            // Update the tutor's balance by adding the session cost
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
                method: 'sessionPayment',
                timestamp: new Date(),
            });

            // Update the session status to 'completed' to prevent repeated actions
            const sessionRef = doc(firestoreDB, 'Bookings', session.bookingRef);
            await updateDoc(sessionRef, {
                status: 'completed',
            });

            // Inform the user about the tutor's updated balance and successful payment
            Alert.alert('Success', `The session is complete! Tutor's new balance is R${newTutorBalance.toFixed(2)}. Payment of R${sessionCost} has been successfully processed.`);
        } catch (error) {
            console.error('Error marking session as complete and processing payment:', error);
            Alert.alert('Error', 'Failed to mark the session as complete, please try again.');
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
                            <Image
                                source={{ uri: currentUser.imageUrl }}
                                style={styles.profileImage} // Add the style for the profile image
                            />
                        ) : (
                            <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
                        )}
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

            <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
                {activeTab === 'Scheduled' && scheduledSessions.length > 0 ? (
                    scheduledSessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            role={currentUser.role}
                            onReviewPress={() => handleOpenReview(session)}

                        />
                    ))
                ) : activeTab === 'Completed' && completedSessions.length > 0 ? (
                    completedSessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            role={currentUser.role}
                            onReviewPress={() => handleOpenReview(session)} // Trigger review action
                            onMarkAsComplete={() => handleMarkAsComplete(session)}
                            enable={enable}
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
                tutorName={selectedSession?.tutor?.firstName + ' ' + selectedSession?.tutor?.lastName}
                onClose={() => setReviewModalVisible(false)}
                onSubmitReview={handleSubmitReview}
                loading={reviewLoading}
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
