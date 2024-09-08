import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, Image, SafeAreaView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB, storage } from '../Config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const PersonalInfo = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const userId = firebaseAuth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingProfile(true);
        const userDoc = await getDoc(doc(firestoreDB, 'users', userId));
        const userData = userDoc.data();
        if (userData) {
          setName(userData.name || '');
          setLastName(userData.lastName || '');
          setPhoneNumber(userData.phoneNumber || '');
          setGender(userData.gender || '');
          setAddress(userData.address || '');
          setProfilePictureUrl(userData.profilePicture || '');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveChanges = async () => {
    if (!name || !lastName || !phoneNumber || !gender || !address) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(firestoreDB, 'users', userId);

      await updateDoc(userDocRef, {
        name: name,
        lastName: lastName,
        phoneNumber: phoneNumber,
        gender: gender,
        address: address,
        profilePicture: profilePictureUrl,
      });

      Alert.alert('Success', 'Your information has been updated.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user information: ', error);
      Alert.alert('Error', 'Failed to update information.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setUploadingImage(true);

      try {
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_pictures/${userId}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        setProfilePictureUrl(url);
        console.log('Image uploaded successfully! URL:', url);
      } catch (error) {
        console.error('Error uploading image:', error.message || error);
        Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00243a" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Update Personal Information</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.profilePictureContainer}>
        {profilePictureUrl ? (
          <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
        ) : profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <Text style={styles.profilePictureText}>Add Profile Picture</Text>
        )}
      </TouchableOpacity>

      {uploadingImage && (
        <ActivityIndicator size="small" color="#00243a" style={styles.uploadingIndicator} />
      )}

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={setPhoneNumber}
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your gender"
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: '#333333',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: height * 0.02,
    marginVertical: 10,
    fontSize: width * 0.04,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#00243a',
    borderRadius: 25,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  profilePicture: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  profilePictureText: {
    fontSize: width * 0.05,
    color: '#cccccc',
  },
  uploadingIndicator: {
    marginTop: 10,
  },
});

export default PersonalInfo;
