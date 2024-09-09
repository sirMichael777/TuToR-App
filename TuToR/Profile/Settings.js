import React, {useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {EmailAuthProvider, reauthenticateWithCredential, deleteUser} from "firebase/auth";
import {doc, getDoc,deleteDoc} from "firebase/firestore";
import {firebaseAuth, firestoreDB} from "../Config/firebaseConfig";

const { width, height } = Dimensions.get('window');

const Settings = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');


  const handleChangePassword = () => {
    // Navigate to the Change Password screen
    navigation.navigate('ChangePassword');
  };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const user = firebaseAuth.currentUser;

                            if (user) {

                                // Reauthenticate the user before deletion
                                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                                await reauthenticateWithCredential(user, credential);

                                const userDocRef = doc(firestoreDB, 'users', user.uid);
                                const userDocSnapshot = await getDoc(userDocRef);
                                const userData = userDocSnapshot.data();

                                if (userData) {
                                    const { role } = userData;

                                    // Delete user from the `users` collection
                                    await deleteDoc(userDocRef);

                                    // Conditionally delete from either `Students` or `Tutors` based on the role
                                    if (role === 'Student') {
                                        const studentDocRef = doc(firestoreDB, 'Students', user.uid);
                                        await deleteDoc(studentDocRef);
                                    } else if (role === 'Tutor') {
                                        const tutorDocRef = doc(firestoreDB, 'Tutors', user.uid);
                                        await deleteDoc(tutorDocRef);
                                    }

                                    // Delete user from Firebase Authentication
                                    await deleteUser(user);

                                    // Notify user
                                    Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                                } else {
                                    Alert.alert('Error', 'No user data found.');
                                }
                            } else {
                                Alert.alert('Error', 'User not logged in.');
                            }
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            if (error.code === 'auth/requires-recent-login') {
                                Alert.alert('Error', 'Please log in again to delete your account.');
                            } else {
                                Alert.alert('Error', 'Failed to delete your account. Please try again.');
                            }
                        }
                    }
                },
            ]
        );
    };

  const handleAbout = () => {
    // Navigate to the About screen
    navigation.navigate('About');
  };

  const handleNotificationsPreferences = () => {
    // Navigate to Notification Preferences screen
    navigation.navigate('NotificationsPreferences');
  };

  const handlePrivacySettings = () => {
    // Navigate to Privacy Settings screen
    navigation.navigate('PrivacySettings');
  };
    const promptForPassword = () => {
        Alert.prompt(
            'Enter Password',
            'Please enter your current password to proceed with account deletion.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: (password) => {
                        setCurrentPassword(password);
                        handleDeleteAccount(); // Call the delete account function after receiving the password
                    },
                },
            ],
            'secure-text'
        );
    };
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="#010202" />
        </TouchableOpacity>
      <Text style={styles.headerText}>Settings</Text>

      <TouchableOpacity style={styles.optionButton} onPress={handleAbout}>
        <Ionicons name="information-circle-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleChangePassword}>
        <Ionicons name="key-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleNotificationsPreferences}>
        <Ionicons name="notifications-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Notification Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handlePrivacySettings}>
        <Ionicons name="shield-checkmark-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Privacy Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={promptForPassword}>
        <Ionicons name="trash-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#ffffff',
  },
    backIcon: {
        position: 'absolute',
        left: 10,
        top: height * 0.03,
    },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    marginVertical: height * 0.01,
    backgroundColor: '#23cbfb',
    borderRadius: 10,
    paddingHorizontal: width * 0.05,
  },
  optionIcon: {
    marginRight: width * 0.03,
  },
  optionText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Settings;
