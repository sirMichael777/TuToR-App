import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Chat</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.chatListContainer}>
                <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatDetail')}>
                    <Image source={require('../assets/images/background-image.png')} style={styles.chatAvatar} />
                    <Text style={styles.chatText}>TuToR Support</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // 5% of screen width
    },
    header: {
        top:height*0.03,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    profileIcon: {
        marginLeft: 15,
    },
    chatListContainer: {
        flex: 1,
        justifyContent: 'flex-start', // Ensures chat items are at the top
        paddingHorizontal: width * 0.01, // 5% of screen width for padding on the sides
        top: height * 0.02,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02, // 2% of screen height for vertical padding
        backgroundColor: '#e6f7ff',

        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: width * 0.02, // 2% of screen width for rounded corners
    },
    chatAvatar: {
        width: width * 0.13, // 13% of screen width
        height: width * 0.13, // 13% of screen width
        borderRadius: (width * 0.13) / 2, // make it circular
        marginRight: width * 0.04, // 4% of screen width for spacing
    },
    chatText: {
        fontSize: width * 0.045, // 4.5% of screen width
        fontWeight: 'bold',
    },
});

export default ChatScreen;
