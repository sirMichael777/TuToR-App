import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';

export default function EnterResetCodeScreen({ navigation }) {

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  const handleCodeEntry = (code) => {
    setResetCode(code);
    if (code === '777') {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
    }
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert('Success', 'Password has been reset.');
    // Add navigation to the login or another screen if needed
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/LoadingPage.png')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.fixedContainer}>
          <Text style={styles.title}>Enter Reset Code</Text>

          <TextInput 
            placeholder="Reset Code" 
            style={styles.input} 
            placeholderTextColor="#a9a9a9" 
            value={resetCode}
            onChangeText={handleCodeEntry}
          />

          {isCodeValid && (
            <>
              <TextInput 
                placeholder="Enter New Password" 
                secureTextEntry 
                style={styles.input} 
                placeholderTextColor="#a9a9a9" 
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <TextInput 
                placeholder="Confirm Password" 
                secureTextEntry 
                style={styles.input} 
                placeholderTextColor="#a9a9a9" 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={handleResetPassword}
            disabled={!isCodeValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
});
