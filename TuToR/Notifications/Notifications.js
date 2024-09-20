import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useSelector} from 'react-redux';
import {addDoc, collection, doc, onSnapshot, query, updateDoc, where} from 'firebase/firestore';
import {firestoreDB} from '../Config/firebaseConfig';
import BookingCard from '../FindTutor/BookingCard';
import {Ionicons} from "@expo/vector-icons"; // Assuming you created a separate component for the booking card

const NotificationScreen = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');

    useEffect(() => {

        setRole(currentUser?.role || 'Student');

        const fetchBookings = async () => {
            try {

                const fieldToQuery = role === 'Tutor' ? 'tutor._id' : 'student._id';  // Determine the correct field to query

                const bookingsQuery = query(
                    collection(firestoreDB, 'Bookings'),
                    where(fieldToQuery, '==', currentUser._id)  // Use the correct field and the current user's ID
                );

                return onSnapshot(bookingsQuery, (snapshot) => {
                    const fetchedBookings = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Sort bookings by startTime in descending order (latest booking at the top)
                    fetchedBookings.sort((a, b) => b.startTime.toDate() - a.startTime.toDate());

                    setBookings(fetchedBookings);
                    setLoading(false);
                }); // Clean up the listener on component unmount
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchBookings();
        }
    }, [currentUser, role]);


    const handleAccept = async (bookingRef) => {

        try {
            // Update Firestore booking status to 'accepted'
            await updateDoc(doc(firestoreDB, 'Bookings', bookingRef), { status: 'accepted', readByTutor: true, readByStudent: false });
            Alert.alert('Success', 'You have accepted the booking.');
        } catch (error) {
            console.error('Error accepting booking:', error);
            Alert.alert('Error', 'Failed to accept the booking.');
        }
    };

    const handleDecline = async (booking) => {
        try {
            // Step 1: Update Firestore booking status to 'declined'
            await updateDoc(doc(firestoreDB, 'Bookings', booking.bookingRef), {
                status: 'declined',
                readByTutor: true,
                readByStudent: false
            });

            // Step 2: Add refund transaction to the 'payments' collection
            await addDoc(collection(firestoreDB, 'payments'), {
                payerName: `${booking.tutor.name} ${booking.tutor.lastName}`,
                payerId: booking.tutor._id,
                recipientName: `${booking.student.name} ${booking.student.lastName}`,
                recipientId: booking.student._id,
                amount: parseFloat(booking.cost).toFixed(2),  // Ensure refund amount is formatted to 2 decimal places
                method: 'refund',
                timestamp: new Date(),
            });

            // Step 3: Fetch the current student's balance from both 'Students' and 'Users' collections
            const studentRef = doc(firestoreDB, 'Students', booking.student._id);
            const userRef = doc(firestoreDB, 'users', booking.student._id);

            // Fetch balances in both collections
            const [studentSnap, userSnap] = await Promise.all([getDoc(studentRef), getDoc(userRef)]);

            if (studentSnap.exists() && userSnap.exists()) {
                const currentStudentBalance = studentSnap.data().Balance || 0;
                const currentUserBalance = userSnap.data().Balance || 0;

                // Step 4: Update the balances by adding the refund amount (rounding to 2 decimal points)
                const refundAmount = parseFloat(booking.cost).toFixed(2); // Ensure refund is formatted to 2 decimal places

                const updatedStudentBalance = (parseFloat(currentStudentBalance) + parseFloat(refundAmount)).toFixed(2);
                const updatedUserBalance = (parseFloat(currentUserBalance) + parseFloat(refundAmount)).toFixed(2);

                // Step 5: Update the balances in both 'Students' and 'Users' collections
                await Promise.all([
                    updateDoc(studentRef, { Balance: parseFloat(updatedStudentBalance) }),  // Convert back to number
                    updateDoc(userRef, { Balance: parseFloat(updatedUserBalance) })         // Convert back to number
                ]);

                Alert.alert('Success', 'You have declined the booking and the student has been refunded.');
            } else {
                console.error('Student or user not found');
            }
        } catch (error) {
            console.error('Error declining booking:', error);
            Alert.alert('Error', 'Failed to decline the booking.');
        }
    };


    const handleChat = (booking) => {

        if (currentUser.role === 'Student'){
            navigation.navigate('ChatScreen', { user: booking.tutor });
        } else{
            navigation.navigate('ChatScreen', { user: booking.student });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00243a" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Notifications</Text>
                <Ionicons name="notifications-outline" size={28} color="transparent" />
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {bookings.map((booking) => (
                    <BookingCard
                        key={booking.bookingRef}
                        booking={booking}
                        role={role}
                        onAccept={() => handleAccept(booking.bookingRef)}
                        onDecline={() => handleDecline(booking)}
                        onChatPress={() => handleChat(booking)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContainer: {
        padding: 20,
    },
});

export default NotificationScreen;
