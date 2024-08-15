import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Implement sign-in logic here
    Alert.alert('Sign In', 'Sign in logic goes here.');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/images/LoadingPage.png')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.fixedContainer}>
          <Text style={styles.title}>Sign in</Text>

          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            placeholderTextColor="#a9a9a9" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput 
            placeholder="Password" 
            secureTextEntry 
            style={styles.input} 
            placeholderTextColor="#a9a9a9" 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
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
  linkText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginTop: 20,
    textAlign: 'center',
  },
});
