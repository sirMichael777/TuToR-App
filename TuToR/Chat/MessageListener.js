import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {collection, doc, getDoc, limit, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import {firestoreDB} from '../Config/firebaseConfig';
import {useSelector} from 'react-redux';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import * as Animatable from 'react-native-animatable';
import {useNavigationState} from "@react-navigation/native";


const MessageListener = ({navigation}) => {
    const currentUser = useSelector((state) => state.user.user);
    const [visible, setVisible] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [sender, setSender] = useState(null);
    const [chatRooms, setChatRooms] = useState([]);


    const currentRoute = useNavigationState(state => {
        const route = state.routes[state.index];
        return route.name;
    });
    const condition2 =currentRoute !== 'Chat';

    const fetchChatRoomIDs = () => {
        if (!currentUser) return;

        const q = query(
            collection(firestoreDB, 'chats'),
            where('users', 'array-contains', currentUser._id)
        );

        return onSnapshot(q, (snapshot) => {
            const rooms = snapshot.docs.map((document) => ({
                id: document.id,
                users: document.data().users,
            }));
            setChatRooms(rooms);
        });
    };

    // Fetch last messages when chatRooms state is updated
    useEffect(() => {
        if (!chatRooms.length) return;

        const unsubscribeMessages = chatRooms.map((room) => {
            const otherUserId = room.users.find(userId => userId !== currentUser._id);

            if (otherUserId) {
                const messagesRef = collection(firestoreDB, 'chats', room.id, 'messages');
                const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

                return onSnapshot(lastMessageQuery, async (messageSnapshot) => {
                    const lastMessageData = messageSnapshot.docs[0]?.data();
                    const condition1 = lastMessageData.readBy.includes(currentUser._id)


                    if (lastMessageData && lastMessageData.senderId !== currentUser._id && condition2 && !condition1) {
                        const senderDoc = await getDoc(doc(firestoreDB, 'users', otherUserId));
                        const senderData = senderDoc.data();

                        setSender(senderData);
                        setLastMessage(lastMessageData.text);
                            setVisible(true);

                            // After 2 seconds, hide the popup
                            setTimeout(() => {
                                setVisible(false);
                            }, 2000);

                    }
                });
            }
        });

        // Cleanup listeners on unmount
        return () => {
            unsubscribeMessages.forEach(unsubscribe => unsubscribe && unsubscribe());
        };
    }, [chatRooms,condition2]);

    // Call the fetchChatRoomIDs on component mount
    useEffect(() => {
        if (currentUser) {
            const unsubscribe = fetchChatRoomIDs();
            return () => unsubscribe && unsubscribe(); // Clean up listener on unmount
        }
    }, [currentUser]);

    // Navigate to chat screen when the popup is clicked
    const handleChatNavigation = () => {
        setVisible(false);
        if (sender) {
            navigation.navigate('ChatScreen', { user: sender });
        }
    };
    return (
        <View>
            <Dialog
                visible={visible}
                onTouchOutside={() => setVisible(false)} // Close dialog when clicked outside
                dialogStyle={styles.dialogStyle}
            >
                <DialogContent>
                    {/* Wrap the dialog content with Animatable for animation */}
                    <Animatable.View animation="fadeInUp" duration={500} useNativeDriver>
                        <TouchableOpacity onPress={handleChatNavigation}>
                            <Text style={styles.senderName}>{sender?.name} {sender?.lastName}</Text>
                            <Text style={styles.messageText}>New Message: {lastMessage}</Text>
                            <Text style={styles.clickText}>Click to open chat</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </DialogContent>
            </Dialog>
        </View>
    );
};

const styles = StyleSheet.create({
    dialogStyle: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 15,
    },
    senderName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 10,
    },
    clickText: {
        fontSize: 14,
        color: '#007bff',
    },
});

export default MessageListener;
