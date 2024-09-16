import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { firestoreDB } from '../Config/firebaseConfig'; // Replace with your Firebase config
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import {Ionicons} from "@expo/vector-icons"; // Assuming you are using Redux to manage the user state

const { height } = Dimensions.get('window');

const Payment = ({navigation}) => {

  const currentUser = useSelector((state) => state.user.user); // Get current user from Redux
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [mobile, setMobile] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('CreditCardPayment');
  const [balance, setBalance] = useState(0); // User balance
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const fetchUserBalance = async () => {
      try {
        const userDoc = await getDoc(doc(firestoreDB, 'users', currentUser._id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBalance(userData.Balance || 0); // Default to 0 if no balance exists
          setMobile(userData.phoneNumber || ''); // Set mobile number from user data
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    if (currentUser?._id) {
      fetchUserBalance();
    }
  }, [currentUser]);

  const validateCardNumber = (number) => {
    return /^[0-9]{10,16}$/.test(number); // 13-19 digits
  };

  const validateCVV = (cvv) => {
    return /^[0-9]{3}$/.test(cvv); // 3 or 4 digits
  };

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of year
    return (
        month >= 1 &&
        month <= 12 &&
        year >= currentYear &&
        (year > currentYear || month >= currentMonth)
    );
  };

  const validateAmount = (amount) => {
    return /^[1-9]\d*(\.\d+)?$/.test(amount); // Positive number with optional decimal
  };

  const handlePayment = async () => {

    if (!amount || !validateAmount(amount)) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (selectedMethod === 'CreditCardPayment') {
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        Alert.alert('Error', 'Please enter a valid card number.');
        return;
      }

      if (!expiryDate || !validateExpiryDate(expiryDate)) {
        Alert.alert('Error', 'Please enter a valid expiry date (MM/YY).');
        return;
      }

      if (!cvv || !validateCVV(cvv)) {
        Alert.alert('Error', 'Please enter a valid CVV.');
        return;
      }
    } else if (selectedMethod === 'MobilePayment') {
      if (!mobile) {
        Alert.alert('Error', 'Please enter your mobile number.');
        return;
      }
    }

    try {
      // Process the payment (you don't need to do actual payment for the assignment)
      setLoading(true);



      // Update user's balance
      const newBalance = balance + parseFloat(amount);
      await updateDoc(doc(firestoreDB, 'users', currentUser._id), {
        Balance: newBalance,
      });
      await updateDoc(doc(firestoreDB, 'Students', currentUser._id), {
        Balance: newBalance,
      });

      // Store transaction details (excluding sensitive information)
      await addDoc(collection(firestoreDB, 'payments'), {
        payerName: currentUser.name,
        payerId: currentUser._id,
        amount: parseFloat(amount),
        method: selectedMethod,
        mobile: mobile,
        isPayment:false,
        timestamp: new Date(),
      });

      // Show success message
      Alert.alert('Success', `You have successfully loaded R${amount} credits. Your new balance is R${newBalance}.`);

      // Reset fields
      setAmount('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || !validateAmount(amount)) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (parseFloat(amount) > balance) {
      Alert.alert('Error', `You cannot withdraw more than your available balance (R${balance}).`);
      return;
    }

    if (selectedMethod === 'CreditCardPayment') {
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        Alert.alert('Error', 'Please enter a valid card number.');
        return;
      }

      if (!expiryDate || !validateExpiryDate(expiryDate)) {
        Alert.alert('Error', 'Please enter a valid expiry date (MM/YY).');
        return;
      }

      if (!cvv || !validateCVV(cvv)) {
        Alert.alert('Error', 'Please enter a valid CVV.');
        return;
      }
    } else if (selectedMethod === 'MobilePayment') {
      if (!mobile) {
        Alert.alert('Error', 'Please enter your mobile number.');
        return;
      }
    }

    try {
      // Process the withdrawal
      setLoading(true);

      // Deduct the balance for the withdrawal
      const newBalance = balance - parseFloat(amount);
      await updateDoc(doc(firestoreDB, 'users', currentUser._id), {
        Balance: newBalance,
      });
      await updateDoc(doc(firestoreDB, 'Tutors', currentUser._id), {
        Balance: newBalance,
      });

      // Log the withdrawal in the 'payments' collection
      await addDoc(collection(firestoreDB, 'payments'), {
        payerName: currentUser.name,
        payerId: currentUser._id,
        amount: -parseFloat(amount),
        method: 'withdrawal', // Treat it as a withdrawal method
        mobile: mobile,
        isPayment: false, // Indicating this is a withdrawal (not a payment)
        timestamp: new Date(),
      });

      Alert.alert('Success', `You have successfully withdrawn R${amount}. Your new balance is R${newBalance}.`);

      // Reset fields
      setAmount('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error processing withdrawal:', error);
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
    }
  };



  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="#010202" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Load Credits</Text>
        </View>

        <Text style={styles.label}>Select Payment Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
              style={[styles.methodButton, selectedMethod === 'CreditCardPayment' && styles.selectedMethod]}
              onPress={() => setSelectedMethod('CreditCardPayment')}
          >
            <Text style={styles.methodText}>Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.methodButton, selectedMethod === 'MobilePayment' && styles.selectedMethod]}
              onPress={() => setSelectedMethod('MobilePayment')}
          >
            <Text style={styles.methodText}>Mobile Payment</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Enter Amount (R)</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 100"
        />

        {selectedMethod === 'CreditCardPayment' && (
            <>
              <Text style={styles.label}>Credit Card Number</Text>
              <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1234 5678 9012 3456"
              />

              <Text style={styles.label}>Expiry Date (MM/YY)</Text>
              <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/YY"
              />

              <Text style={styles.label}>CVV</Text>
              <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  secureTextEntry={true}
              />
            </>
        )}

        {selectedMethod === 'MobilePayment' && (
            <>
              <Text style={styles.label}>Mobile Payment Number</Text>
              <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={mobile}
                  onChangeText={setMobile} // Allow them to update the number
                  placeholder="Enter your mobile number"
              />
            </>
        )}

        <TouchableOpacity style={styles.paymentButton}
                          onPress={currentUser.role === 'Tutor' ? handleWithdrawal : handlePayment}
                          disabled={loading}
        >
          <Text style={styles.paymentButtonText}>{loading ? "Processing..." : (currentUser.role === 'Tutor' ? "Withdraw" : "Proceed to Payment")}</Text>
        </TouchableOpacity>
      </ScrollView>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: height,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  selectedMethod: {
    backgroundColor: '#007BFF',
  },
  methodText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paymentButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Payment;
