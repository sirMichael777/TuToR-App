import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth, firestoreDB } from '../Config/firebaseConfig'; // Import your firebase config
import { doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firebase
    const fetchUserProfile = async () => {
        try {
            const user = firebaseAuth.currentUser;

            if (user) {
                // Get user profile data from Firestore
                const userDocRef = doc(firestoreDB, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setProfileData(userDoc.data());
                } else {
                    console.error('No user data found!');
                    Alert.alert('Error', 'No user data found in Firestore.');
                }
            } else {
                console.error('No user is logged in!');
                Alert.alert('Error', 'No user is currently logged in.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to fetch user data.');
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#23cbfb" />
                <Text>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Profile</Text>

            <View style={styles.profileInfoContainer}>
                <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                    {profileData?.name? `${profileData.name} ${profileData.lastName || ''}`: 'User Name'}
                </Text>
                    <Text style={styles.profileEmail}>
                        {firebaseAuth.currentUser?.email || 'user@example.com'}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <View style={styles.profileImagePlaceholder}>
                        <Ionicons name="person-circle-outline" size={width * 0.15} color="#cccccc" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PersonalInfo')}>
                    <Ionicons name="pencil-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Personal Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Payment')}>
                    <Ionicons name="card-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('WelcomeScreen')}>
                    <Ionicons name="log-out-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: height * 0.03,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // 5% padding
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: width * 0.06, // 6% of screen width
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.02, // 2% of screen height
    },
    profileInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.05, // 5% of screen height
    },
    profileDetails: {
        backgroundColor: '#001F3F',
        paddingVertical: height * 0.015, // 1.5% of screen height
        paddingHorizontal: width * 0.05, // 5% of screen width
        borderRadius: width * 0.05, // 5% border radius
    },
    profileName: {
        color: '#ffffff',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
    profileEmail: {
        color: '#ffffff',
        fontSize: width * 0.04, // 4% of screen width
    },
    profileImagePlaceholder: {
        width: width * 0.15, // 15% of screen width
        height: width * 0.15, // 15% of screen width
        borderRadius: width * 0.075, // 50% of the image width (circular)
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc',
    },
    optionsContainer: {
        backgroundColor: '#23cbfb',
        borderRadius: width * 0.05, // 5% border radius
        padding: width * 0.05, // 5% padding
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.015, // 1.5% of screen height
    },
    optionIcon: {
        marginRight: width * 0.03, // 3% of screen width
    },
    optionText: {
        color: '#ffffff',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
