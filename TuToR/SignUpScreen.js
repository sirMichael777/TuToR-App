import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      >
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign up as?</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Tutor</Text>
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
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 36, 58, 0.9)', // Dark background with opacity
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    marginTop: 'auto',  // Move the buttons and text towards the bottom
    marginBottom: '20%',  // Provide space between buttons and the bottom of the screen
  },
  titleContainer: {
    marginBottom: 40,  // Increase space between the logo and the "Sign up as?" text
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#00243a',
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
  },
});
