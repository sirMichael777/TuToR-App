import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {collection, query, where, getDocs, orderBy} from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

// Function to format balance in ZAR
const formatToZAR = (amount) => {
    return `R${Number(amount).toFixed(2)}`;
};

const EarningsScreen = ({ navigation }) => {
    const currentUser = useSelector((state) => state.user.user); // Get current user from Redux
    const [payments, setPayments] = useState([]);
    const [earnings, setEarnings] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch payments where recipientId matches the current user
    useEffect(() => {


        setLoading(true);
        const fetchPayments = async () => {
            try {
                const paymentsQuery = query(
                    collection(firestoreDB, 'payments'),
                    where('recipientId', '==', currentUser._id),
                    orderBy('timestamp', 'desc'),
                );
                const paymentsSnapshot = await getDocs(paymentsQuery);
                const paymentsList = paymentsSnapshot.docs.map(doc => doc.data());

                // Calculate total earnings from payments
                const totalEarnings = paymentsList.reduce((acc, payment) => acc + Number(payment.amount), 0);

                setPayments(paymentsList);
                setEarnings(totalEarnings);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
            setLoading(false);
        };

        if (currentUser?._id) {
            fetchPayments();
        }
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Earnings</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name="notifications-outline" size={30} color="black" />
                    </TouchableOpacity>
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

            {/* ScrollView for listing payments */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <>
                    <View style={styles.earningsOverview}>
                        <Text style={styles.earningsOverviewText}>Earnings Overview</Text>
                    </View>

                    <View style={styles.earningsCard}>
                        <Text style={styles.cardText}>
                            Total Earnings: {formatToZAR(earnings)}
                        </Text>
                        <Text style={styles.cardText}>
                            Current Balance: {formatToZAR(currentUser.Balance)}
                        </Text>
                    </View>


                    {/* ScrollView for listing payments */}
                    <ScrollView style={styles.scrollView}>
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <View key={index} style={styles.paymentItem}>
                                    <Text style={styles.paymentText}>From: {payment.payerName}</Text>
                                    <Text style={styles.paymentText}>Amount: {formatToZAR(payment.amount)}</Text>
                                    <Text style={styles.paymentText}>Date: {new Date(payment.timestamp.seconds * 1000).toLocaleDateString()}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noPaymentsText}>No payments received yet.</Text>
                        )}
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: width * 0.05, // Use 5% padding for a consistent layout
    },
    header: {
        top:height*0.03,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 15,
        marginLeft: 15,
    },
    earningsOverview: {
        marginVertical: height * 0.02,
    },
    earningsOverviewText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#001F3F',
    },
    earningsCard: {
        backgroundColor: '#001F3F',
        borderRadius: width * 0.05,
        padding: width * 0.05,
        width: '100%',
        marginBottom: height * 0.02,
        alignItems: 'center',
    },
    cardText: {
        fontSize: width * 0.045,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: height * 0.01,  // Add margin to separate earnings and balance text
    },
    scrollView: {
        marginTop: height * 0.01,
        marginBottom: height * 0.03, // Allow space for bottom navigation
    },
    paymentItem: {
        backgroundColor: '#f0f0f0',
        padding: width * 0.04,
        borderRadius: 10,
        marginBottom: height * 0.02,
    },
    paymentText: {
        fontSize: width * 0.045,
        color: '#333',
    },
    noPaymentsText: {
        textAlign: 'center',
        fontSize: width * 0.05,
        color: '#999',
        marginTop: height * 0.05,
    },
});

export default EarningsScreen;
