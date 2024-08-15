import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Profile</Text>

            <View style={styles.profileInfoContainer}>
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>Thabang Mokoena</Text>
                    <Text style={styles.profileEmail}>shaunthabang835@gmail.com</Text>
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <View style={styles.profileImagePlaceholder}>
                        <Ionicons name="person-circle-outline" size={width * 0.15} color="#cccccc" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton}>
                    <Ionicons name="pencil-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Personal Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <Ionicons name="card-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <Ionicons name="settings-outline" size={width * 0.06} color="#ffffff" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}  onPress={() => navigation.navigate('WelcomeScreen')}>
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
        top:height*0.03,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // 5% padding
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
