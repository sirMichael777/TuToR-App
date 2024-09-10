import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator, Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where,updateDoc,arrayUnion} from 'firebase/firestore';
import {firestoreDB} from '../Config/firebaseConfig';
import {useSelector} from 'react-redux';


const ChatScreen = ({ route, navigation }) => {
    const {user} = route.params;
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [chatRoomId, setChatRoomId] = useState(null);
    const scrollViewRef = useRef();
    const currentUser = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const setupChatRoom = async () => {
            const roomId = await createOrGetChatRoom(currentUser._id, user._id);
            setChatRoomId(roomId);
        };
        setupChatRoom();

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', scrollToBottom);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', scrollToBottom);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);  // Run once when component mounts

    useEffect(() => {
        if (chatRoomId) {
            // Only fetch messages when chatRoomId is set
            fetchMessages(chatRoomId);
            markMessagesAsRead(chatRoomId, currentUser._id);  // Call once when chatRoomId changes
        }
    }, [chatRoomId]); // This will only run when chatRoomId changes

    const createOrGetChatRoom = async (user1Id, user2Id) => {
        const chatRoomId = user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
        const chatRoomRef = doc(firestoreDB, 'chats', chatRoomId);
        const chatRoomSnapshot = await getDoc(chatRoomRef);

        if (!chatRoomSnapshot.exists()) {
            await setDoc(chatRoomRef, { users: [user1Id, user2Id], createdAt: new Date() });
        }

        return chatRoomId;
    };

    const fetchMessages = (roomId) => {
        setLoading(true);
        const messagesRef = collection(firestoreDB, 'chats', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);

            scrollToBottom();
            setLoading(false);
        });
    };

    const markMessagesAsRead = async (roomId, userId) => {
        const messagesRef = collection(firestoreDB, 'chats', roomId, 'messages');
        const q = query(messagesRef, where('readBy', 'not-in', [userId]));

        const snapshot = await getDocs(q);
        snapshot.forEach(async (doc) => {
            const messageRef = doc.ref;
            await updateDoc(messageRef, {
                readBy: arrayUnion(userId)
            });

        });
    };

    const sendMessage = async () => {

        if (messageText.trim()) {
            try {
                const messagesRef = collection(firestoreDB, 'chats', chatRoomId, 'messages');
                await addDoc(messagesRef, {
                    text: messageText,
                    senderId: currentUser._id,
                    readBy: [currentUser._id],
                    timestamp: new Date(),
                });
                setMessageText('');  // Clear the message input after sending
            } catch (error) {
                console.error('Error sending message:', error.message);
            }
        }
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>

                <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#fff" />
                </TouchableOpacity>

                {/* Profile Image and User's Name */}
                <View style={styles.profileContainer}>

                    {user?.imageUrl && user?.imageUrl !== '' ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Ionicons name="person-circle" size={40} color="#fff" />
                    )}
                    <Text style={styles.headerTitle}>{`${user.name} ${user.lastName}`}</Text>

                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Chat Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={scrollToBottom}
                    contentContainerStyle={{ paddingVertical: 10 }}
                >
                    {loading ? (
                        // Show ActivityIndicator in place of messages when loading
                        <View style={styles.loadingMessagesContainer}>
                            <ActivityIndicator size="large" color="#00243a" />
                            <Text style={styles.loadingText}>Fetching messages...</Text>
                        </View>
                    ) : (
                        // Messages List
                        messages.map((message) => (

                            <View
                                key={message.id}
                                style={[
                                    styles.messageContainer,
                                    message.senderId === currentUser._id ? styles.sentMessage : styles.receivedMessage
                                ]}
                            >
                                <Text style={styles.messageText}>{message.text}</Text>
                                <Text style={styles.messageTime}>{formatTimestamp(message.timestamp)}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Input Field */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Message"
                        placeholderTextColor="#aaa"
                        value={messageText}
                        onChangeText={text => setMessageText(text)}
                        multiline={true}
                    />
                    {messageText.trim().length > 0 && (
                        <TouchableOpacity onPress={sendMessage}>
                            <Ionicons name="send" size={24} color="#00243a"/>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00243a',
        padding: 15,
        paddingVertical: 20,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        shadowColor: '#00243a', // Shadow effect
        shadowOffset: { width: 0, height: 10 }, // Adjust shadow offset
        shadowOpacity: 0.7, // Shadow opacity
        shadowRadius: 5, // Shadow radius for blur
        elevation: 5, // Android shadow elevation
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        bottom: 5,
        left: 5,
    },
    backIcon: {
        position: 'absolute',
        left: 10,

    },
    loadingMessagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#00243a',
    },
    messageContainer: {
        maxWidth: '70%',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 20,
        padding: 10,
        position: 'relative',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#49454F',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#00243a',
    },
    messageText: {
        color: '#fff',
        paddingRight: 40,  // Add padding to the right to make space for the timestamp
        flexWrap: 'wrap',  // Ensures text wraps within the message bubble
        wordBreak: 'break-word',
    },
    messageTime: {
        color: '#009FE3',
        fontSize: 10,
        position: 'absolute',
        bottom: 5,
        right: 10, // Ensure the timestamp is on the bottom-right of the message bubble
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        borderRadius: 20,
        padding: 12,
        marginRight: 10,
    },
});

export default ChatScreen;
