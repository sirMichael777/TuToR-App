import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) { // Accept navigation as a prop

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('AuthTypeScreen', { action: 'SignUp' })} // Navigate to SignUpScreen
          >
            <Text style={styles.buttonText }>Create Account</Text>
          </TouchableOpacity>
          
          {/* Add navigation to the SignInScreen */}
          <TouchableOpacity 
            style={styles.signInContainer}
            onPress={() => navigation.navigate('SignInScreen')} // Navigate to SignInScreen
          >
            <Text style={styles.signInText }>
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
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
    backgroundColor: '#00243a',
    borderRadius: 25,
    marginBottom:15,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
  signInContainer: {
    marginBottom: 50,
  },
  signInText: {
    fontSize: width * 0.05,
    color: '#00243a',
    fontFamily: 'Ubuntu_400Regular',
  },
  signInLink: {
    color: '#0096FF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
