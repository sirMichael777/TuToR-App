import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('CreditCard');

  const handlePayment = () => {
    if (!amount || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would add payment processing logic (e.g., API call to payment gateway)
    Alert.alert('Success', `You have successfully loaded R${amount} credits`);
    setAmount('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Load Credits</Text>

      <Text style={styles.label}>Select Payment Method</Text>
      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[styles.methodButton, selectedMethod === 'CreditCard' && styles.selectedMethod]}
          onPress={() => setSelectedMethod('CreditCard')}
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

      {selectedMethod === 'CreditCard' && (
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
            placeholder="Enter your mobile number"
          />
        </>
      )}

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: height,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
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
