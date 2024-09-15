import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'; //// Added ActivityIndicator import
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../Config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function TutorDetails4({ route, navigation }) {

  const { role, email, password, firstName, lastName, phoneNumber, gender, address, dateOfBirth } = route.params;
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState([]); 
  const [courses, setCourses] = useState([]); //// Updated to array to allow multiple course selections
  const [rate, setRate] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false); //// Added for courses modal
  const [loading, setLoading] = useState(false); //// Added loading state
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  const languageOptions = [
    { id: 'en', name: 'English' }, 
    { id: 'xh', name: 'Xhosa' },
    { id: 'zu', name: 'Zulu' },
    { id: 'ss', name: 'Swati' },
    { id: 'nr', name: 'Ndebele' },
    { id: 'nso', name: 'Northern Sotho' },
    { id: 'st', name: 'Sotho' },
    { id: 'ts', name: 'Tsonga' },
    { id: 'tn', name: 'Tswana' },
    { id: 've', name: 'Venda' },
    { id: 'af', name: 'Afrikaans' }, 
  ];

  //// Alphabetically sorted list of courses
  const courseOptions = [ //// Added courses as per the user's request
    { id: 'ACC1006F/S', name: 'ACC1006F/S' },
    { id: 'AGE1002S', name: 'AGE1002S' },
    { id: 'AST1000S', name: 'AST1000S' },
    { id: 'BIO1000F', name: 'BIO1000F' },
    { id: 'BIO1004S', name: 'BIO1004S' },
    { id: 'CEM1000W', name: 'CEM1000W' },
    { id: 'CSC1015F/S', name: 'CSC1015F/S' },
    { id: 'CSC1016S', name: 'CSC1016S' },
    { id: 'EGS1003S', name: 'EGS1003S' },
    { id: 'FTX1005F/S', name: 'FTX1005F/S' },
    { id: 'GEO1009F', name: 'GEO1009F' },
    { id: 'MAM1000W', name: 'MAM1000W' },
    { id: 'MAM1019H', name: 'MAM1019H' },
    { id: 'MAM1031F', name: 'MAM1031F' },
    { id: 'MAM1032S', name: 'MAM1032S' },
    { id: 'MAM1043H', name: 'MAM1043H' },
    { id: 'MAM1044H', name: 'MAM1044H' },
    { id: 'PHY1004W', name: 'PHY1004W' },
    { id: 'PHY1031F', name: 'PHY1031F' },
    { id: 'STA1000F/S', name: 'STA1000F/S' },
    { id: 'STA1006S', name: 'STA1006S' },
    { id: 'STA1007S', name: 'STA1007S' },
    // Add more courses as needed
  ];

  const handleLanguageSelection = (language) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter((lang) => lang !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const handleCourseSelection = (course) => { //// Added course selection logic
    if (courses.includes(course)) {
      setCourses(courses.filter((c) => c !== course));
    } else {
      setCourses([...courses, course]);
    }
  };

  const handleNext = async () => {
    if (!experience || !languages.length || !courses.length || !rate) {
      setError('Please fill in all fields.');
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    try {
      setLoading(true); //// Start loading
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const userId = userCredential.user.uid;

      // Construct the user object
      const userDets = {
        _id: userId,
        name: firstName,
        lastName,
        imageUrl: '',
        phoneNumber,
        gender,
        address,
        dateOfBirth,
        experience,
        languages,
        courses,
        rating: 0,
        reviews: [],
        ratingCount: 0,
        rate,
        role,
        createdAt: new Date(),
        providerData: userCredential.user.providerData[0] || null,
      };

      // Save the user object to the 'Tutors' collection
      await setDoc(doc(firestoreDB, 'Tutors', userId), userDets);

      // Save the user data to the 'users' collection
      const data = {
        _id: userCredential?.user.uid,
        ImageUrl: '',
        name: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        role: role,
        providerData: userCredential.user.providerData[0] || null,
      };
      await setDoc(doc(firestoreDB, 'users', userId), data);

      setLoading(false); //// Stop loading after success

      // Pass the entire user object to the next screen
      navigation.navigate('TutorDetails5', { userDets });

    } catch (error) {
      setLoading(false); //// Stop loading on error
      console.error('Error creating user:', error.message);
      setError(error.message);
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 2000);
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
        <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.10 }]}>
          <Text style={[styles.title, { fontSize: width * 0.05 }]}>Apply to become a tutor</Text>
          {showError && (<Text style={styles.error}>{error}</Text>)}
          <RNPickerSelect
            onValueChange={(value) => setExperience(value)}
            placeholder={{ label: "Tutoring experience", value: "" }}
            items={[
              { label: "0-1 years", value: "0-1" },
              { label: "1-2 years", value: "1-2" },
              { label: "2-3 years", value: "2-3" },
              { label: "3-4 years", value: "3-4" },
              { label: "4-5 years", value: "4-5" },
              { label: "5+ years", value: "5+" },
            ]}
            style={pickerSelectStyles}
            value={experience}
          />

          <TouchableOpacity
            style={[styles.input, styles.languageInput]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageText}>
              {languages.length > 0 ? languages.join(', ') : 'Languages'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, styles.languageInput]} //// Reusing style for courses
            onPress={() => setShowCourseModal(true)} //// Added for showing course modal
          >
            <Text style={styles.languageText}>
              {courses.length > 0 ? courses.join(', ') : 'Courses'}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Rate per hour (ZAR)"
            style={[styles.input, { paddingVertical: height * 0.02 }]}
            placeholderTextColor="#a9a9a9"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.button, { paddingVertical: height * 0.02 }]}
            onPress={handleNext}
            disabled={loading} //// Disable button when loading
          >
            {loading ? ( //// Show loading spinner when loading
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Languages</Text>
            <Text style={styles.modalSubtitle}>You can select multiple languages</Text>
            <ScrollView>
              {languageOptions.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  onPress={() => handleLanguageSelection(language.name)}
                  style={styles.modalOption}
                >
                  <Text style={styles.languageText}>{language.name}</Text>
                  {languages.includes(language.name) && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Course Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCourseModal} //// Added course modal visibility
        onRequestClose={() => setShowCourseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Courses</Text>
            <Text style={styles.modalSubtitle}>You can select multiple courses</Text>
            <ScrollView>
              {courseOptions.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  onPress={() => handleCourseSelection(course.name)} //// Updated to handle course selection
                  style={styles.modalOption}
                >
                  <Text style={styles.languageText}>{course.name}</Text>
                  {courses.includes(course.name) && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCourseModal(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50,
    fontSize: 16,
    color: '#00243a',
  },
  inputAndroid: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50,
    fontSize: 16,
    color: '#00243a',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensures the image covers the entire screen width
    height: '100%', // Ensures the image covers the entire screen height
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  languageInput: {
    justifyContent: 'center',
    height: 50, // Ensure it's the same height as other inputs
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu_400Regular',
    color: '#777',
    marginBottom: 10,
    textAlign: 'left',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
  },
  checkMark: {
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
    color: '#00243a',
  },
  closeButton: {
    backgroundColor: '#00243a',
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
  },
});
