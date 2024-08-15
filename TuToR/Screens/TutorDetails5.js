import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function TutorDetails5({ navigation }) {
  const [idFile, setIdFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);

  const uploadDocument = async (setFile, fileType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
      });

      if (result.type === 'success') {
        setFile(result);
        console.log(`${fileType} picked:`, result);
        Alert.alert('Success', `${fileType} uploaded successfully!`);
      } else if (result.type === 'cancel') {
        console.log('Document pick was canceled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick the document. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/LoadingPage.png')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.fixedContainer}>
          <Text style={styles.title}>Upload documents</Text>

          <TouchableOpacity
            style={[styles.button, idFile && styles.uploadedButton]}
            onPress={() => uploadDocument(setIdFile, 'ID')}
          >
            {idFile ? (
              <View style={styles.uploadedContainer}>
                <FontAwesome name="file" size={24} color="white" />
                <Text style={styles.uploadedText}>{idFile.name}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Upload ID</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, cvFile && styles.uploadedButton]}
            onPress={() => uploadDocument(setCvFile, 'CV')}
          >
            {cvFile ? (
              <View style={styles.uploadedContainer}>
                <FontAwesome name="file" size={24} color="white" />
                <Text style={styles.uploadedText}>{cvFile.name}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Upload CV</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, transcriptFile && styles.uploadedButton]}
            onPress={() => uploadDocument(setTranscriptFile, 'Transcript')}
          >
            {transcriptFile ? (
              <View style={styles.uploadedContainer}>
                <FontAwesome name="file" size={24} color="white" />
                <Text style={styles.uploadedText}>{transcriptFile.name}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Upload Transcript</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={() => {
              if (idFile && cvFile && transcriptFile) {
                navigation.navigate('ApplicationStatus');
              } else {
                navigation.navigate('ApplicationStatus');
                //Alert.alert('Missing Documents', 'Please upload all required documents.');
              }
            }}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
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
  button: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  uploadedButton: {
    backgroundColor: '#4CAF50', // Green to indicate success
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedText: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Ubuntu_400Regular',
  },
  applyButton: {
    backgroundColor: '#00243a',
    marginTop: 20,
  },
  buttonText: {
    color: '#00243a',
    fontFamily: 'Ubuntu_400Regular',
    textAlign: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
