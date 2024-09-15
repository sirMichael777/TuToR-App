import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SessionCard = ({ session, role, onReviewPress, onMarkAsComplete, enable }) => {
    const { bookingRef, student, tutor, startTime, endTime, status, } = session;
    console.log(status);

    // Format timestamps to readable date strings
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

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.bookingRef}>BookingRef: {bookingRef}</Text>

            {/* Conditionally show either student or tutor name based on the user role */}
            {role === 'Student' ? (
                <Text style={styles.participantName}>TutorName: {tutor.name} {tutor.lastName}</Text>
            ) : (
                <Text style={styles.participantName}>StudentName: {student.name} {student.lastName}</Text>
            )}

            <Text style={styles.sessionTime}>Start-Time: {formatFirestoreDate(startTime)}</Text>
            <Text style={styles.sessionTime}>Finish-Time: {formatFirestoreDate(endTime)}</Text>

            <View style={styles.buttonContainer}>
                {/* Show Review button if the session is completed and the role is Student */}
                {enable && (
                    <TouchableOpacity style={styles.reviewButton} onPress={onReviewPress}>
                        <Text style={styles.reviewButtonText}>Write A Review</Text>
                    </TouchableOpacity>

                )
                }

                {role === 'Tutor' && enable && status !=='completed' && (
                    <TouchableOpacity style={styles.completeButton} onPress={onMarkAsComplete}>
                        <Text style={styles.completeButtonText}>Mark as Complete</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Sample Styles for the buttons
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
});

export default SessionCard;
