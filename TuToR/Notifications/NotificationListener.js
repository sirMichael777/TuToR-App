import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestoreDB } from '../Config/firebaseConfig'; // Your Firebase setup
import { useSelector } from 'react-redux';

const useBookingNotifications = () => {
    const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
    const currentUser = useSelector((state) => state.user.user); // Assuming you're using Redux to store current user

    useEffect(() => {
        if (!currentUser) return;

        let bookingsQuery;

        if (currentUser.role === 'Student') {
            // Fetch sessions where the student ID matches the current user
            bookingsQuery = query(
                collection(firestoreDB, 'Bookings'),
                where('readByStudent', '==', false),
                where('student._id', '==', currentUser._id)
            );
        } else if (currentUser.role === 'Tutor') {
            // Fetch sessions where the tutor ID matches the current user
            bookingsQuery = query(
                collection(firestoreDB, 'Bookings'),
                where('readByTutor', '==', false),
                where('tutor._id', '==', currentUser._id)
            );
        }

        const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
            setPendingBookingsCount(snapshot.docs.length);
        });

        // Clean up listener on component unmount
        return () => unsubscribe();
    }, [currentUser]);

    return pendingBookingsCount;
};

export default useBookingNotifications;
