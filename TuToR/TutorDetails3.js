import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function TutorDetails3({ navigation }) {
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const windowDimensions = Dimensions.get('window');
  const height = windowDimensions.height;
  const width = windowDimensions.width;

  const handleNext = () => {
    if (!gender || !address || !dateOfBirth) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Navigate to the next screen or handle the action
    navigation.navigate('TutorDetails4');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/images/LoadingPage.png')} 
        style={styles.background} 
        imageStyle={styles.imageStyle}
      >
        <View style={[styles.contentContainer, { padding: width * 0.05, marginTop: height * 0.15 }]}>
          <Text style={[styles.title, { fontSize: width * 0.05 }]}>Apply to become a tutor</Text>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              style={[styles.picker, { paddingVertical: height * 0.02 }]}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          
          <TextInput 
            placeholder="Address" 
            style={[styles.input, { paddingVertical: height * 0.02 }]} 
            placeholderTextColor="#a9a9a9" 
            value={address}
            onChangeText={setAddress}
          />

          {/* Label for Date of Birth */}
          <Text style={[styles.label, { fontSize: width * 0.04 }]}>Date of Birth</Text>
          
          <TouchableOpacity
            style={[styles.input, styles.dateInput, { paddingVertical: height * 0.02 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>{dateOfBirth.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || dateOfBirth;
                setShowDatePicker(false);
                setDateOfBirth(currentDate);
              }}
            />
          )}

          <TouchableOpacity 
            style={[styles.button, { paddingVertical: height * 0.02 }]}
            onPress={handleNext}
          >
            <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Next</Text>
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
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  dateInput: {
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 5,
    alignSelf: 'flex-start',
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
});
