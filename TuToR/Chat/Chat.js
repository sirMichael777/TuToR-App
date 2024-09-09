import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";
import {collection, getDoc, onSnapshot, orderBy, query, where, doc} from "firebase/firestore";
import {firestoreDB} from "../Config/firebaseConfig";
import MessageCard from "./MessageCard";
import MessageListener from "./MessageListener";

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {

    const currentUser = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [lastMessages, setLastMessages] = useState({});

    // useEffect to fetch chat rooms when the user is available
    const fetchChatRoomIDs = async () => {
        setLoading(true);
        const q = query(collection(firestoreDB, 'chats'), where('users', 'array-contains', currentUser._id));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatRoomPromises = snapshot.docs.map(async (document) => {
                const chatData = document.data();
                const otherUserId = chatData.users.find(userId => userId !== currentUser._id);

                if (!otherUserId) return null;

                const otherUserDoc = await getDoc(doc(firestoreDB, 'users', otherUserId));

                return {
                    id: document.id,
                    otherUser: otherUserDoc.data(),
                };
            });

            const chatRoomsData = await Promise.all(chatRoomPromises);
            setChatRooms(chatRoomsData);
            setLoading(false);
        });

        return () => unsubscribe();
    };

    // Fetch last message for each chat room
    const fetchLastMessage = (roomId) => {
        setLoading(true);
        const messagesRef = collection(firestoreDB, 'chats', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const lastMessage = fetchedMessages[0];

            if (lastMessage) {
                setLastMessages((prevState) => ({
                    ...prevState,
                    [roomId]: {
                        text: lastMessage.text || 'Say Hi',
                        senderId: lastMessage.senderId,
                        isRead: lastMessage.readBy.includes(currentUser._id),
                        timestamp: lastMessage.timestamp || null,
                    }
                }));
            }

            setLoading(false);
        });
    };

    // useEffect to fetch chat rooms when the user is available
    useEffect(() => {
        if (currentUser) {
            fetchChatRoomIDs();
        }
    }, [currentUser]);

    // useEffect to fetch last messages whenever chatRooms is updated
    useEffect(() => {
        chatRooms.forEach(room => {
            if (room?.id) {
                fetchLastMessage(room.id);
            }
        });
    }, [chatRooms]);

    // Sort chatRooms based on the last message timestamp before rendering
    const sortedChatRooms = [...chatRooms].sort((a, b) => {
        const aLastMessageTime = lastMessages[a.id]?.timestamp?.seconds || 0;
        const bLastMessageTime = lastMessages[b.id]?.timestamp?.seconds || 0;
        console.log(bLastMessageTime - aLastMessageTime);
        return bLastMessageTime - aLastMessageTime; // Sort by latest message first
    });

    return (
        <View style={styles.container}>
            <MessageListener navigation={navigation}/>
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
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00243a" />
                    </View>
                ) : (
                    sortedChatRooms.map((chatRoom) => (
                        <MessageCard
                            key={chatRoom.id}
                            user={chatRoom.otherUser}
                            lastMessage={lastMessages[chatRoom.id]?.text || 'Say Hi'}
                            lastMessageSenderId={lastMessages[chatRoom.id]?.senderId}
                            lastMessageTime={lastMessages[chatRoom.id]?.timestamp}
                            isRead={lastMessages[chatRoom.id]?.isRead}
                            currentUserId={currentUser._id}
                            navigation={navigation}
                        />
                    ))
                )}
            </ScrollView>
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

});

export default ChatScreen;
