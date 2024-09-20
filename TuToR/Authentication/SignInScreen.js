import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView, ScrollView, Alert
} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../Config/firebaseConfig";
import { isValidEmail } from "../ValidationUtils/ValidationUtils";
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Manage password visibility


  const handleSignIn = async () => {
    if (isValidEmail(email) && email !== "") {
      setLoading(true);
      await signInWithEmailAndPassword(firebaseAuth, email, password)
          .then((userCredential) => {
            setTimeout(() => {
              setLoading(false);
            }, 4000);
          })
          .catch((error) => {
            setLoading(false);  // Set loading to false after error
            setError(error.message.includes('invalid-credential') ? "Incorrect password or email" : 'User does not exist');
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 5000);
          });
    } else {
      setError('Invalid email format.');
      setShowError(true);
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
            source={require('../assets/images/LoadingPage.png')}
            style={styles.background}
            imageStyle={styles.imageStyle}
        >
          <View style={styles.fixedContainer}>
            <Text style={styles.title}>Sign in</Text>

            {showError && (<Text style={styles.error}>{error}</Text>)}

            <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#a9a9a9"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  placeholderTextColor="#a9a9a9"
                  value={password}
                  onChangeText={setPassword}
              />
              <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#a9a9a9" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                  <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AuthTypeScreen', { action: 'SignUp' })}>
              <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 15,
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 15,
    height: 50,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
  },
  eyeIcon: {
    marginLeft: 10,
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
  linkText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginTop: 20,
    textAlign: 'center',
  },
});
