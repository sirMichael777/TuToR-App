import React, { useState } from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, ActivityIndicator} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome } from '@expo/vector-icons';
import { firebaseStorage, firestoreDB } from "../Config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";


export default function TutorDetails5({ route,navigation }) {
  const [idFile, setIdFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const {userDets} = route.params;
  const userId = userDets._id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const uploadDocument = async (setFile, fileType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword'],
      });

      if (!result.canceled) {
        setFile(result);
        console.log(`${fileType} picked:`, result);
      } else{
        setFile(null);
        console.log('Document pick was canceled');
        setError('Document pick was canceled')
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setError('Error picking document')
    }
  };

  const handleApply = async () => {
    if (!idFile || !cvFile || !transcriptFile) {
      setError('Please upload all required documents.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    try {
      setLoading(true);

      // Upload files to Firebase Storage
      const idFileUrl = await uploadFileToStorage( idFile.assets[0].uri, 'ID');
      const cvFileUrl = await uploadFileToStorage( cvFile.assets[0].uri, 'CV');
      const transcriptFileUrl = await uploadFileToStorage( transcriptFile.assets[0].uri, 'Transcript');

      // Update the tutor data in Firestore with document URLs
      await setDoc(doc(firestoreDB, 'Tutors', userId), {
        idFileUrl,
        cvFileUrl,
        transcriptFileUrl,
        updatedAt: new Date(),
      }, { merge: true });

      setLoading(false);
      navigation.navigate('TermsAndConditions', { userId });

    } catch (error) {
      setLoading(false); 
      console.error('Error uploading documents:', error.message);
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      setError('Failed to upload documents. Please try again.');
    }
  };

  const uploadFileToStorage = async (uri,file) => {

    const  blob = await new Promise((resolve,reject)=> {
      const xhr = new XMLHttpRequest();
      xhr.onload = function (){
        resolve(xhr.response);
      };
      xhr.onerror = function (e){
        console.log(e)
        reject(new TypeError("Network Error"));
      };
      xhr.responseType = 'blob';
      xhr.open("GET",uri,true);
      xhr.send(null);
    });

    try {

      const storageRef = ref(firebaseStorage,`Tutors/${userDets._id}/${userDets.name}/${file}`);
      const result = await uploadBytes(storageRef,blob);
      blob.close();
      return await getDownloadURL(storageRef);

    }catch (err){
      setError(err.message);
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
    }
  };




  return (
    <View style={styles.container}>
      {loading ? ( 
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00243a" />
          <Text style={styles.loadingText}>Processing documents...</Text> 
        </View>
      ) : (
        <ImageBackground
          source={require('../assets/images/LoadingPage.png')}
          style={styles.background}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.fixedContainer}>
            <Text style={styles.title}>Upload documents</Text>
            {showError && (<Text style={styles.error}>{error}</Text>)}
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
              onPress={handleApply}
              disabled={loading} 
            >
              {loading ? ( 
                <ActivityIndicator size="small" color="#00243a" />
              ) : (
                <Text style={styles.applyButtonText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00243a',
    fontFamily: 'Ubuntu_400Regular',
  },

});
