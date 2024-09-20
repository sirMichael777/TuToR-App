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
const TransactionCard = ({ transaction, role }) => {
    const { payerName, recipientName, amount, timestamp, method } = transaction;

    // Convert Firestore Timestamp to a Date object, then format it to a readable string
    const formattedDate = timestamp?.seconds

        ? new Date(timestamp.seconds * 1000).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'long',
        })
        : 'Date not available';

    // Define amount and label based on user role and transaction type
    let displayAmount;
    let transactionLabel;

    if (role === 'Student') {
        if (method === 'sessionPayment') {
            displayAmount = `-R${Math.abs(amount).toFixed(2)}`;
            transactionLabel = `To: ${recipientName}`;

        } else if (method === 'MobilePayment' || method=== 'CreditCardPayment') {
            // For students loading credits, it's a positive value
            displayAmount = `+R${Math.abs(amount).toFixed(2)}`;
            transactionLabel =`${payerName} `;

        } else if (method === 'refund') {
            displayAmount = `R${Math.abs(amount).toFixed(2)}`;
            transactionLabel = `From: ${payerName}`;
        }

    } else if (role === 'Tutor') {

        if (method === 'earnings') {
            // For tutors receiving session payments, it’s a positive value
            displayAmount = `+R${Math.abs(amount).toFixed(2)}`;
            transactionLabel = `From: ${payerName}`;
        } else if (method === 'withdrawal') {
            // For tutors making withdrawals, it’s a negative value
            displayAmount = `-R${Math.abs(amount).toFixed(2)}`;
            transactionLabel = 'Withdrawal';
        }

    }

    return (
        <View style={styles.transactionCard}>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{transactionLabel}</Text>
                <Text style={styles.transactionType}>{method}</Text>
                <Text style={styles.transactionDate}>{formattedDate}</Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    { color: amount > 0 ? 'green' : 'red' }, // Red for outgoing, Green for incoming
                ]}
            >
                {displayAmount}
            </Text>
        </View>
    );
};

const TransactionHistory = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = currentUser.role; // Get user role (Student or Tutor)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true); // Start loading state

                // Fetching the payment history based on the user's role
                let paymentsQuery;

                if (role === 'Student') {

                    const payerQuery = query(
                        collection(firestoreDB, 'payments'),
                        where('payerId', '==', currentUser._id),
                        where('method', 'in',['sessionPayment','refund','CreditCardPayment','MobilePayment'])
                    );

                    const recipientQuery = query(
                        collection(firestoreDB, 'payments'),
                        where('recipientId', '==', currentUser._id),
                    );

                    const [payerSnapshot, recipientSnapshot] = await Promise.all([
                        getDocs(payerQuery),
                        getDocs(recipientQuery),
                    ]);

                    const payments = [
                        ...payerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                        ...recipientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    ];

                    // Sort payments by timestamp (most recent at the top)
                    const sortedPayments = payments.sort(
                        (a, b) => b.timestamp.toDate() - a.timestamp.toDate()  // Assuming 'timestamp' is a Firestore Timestamp
                    );

                    setTransactions(sortedPayments);
                } else if (role === 'Tutor') {

                    const payerQuery = query(
                        collection(firestoreDB, 'payments'),
                        where('payerId', '==', currentUser._id),
                        where ('method','in',['earnings','withdrawal'])
                    );
                    const recipientQuery = query(
                        collection(firestoreDB, 'payments'),
                        where('recipientId', '==', currentUser._id),
                        where ('method','in',['earnings','withdrawal'])
                    );

                    const [payerSnapshot, recipientSnapshot] = await Promise.all([
                        getDocs(payerQuery),
                        getDocs(recipientQuery),
                    ]);

                    const payments = [
                        ...payerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                        ...recipientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    ];

                    // Sort payments by timestamp (most recent at the top)
                    const sortedPayments = payments.sort(
                        (a, b) => b.timestamp.toDate() - a.timestamp.toDate()  // Assuming 'timestamp' is a Firestore Timestamp
                    );

                    setTransactions(sortedPayments);
                }

            } catch (error) {
                setLoading(false);
                console.error('Error fetching transaction history: ', error);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchTransactions();
    }, [currentUser, role]);


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
                renderItem={({ item }) => <TransactionCard transaction={item} role={role} />}
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
