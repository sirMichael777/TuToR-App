import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ActivityIndicator, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { firestoreDB } from '../Config/firebaseConfig'; // Import your firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import {Ionicons} from "@expo/vector-icons";

const {  height } = Dimensions.get('window');

// TransactionCard Component
const TransactionCard = ({ transaction }) => {
    const { name, amount, timestamp, method } = transaction;

    // Convert Firestore Timestamp to a Date object, then format it to a readable string (e.g., 02:14 August 13)
    const formattedDate = timestamp?.seconds
        ? new Date(timestamp.seconds * 1000).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'long',
        })
        : 'Date not available'; // Handle case when the date doesn't exist

    return (
        <View style={styles.transactionCard}>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{name}</Text>
                <Text style={styles.transactionDate}>{formattedDate}</Text>
                <Text style={styles.transactionType}>{method}</Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    { color: amount > 0 ? 'green' : 'red' }, // Color based on positive or negative value
                ]}
            >
                {amount > 0 ? `+R${amount.toFixed(2)}` : `-R${Math.abs(amount).toFixed(2)}`} {/* Ensure two decimal places */}
            </Text>
        </View>
    );
};

const TransactionHistory = ({navigation}) => {
    const currentUser = useSelector((state) => state.user.user);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetching the payment history from Firestore
                const paymentsQuery = query(
                    collection(firestoreDB, 'payments'),
                    where('userId', '==', currentUser._id) // Fetch transactions for the current user
                );
                const querySnapshot = await getDocs(paymentsQuery);
                const fetchedTransactions = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error('Error fetching transaction history: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [currentUser]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading transaction history...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Transaction History</Text>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionCard transaction={item} />}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
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
    transactionCard: {
        backgroundColor: '#E0F7FA', // Light blue background
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionDetails: {
        flexDirection: 'column',
    },
    transactionName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000', // Black text
    },
    transactionDate: {
        fontSize: 12,
        color: '#666', // Grey text for the date
    },
    transactionType: {
        fontSize: 12,
        color: '#666', // Grey text for the transaction type
    },
    transactionAmount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: height * 0.1, // Adjust the padding for scrollable space
    },
});

export default TransactionHistory;
