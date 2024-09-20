import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import {sendPasswordResetEmail} from 'firebase/auth'
import {firebaseAuth} from "../Config/firebaseConfig";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(firebaseAuth, email); // Pass actionCodeSettings
      setLoading(false);
      Alert.alert('Success', 'Password reset email sent!');
      navigation.navigate('SignInScreen'); // Navigate to reset screen
    } catch (error) {
      setLoading(false);
      console.error('Error resetting password:', error);
      Alert.alert('Error', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/LoadingPage.png')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.fixedContainer}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.description}>
            Please enter the email address associated with your account, and we'll send you an email to reset your password.
          </Text>

          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            placeholderTextColor="#a9a9a9" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handlePasswordReset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send link'}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  fixedContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)',
    borderRadius: 20,
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  description: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 15,
    height: 50,
  },
  button: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
