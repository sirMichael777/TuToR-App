import React, {useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth } from '../Config/firebaseConfig'; // Import your firebase config
import {signOut} from "firebase/auth";
import {useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {

    const currentUser = useSelector((state) => state.user.user);

    const handleLogOut = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        try {
                            await signOut(firebaseAuth); // Sign out from Firebase authentication
                        } catch (error) {
                            console.error('Error signing out:', error.message); // Handle any error during sign out
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    useFocusEffect(
        useCallback(() => {
            // Here, you could refetch the user from the database if needed
            // This is just a placeholder; assume your user state will automatically update from Redux
            // e.g., after updating the user on the edit screen
        }, [currentUser])

    );
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={28} color="#010202" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Profile</Text>

            <View style={styles.profileInfoContainer}>
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>
                        {currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}` : 'User Name'}
                    </Text>
                    <Text style={styles.profileEmail}>
                        {currentUser.providerData.email || 'user@example.com'}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('PersonalInfo')}>
                    {currentUser.imageUrl ? (
                        <Image
                            source={{ uri: currentUser.imageUrl }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Ionicons name="person-circle-outline" size={width * 0.15} color="black" />
                        </View>
                    )}
                </TouchableOpacity>


            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PersonalInfo')}>
                    <Ionicons name="pencil-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Personal Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PaymentPage')}>
                    <Ionicons name="card-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={handleLogOut}>
                    <Ionicons name="log-out-outline" size={width * 0.06} color="#F80606FF" style={styles.optionIcon} />
                    <Text style={styles.optionLogText}>Log out</Text>
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
    backIcon: {
        position: 'absolute',
        left: 10,
        top: height * 0.025,
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
    optionLogText:{
        color: '#F80606FF',
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
    profileImage: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: width * 0.075,
    },
});

export default ProfileScreen;
