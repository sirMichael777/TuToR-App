import {Image, Text, TouchableOpacity, View,StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";


function renderMessageText(lastMessage, lastMessageSenderId, currentUserId, isRead) {
    const maxLength = 60; // Set the max length for the message before truncating

    const truncateMessage = (message) => {
        return message.length > maxLength
            ? `${message.substring(0, maxLength)}...` // Truncate and add ellipsis
            : message;
    };

    if (lastMessageSenderId === currentUserId) {
        return `You: ${truncateMessage(lastMessage)}`;
    }

    return isRead ? truncateMessage(lastMessage) : `New Message: ${truncateMessage(lastMessage)}`;
}


function formatTimestamp (timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

const MessageCard = ({ user, lastMessage, lastMessageTime, lastMessageSenderId, isRead, currentUserId, navigation,onLongPress }) => (
    <TouchableOpacity
        style={styles.messageCard}
        onPress={() => navigation.navigate('ChatScreen', { user } )}
        onLongPress={() => onLongPress(user)}
    >
        {user.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.messageImage} />
        ) : (
            <View style={styles.placeholderIcon}>
                <Ionicons name="person-circle" size={50} color="#ccc" />
            </View>
        )}
        <View style={styles.messageContent}>
            <Text style={styles.messageName}>{`${user.name} ${user.lastName}`}</Text>
            <Text style={[styles.messageText, !isRead ? styles.unreadText : null]}>
                {renderMessageText(lastMessage, lastMessageSenderId, currentUserId, isRead)}
            </Text>
        </View>
        {lastMessageTime && (
            <Text style={[styles.messageTime,!isRead ? styles.time : null]}>
                {formatTimestamp(lastMessageTime)}
            </Text>
        )}
    </TouchableOpacity>
);


const styles = StyleSheet.create({
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
    time:{
        color: '#009FE3',

    },
    unreadText: {
        fontWeight: 'bold',
        color: '#009FE3',
    },

})

export default MessageCard;