import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useSelector} from "react-redux"; // Import icons from Expo

const { width,height } = Dimensions.get('window');

const PaymentsPage = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user);
    const navigateToHistory = () => {
        navigation.navigate('TransactionHistory'); // Assuming you have a History page in your navigation
    };

    const navigateToLoadCredits = () => {
        navigation.navigate('Payment'); // Assuming you have a LoadCredits page in your navigation
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#010202" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Payments</Text>
            </View>
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={navigateToHistory}>
                    <MaterialCommunityIcons name="file-document-outline" size={30} color="#FFFFFF" style={styles.icon} />
                    <Text style={styles.optionText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={navigateToLoadCredits}>
                    <MaterialCommunityIcons name="wallet-outline" size={30} color="#FFFFFF" style={styles.icon} />
                    <Text style={styles.optionText}>{currentUser.role==='Student' ?'Load Credits': 'Withdraw Cash'}</Text>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    backIcon: {
        padding: 10, // Increased padding for better touchable area
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // Center the text with flex
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

export default PaymentsPage;
