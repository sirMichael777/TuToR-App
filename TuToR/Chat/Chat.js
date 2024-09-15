import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Image,
    Alert, Modal
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";
import {collection, getDoc, onSnapshot, orderBy, query, where, doc, deleteDoc, getDocs} from "firebase/firestore";
import {firestoreDB} from "../Config/firebaseConfig";
import MessageCard from "./MessageCard";
import MessageListener from "./MessageListener";
import NotificationIcon from "../Notifications/NotificationIcon";

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {

    const currentUser = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [ setSelectedChatRoom] = useState(null);

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
        return bLastMessageTime - aLastMessageTime; // Sort by latest message first
    });

    const handleLongPress = (chatRoom) => {
        setTimeout(() => {
        Alert.alert(
            'Delete selected user',
            `Do you really want to delete ${chatRoom.otherUser.name} this action can not be undone`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setSelectedChatRoom(chatRoom.id); // Track which chat room is being deleted
                        deleteChatRoom(chatRoom.id);
                    },
                    style: 'destructive',  // Make the delete option destructive (usually red)
                },
            ],
            { cancelable: true }
        );
        }, 1000);
    };

    const deleteChatRoom = async (roomId) => {
        try {
            setIsDeleting(true);
            // Delete all messages associated with the chat room
            const messagesRef = collection(firestoreDB, 'chats', roomId, 'messages');
            const messagesSnapshot = await getDocs(messagesRef);

            const deletePromises = messagesSnapshot.docs.map(doc =>
            deleteDoc(doc.ref));

           await Promise.all(deletePromises);

            // Delete the chat room document itself
            await deleteDoc(doc(firestoreDB, 'chats', roomId));
            setIsDeleting(false);

            console.log(`Chat room with ID ${roomId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting chat room:', error);
        }finally {
            setIsDeleting(false);
        }
    };

    return (
        <View style={styles.container}>
            <MessageListener navigation={navigation}/>
            <View style={styles.header}>
                <Text style={styles.headerText}>Chat</Text>
                <View style={styles.iconContainer}>
                    <NotificationIcon navigation={navigation} />
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                            {currentUser?.imageUrl ? (
                                <Image
                                    source={{ uri: currentUser.imageUrl }}
                                    style={styles.profileImage} // Add the style for the profile image
                                />
                            ) : (
                                <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
                            )}
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
                            onLongPress={() => handleLongPress(chatRoom)}
                        />
                    ))
                )}
            </ScrollView>

            <Modal visible={isDeleting} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.modalText}>Deleting chat...</Text>
                    </View>
                </View>
            </Modal>
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
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15, // Make it circular
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background
    },
    modalContent: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
