import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';




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


const BookingCard = ({ booking, onAccept, onDecline, onChatPress, role }) => {
    const { tutor, student, startTime, endTime, tutoringDate, status, bookingRef } = booking;

    // Determine whether to show the student or tutor information based on role
    const personName = role === 'Student'
        ? `${tutor.name} ${tutor.lastName}` // Display tutor's name for students
        : `${student.name} ${student.lastName}`; // Display student's name for tutors

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.bookingTitle}>Booking</Text>
                <Text style={styles.bookingDate}>{formatFirestoreDate(tutoringDate)}</Text>
            </View>

            {/* Display person name based on role */}
            <Text style={styles.bookingDetails}>{role === 'Student' ? `Tutor: ${personName}` : `Student: ${personName}`}</Text>
            <Text style={styles.bookingDetails}>Starting at: {formatFirestoreDate(startTime)}</Text>
            <Text style={styles.bookingDetails}>Ending at: {formatFirestoreDate(endTime)}</Text>

            {/* Pending status for tutors */}
            {status === 'pending' && role === 'Tutor' ? (
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
                        <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.statusContainer}>
                    <Text
                        style={[
                            styles.statusText,
                            status === 'accepted' ? styles.acceptedText : styles.declinedText,
                        ]}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                    <Text style={styles.refText}>ref: {bookingRef}</Text>
                    <Text style={styles.infoText}>
                        {status === 'accepted' ? (
                            role === 'Student' ?
                                'Please chat to the tutor to find out about the venue/more details.' :
                                'Please chat to the Student and find out more information about your session.'
                        ) : (
                            role === 'Student' ?
                                'Please try another tutor or chat to the tutor for more information.' :
                                'Please let the student know why you declined the booking.'
                        )}
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.chatIconContainer} onPress={onChatPress}>
                <Ionicons name="chatbox-outline" size={24} color="#00243a" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#E0F7FA',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    bookingTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    bookingDate: {
        fontSize: 14,
        color: '#666',
    },
    bookingDetails: {
        fontSize: 16,
        marginBottom: 5,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    acceptButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    declineButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusContainer: {
        marginTop: 10,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    acceptedText: {
        color: 'green',
    },
    declinedText: {
        color: 'red',
    },
    refText: {
        color: '#666',
        fontSize: 14,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
    chatIconContainer: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
});

export default BookingCard;
