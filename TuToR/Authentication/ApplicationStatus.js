import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, BackHandler} from 'react-native';
import {signOut} from "firebase/auth";
import {firebaseAuth} from "../Config/firebaseConfig";

export default function ApplicationStatus({ navigation }) {
  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  useEffect(() => {
    const backAction = () => {
      // Returning true disables the back button
      return true;
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => backHandler.remove();
  }, []);


  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth); // Sign out from Firebase authentication
    } catch (error) {
      console.error('Error signing out:', error.message); // Handle any error during sign out
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/LoadingPage.png')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.1 }]}>
          <Text style={styles.title}>Thank you for applying to become a tutor!</Text>
          <Text style={styles.bodyText}>
            Your application is currently under review. We are verifying your qualifications and experience to ensure the highest quality for our students.
          </Text>

          <TouchableOpacity 
            style={[styles.button, { marginTop: 30 }]} 
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>OK</Text>
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
  contentContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 16,
  },
});
