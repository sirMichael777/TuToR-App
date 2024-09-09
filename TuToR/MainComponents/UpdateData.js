import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig'; // Your Firebase setup
import { setUser } from '../context/actions/userActions'; // Your Redux action
import _ from 'lodash'; // Use lodash to deep compare objects

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

                    // Compare if the fetched data is different from the current user data in Redux
                    if (!_.isEqual(updatedUserData, currentUser)) {
                        dispatch(setUser(updatedUserData)); // Only update Redux store if the data has changed
                    }
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
