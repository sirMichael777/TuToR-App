import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useBookingNotifications from './NotificationListener';
import {collection, getDocs, query, updateDoc, where} from "firebase/firestore";
import {firestoreDB} from "../Config/firebaseConfig";
import {useSelector} from "react-redux"; // The custom hook from above

const NotificationIcon = ({ navigation }) => {

    const pendingBookingsCount = useBookingNotifications()
    const currentUser = useSelector((state) => state.user.user);
    const markAllAsReadByStudent = async () => {
        try {
            // Fetch all bookings where readByStudent is false for the current student
            const bookingsQuery = query(
                collection(firestoreDB, 'Bookings'),
                where('student._id', '==', currentUser._id),
                where('readByStudent', '==', false)
            );


            const bookingsSnapshot = await getDocs(bookingsQuery);

            // Update each booking's readByStudent to true
            const batchPromises = bookingsSnapshot.docs.map((bookingDoc) =>
                updateDoc(bookingDoc.ref, {
                    readByStudent: true,
                })
            );

            await Promise.all(batchPromises);

            console.log('All unread bookings marked as read by student.');
        } catch (error) {
            console.error('Error marking all bookings as read by student:', error);
        }
    };

    const handleNotificationsClick = () => {
        if(currentUser.role === 'Student'){
            markAllAsReadByStudent();
        }
        navigation.navigate('NotificationScreen');
    };

    return (
        <TouchableOpacity onPress={handleNotificationsClick}>
            <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={30} color="black" />
                {pendingBookingsCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationText}>{pendingBookingsCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 2,
        minWidth: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default NotificationIcon;
