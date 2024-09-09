// hooks/useUserDataListener.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig'; // Your Firebase setup
import { setUser } from '../context/actions/userActions'; // Your Redux action

const useUserDataListener = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.user);

    useEffect(() => {
        if (currentUser) {
            const userId = currentUser._id;

            // Set up real-time listener to user's document
            const unsubscribe = onSnapshot(doc(firestoreDB, 'users', userId), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const updatedUserData = docSnapshot.data();
                    dispatch(setUser(updatedUserData)); // Update Redux store with new data
                } else {
                    console.error('No such document!');
                }
            });

            // Clean up listener on unmount
            return () => unsubscribe();
        }
    }, [currentUser, dispatch]);
};

export default useUserDataListener;
