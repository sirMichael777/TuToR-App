import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function LoadingScreen({ onFinish }) {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // Ensure this method is available
        // Load resources or do something that takes time
      } catch (e) {
        console.warn(e);
      } finally {
        onFinish();
      }
    }

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
});
