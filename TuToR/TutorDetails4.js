import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Alert, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function TutorDetails4({ navigation }) {
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState('');
  const [rate, setRate] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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

  const handleLanguageSelection = (language) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter((lang) => lang !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const handleNext = () => {
    if (!experience || !languages.length || !courses || !rate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Navigate to the next screen or handle the action
    navigation.navigate('NextScreen'); // Replace 'NextScreen' with the actual screen name
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/images/LoadingPage.png')} 
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.10 }]}>
          <Text style={[styles.title, { fontSize: width * 0.05 }]}>Apply to become a tutor</Text>
          
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={experience}
              style={[styles.picker, { paddingVertical: height * 0.02 }]}
              onValueChange={(itemValue) => setExperience(itemValue)}
            >
              <Picker.Item label="Tutoring experience" value="" />
              <Picker.Item label="0-1 years" value="0-1" />
              <Picker.Item label="1-2 years" value="1-2" />
              <Picker.Item label="2-3 years" value="2-3" />
              <Picker.Item label="3-4 years" value="3-4" />
              <Picker.Item label="4-5 years" value="4-5" />
              <Picker.Item label="5+ years" value="5+" />
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.input, styles.languageInput]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageText}>
              {languages.length > 0 ? languages.join(', ') : 'Languages'}
            </Text>
          </TouchableOpacity>

          <TextInput 
            placeholder="Courses" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={courses}
            onChangeText={setCourses}
          />

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
          >
            <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Next</Text>
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
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#00243a',
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
