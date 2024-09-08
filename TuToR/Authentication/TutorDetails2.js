import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Alert,
  Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import {isValidPhoneNumber} from '../ValidationUtils/ValidationUtils'

export default function TutorDetails2({route , navigation }) {
  const { role, email, password } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;



  const handleNext = () => {
    // Basic validation
    if (!firstName || !lastName || !phoneNumber) {
      setError('Please fill in all fields.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phoneNumber.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    // Navigate to the next screen or handle the action
    navigation.navigate('TutorDetails3',{ role, email, password, firstName, lastName, phoneNumber }); // Replace 'NextScreen' with the actual screen name
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
            placeholder="First Name" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={firstName}
            onChangeText={setFirstName}
          />
          
          <TextInput 
            placeholder="Last Name" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={lastName}
            onChangeText={setLastName}
          />
          
          <TextInput 
            placeholder="Phone Number" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

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
  contentContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)', // Dark background with opacity
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
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
