import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView, KeyboardAvoidingView
} from 'react-native';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {firebaseAuth, firestoreDB} from "../Config/firebaseConfig";
import {doc, setDoc} from "firebase/firestore";

export default function StudentDetails2({ route,navigation }) {
  const {role,email, password } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  const handleCreateAccount = async () => {
    // Basic validation
    if (!firstName || !lastName || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }



    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      const data = {
        _id: userCredential?.user.uid,
        name: firstName,
        ImageUrl: '',
        Balance: 0,
        lastName: lastName,
        phoneNumber: phoneNumber,
        role: role,
        rating: 0,
        reviews: [],
        ratingCount: 0,
        acceptedTerms: false,
        providerData: userCredential.user.providerData[0] || null,
      };

      await setDoc(doc(firestoreDB, 'users', userCredential?.user.uid), data);
      await setDoc(doc(firestoreDB, 'Students', userCredential?.user.uid), data);
      setLoading(false);
      navigation.navigate('TermsAndConditions', { userId: userCredential.user.uid });


      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      setLoading(false)
      console.error("Error creating user: ", error.message);
      Alert.alert('Error', error.message);
    }
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
              <Text style={[styles.title, { fontSize: width * 0.05 }]}>Complete your details</Text>

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
                  keyboardType="phone-pad"
                  style={[styles.input, { paddingVertical: height * 0.02 }]}
                  placeholderTextColor="#a9a9a9"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
              />

              <TouchableOpacity
                  style={[styles.button, { paddingVertical: height * 0.02 }]}
                  onPress={handleCreateAccount}
                  disabled={loading}
              >
                {loading ? ( //// Show loading spinner when loading
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Create Account</Text>
                )}
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
    resizeMode: 'cover',
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
