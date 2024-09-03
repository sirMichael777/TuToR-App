import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {

    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Chat</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.subHeaderContainer}>
                <Text style={styles.subHeaderTitle}>messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TutorSearchScreen')}>
                    <Ionicons name="add-circle-outline" size={30} color="#00243a" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {loading? (
                <>
                    <View className="w-full flex items-center justify-center">
                        <ActivityIndicator size={"large"} color="#00243a" />
                    </View>
            </>) : (<>
                <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
                    <MessageCard/>
            </>
            )}
            </ScrollView>
        </View>
    );
};

const MessageCard = () => (
    <TouchableOpacity style={styles.messageCard}>
        {/*{tutor.imageUrl && tutor.imageUrl !== '' (*/}
        {/*    <Image source={{ uri: imageUrl }} style={styles.messageImage} />*/}
        {/*) : (*/}
            <View style={styles.placeholderIcon}>
                    <Ionicons name="person-circle" size={50} color="#ccc" />
            </View>
        {/*)}*/}
        <View style={styles.messageContent}>
            <Text style={styles.messageName}>Thabang</Text>
            <Text style={styles.messageText}>How can I be of assistance?</Text>
        </View>
        <Text style={styles.messageTime}>45mins</Text>
    </TouchableOpacity>
);

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
    subHeaderContainer: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    subHeaderTitle: {
        fontSize: 18,
        color: '#00243a',
        fontWeight: 'bold',
    },
    scrollViewContainer: {
        paddingVertical: 10,
    },
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 10,
        marginBottom: 3,
        borderRadius: 10,
    },
    messageImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    placeholderIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    messageContent: {
        flex: 1,
    },
    messageName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00243a',
    },
    messageText: {
        fontSize: 14,
        color: '#4a4a4a',
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
    },
});

export default ChatScreen;
