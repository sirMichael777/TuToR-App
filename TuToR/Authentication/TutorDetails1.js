import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for eye icon
import { isStrongPassword, isValidEmail } from "../ValidationUtils/ValidationUtils";

export default function TutorDetails1({ route, navigation }) {
  const { role } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility

  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleNext = () => {
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    // Navigate to the next screen
    navigation.navigate('TutorDetails2', { role, email, password });
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ImageBackground
              source={require('../assets/images/LoadingPage.png')}
              style={styles.background}
              imageStyle={styles.imageStyle}
          >
            <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.15 }]}>
              <Text style={[styles.title, { fontSize: width * 0.05 }]}>Apply to become a tutor</Text>
              {showError && (<Text style={styles.error}>{error}</Text>)}
              <TextInput
                  placeholder="Email"
                  style={[styles.input, { paddingVertical: height * 0.02 }]}
                  placeholderTextColor="#a9a9a9"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
              />

              {/* Password input with eye icon */}
              <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    style={[styles.passwordInput, { paddingVertical: height * 0.02 }]}
                    placeholderTextColor="#a9a9a9"
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#a9a9a9" />
                </TouchableOpacity>
              </View>

              {/* Confirm password input with eye icon */}
              <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Re-enter Password"
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.passwordInput, { paddingVertical: height * 0.02 }]}
                    placeholderTextColor="#a9a9a9"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="#a9a9a9" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                  style={[styles.button, { paddingVertical: height * 0.02 }]}
                  onPress={handleNext}
              >
                <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Next</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    flex: 1,
    resizeMode: 'cover',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)', // Dark background with opacity
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
