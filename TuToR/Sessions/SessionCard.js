import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';

const { width } = Dimensions.get('window');

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

const SessionCard = ({ session, role, onReviewPress, onMarkAsComplete, enable, sessionHasEnded, reviewSubmitted }) => {
    const { bookingRef, student, tutor, studentAck, tutorAck, status, reviewedBy } = session;


    const [loading, setLoading] = useState(false);  // Track loading state

    // Determine if user is a Student or Tutor and their acknowledgment status
    const isStudent = role === 'Student';
    const userAck = isStudent ? studentAck : tutorAck;

    // Centralized condition checks
    const canSubmitReview = sessionHasEnded && !reviewedBy.includes(isStudent ? student._id : tutor._id);

    const canTakeAction = reviewedBy.includes(isStudent ? student._id : tutor._id);


    const renderActionStatus = () => {

        if (isStudent) {
            if (studentAck && status=== 'completed') {
                return <Text style={styles.completeText}>Complete</Text>;
            } else if (status === 'didntHappen') {
                return <Text style={styles.didntHappenText}>You marked the session as didnt happen you can contact us at tutorSupport@tutors.co.za for a refund/to report a specific problem</Text>;
            }
        } else {
            if (tutorAck && studentAck && status !== 'didntHappen') {
                return <Text style={styles.completeText}>Payment released</Text>;
            } else if (tutorAck && !studentAck) {
                return <Text style={styles.awaitingText}>Awaiting student acknowledgment before releasing payment</Text>;
            } else if (status === 'didntHappen'){
                return <Text style={styles.awaitingText}>The student marked the session as didnt happen, if this is not the case you can contact us at tutorSupport@tutors.co.za</Text>;
            }
        }
        return null;
    };

    const handleReviewSubmit = () => {
        onReviewPress();  // Trigger the review modal
    };

    const handleAction = async (action) => {
        try {
            setLoading(true);  // Set loading to true when the action starts
            await onMarkAsComplete(action);
;

        } catch (error) {

            Alert.alert('Action Failed', 'There was a problem submitting your action. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.cardContainer} accessible={true} accessibilityLabel={`Session card for ${isStudent ? tutor.name : student.name}`}>
            <Text style={styles.bookingRef}>BookingRef: {bookingRef}</Text>

            {/* Conditionally show either student or tutor name based on the user role */}
            {isStudent ? (
                <Text style={styles.participantName} accessibilityLabel={`Tutor: ${tutor.name} ${tutor.lastName}`}>Tutor: {tutor.name} {tutor.lastName}</Text>
            ) : (
                <Text style={styles.participantName} accessibilityLabel={`Student: ${student.name} ${student.lastName}`}>Student: {student.name} {student.lastName}</Text>
            )}

            {/* Session time */}
            <Text style={styles.sessionTime} accessibilityLabel={`Start time: ${formatFirestoreDate(session.startTime)}`}>Start-Time: {formatFirestoreDate(session.startTime)}</Text>
            <Text style={styles.sessionTime} accessibilityLabel={`End time: ${formatFirestoreDate(session.endTime)}`}>Finish-Time: {formatFirestoreDate(session.endTime)}</Text>

            <View style={styles.buttonContainer}>
                {/* Conditionally show Write a Review button only if the session has ended and the user hasn't submitted a review */}
                {canSubmitReview && (
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={handleReviewSubmit}
                        accessibilityLabel="Write a review button"
                    >
                        <Text style={styles.reviewButtonText}>Write A Review</Text>
                    </TouchableOpacity>
                )}

                {/* Show both "Mark as Complete" and "Didn't Happen" buttons only after review is submitted */}
                {canTakeAction && !userAck ? (
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={styles.completeButton}  // Change opacity if disabled
                            onPress={() => handleAction('complete')}  // Pass 'complete' as action
                            accessibilityLabel="Mark as complete button"
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.completeButtonText}>Mark as Complete</Text>}
                        </TouchableOpacity>

                        {role === 'Student' && (
                            <TouchableOpacity
                                style={styles.didntHappenButton}  // Change opacity if disabled
                                onPress={() => handleAction('didntHappen')}  // Pass 'didntHappen' as action
                                disabled={!enable || loading}  // Disable button when 'enable' is false or loading
                                accessibilityLabel="Didn't happen button"
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.didntHappenButtonText}>Didn't Happen</Text>}
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    renderActionStatus()
                )}
            </View>
        </View>
    );
};

// Styles for the buttons and layout
const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    bookingRef: {
        fontWeight: 'bold',
    },
    participantName: {
        fontSize: 16,
        marginVertical: 4,
    },
    sessionTime: {
        fontSize: 14,
        color: '#555',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    reviewButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    reviewButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    completeButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    didntHappenButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 10,  // Adds spacing between buttons
    },
    didntHappenButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    completeText: {
        color: 'green',
        fontWeight: 'bold',
    },
    didntHappenText: {
        color: 'red',
        fontWeight: 'bold',
    },
    awaitingText: {
        color: '#ffa500',
        fontWeight: 'bold',
    },
    conflictingText: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default SessionCard;
