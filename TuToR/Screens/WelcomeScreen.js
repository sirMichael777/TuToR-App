import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function WelcomeScreen({ navigation }) { // Accept navigation as a prop
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.contentContainer, { paddingBottom: height * 0.05 }]}>
          <TouchableOpacity 
            style={[styles.createAccountButton, { paddingVertical: height * 0.02, paddingHorizontal: width * 0.3 }]}
            onPress={() => navigation.navigate('SignUpScreen')} // Navigate to SignUpScreen
          >
            <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Create Account</Text>
          </TouchableOpacity>
          
          {/* Add navigation to the SignInScreen */}
          <TouchableOpacity 
            style={styles.signInContainer}
            onPress={() => navigation.navigate('SignInScreen')} // Navigate to SignInScreen
          >
            <Text style={[styles.signInText, { fontSize: width * 0.04 }]}>
              Already a member? <Text style={styles.signInLink}>Sign in</Text>
            </Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  createAccountButton: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
  signInContainer: {
    marginTop: 10,
  },
  signInText: {
    color: '#00243a',
    fontFamily: 'Ubuntu_400Regular',
  },
  signInLink: {
    color: '#0096FF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
