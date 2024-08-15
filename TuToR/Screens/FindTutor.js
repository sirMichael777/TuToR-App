import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const FindTutorScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customRequest, setCustomRequest] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [selectedMode, setSelectedMode] = useState('In Person');

  const tutors = [
    {
      id: 1,
      name: 'Michael Maseko',
      rating: 4.7,
      ratingsCount: 17,
      price: 'R250/hr',
      image: require('../assets/Profile.png'), // Replace with actual image path
    },
    {
      id: 2,
      name: 'Thabang Mokoena',
      rating: 4.4,
      ratingsCount: 31,
      price: 'R230/hr',
      image: require('../assets/Profile.png'), // Replace with actual image path
    },
  ];

  const options = [
    'Exam Preparation',
    'Homework Assistance',
    'Concept Clarification',
    'Project Guidance',
    'General Tutoring',
    'Other/Custom Request',
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
            <View style={styles.stepContainer}>
              <Text style={styles.questionText}>Which course do you need assistance with?</Text>
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search for course</Text>
              </TouchableOpacity>
            </View>
        );
      case 1:
        return (
            <View style={styles.stepContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Select Date</Text>
              </TouchableOpacity>
              {showDatePicker && (
                  <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                      }}
                  />
              )}

              <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartTimePicker(true)}>
                <Text style={styles.buttonText}>Select Start Time</Text>
              </TouchableOpacity>
              {showStartTimePicker && (
                  <DateTimePicker
                      value={startTime}
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowStartTimePicker(false);
                        if (selectedTime) {
                          setStartTime(selectedTime);
                          if (endTime) {
                            const duration = calculateDuration(selectedTime, endTime);
                            setSessionDuration(duration);
                          }
                        }
                      }}
                  />
              )}

              <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndTimePicker(true)}>
                <Text style={styles.buttonText}>Select End Time</Text>
              </TouchableOpacity>
              {showEndTimePicker && (
                  <DateTimePicker
                      value={endTime}
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowEndTimePicker(false);
                        if (selectedTime) {
                          setEndTime(selectedTime);
                          if (startTime) {
                            const duration = calculateDuration(startTime, selectedTime);
                            setSessionDuration(duration);
                          }
                        }
                      }}
                  />
              )}

              {sessionDuration !== '' && (
                  <Text style={styles.durationText}>Session Duration: {sessionDuration}</Text>
              )}
            </View>
        );

      case 2:
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.instructionText}>
                Tell us what you need help with so we can match you with the right tutor.
              </Text>
              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionButton}
                        onPress={() => setSelectedOption(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedOption === option && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                ))}
                {selectedOption === 'Other/Custom Request' && (
                    <TextInput
                        style={styles.customRequestInput}
                        placeholder="Please specify any specific topics, chapters, or questions you'd like to focus on."
                        placeholderTextColor="#ccc"
                        multiline={true}
                        value={customRequest}
                        onChangeText={setCustomRequest}
                    />
                )}
              </View>
            </ScrollView>
        );
      case 3:
        return (
            <View style={styles.stepContainer}>
              <View style={styles.modeContainer}>
                <TouchableOpacity onPress={() => setSelectedMode('Online')}>
                  <Text style={[
                    styles.modeText,
                    selectedMode === 'Online' && styles.activeModeText
                  ]}>Online</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedMode('In Person')}>
                  <Text style={[
                    styles.modeText,
                    selectedMode === 'In Person' && styles.activeModeText
                  ]}>In Person</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.availableText}>2 available</Text>
              <ScrollView style={styles.tutorList}>
                {tutors.map(tutor => (
                    <View key={tutor.id} style={styles.tutorCard}>
                      <Image source={tutor.image} style={styles.tutorImage} />
                      <View style={styles.tutorInfo}>
                        <Text style={styles.tutorName}>{tutor.name}</Text>
                        <Text style={styles.tutorRating}>
                          ⭐ {tutor.rating} ({tutor.ratingsCount} ratings)
                        </Text>
                        <Text style={styles.tutorPrice}>{tutor.price}</Text>
                        <TouchableOpacity style={styles.selectButton}>
                          <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                ))}
              </ScrollView>
            </View>
        );
      default:
        return null;
    }
  };

  const handleBackPress = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} disabled={currentStep === 0}>
            <Ionicons name="arrow-back-outline" size={width * 0.07} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Find Tutor</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
            <Ionicons name="notifications-outline" size={width * 0.07} color="black" style={styles.notificationIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, currentStep >= 0 && styles.progressStepActive]} />
          <View style={[styles.progressStep, currentStep >= 1 && styles.progressStepActive]} />
          <View style={[styles.progressStep, currentStep >= 2 && styles.progressStepActive]} />
          <View style={[styles.progressStep, currentStep >= 3 && styles.progressStepActive]} />
        </View>

        {renderStepContent()}

        <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 3}
        >
          {currentStep < 3 && <Text style={styles.nextButtonText}>Next</Text>}
        </TouchableOpacity>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    paddingBottom: height * 0.08, // Added padding to account for the bottom navigation
  },
  header: {
    top: height*0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    left: width*0.09,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  profileIcon: {
    marginLeft: 15,
  },
  progressContainer: {
    top: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  progressStepActive: {
    backgroundColor: '#000',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: width * 0.05,
    marginVertical: height * 0.03,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  timeButton: {
    backgroundColor: '#23cbfb',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  durationText: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    color: '#000',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: width * 0.05,
    marginVertical: height * 0.03,
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#23cbfb',
    borderRadius: width * 0.05,
    padding: width * 0.05,
  },
  optionButton: {
    paddingVertical: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#ffffff',
    fontSize: width * 0.045,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#000',
  },
  customRequestInput: {
    marginTop: height * 0.02,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#000',
    height: height * 0.1,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    borderRadius: width * 0.05,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    bottom: height * 0.03, // Adjusted to account for navigation bar
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: height * 0.02,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  tutorList: {
    flex: 1,
  },
  tutorCard: {
    flexDirection: 'row',
    backgroundColor: '#23cbfb',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  tutorImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    marginRight: width * 0.05,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.01,
  },
  tutorRating: {
    fontSize: width * 0.04,
    color: '#fff',
    marginBottom: height * 0.005,
  },
  tutorPrice: {
    fontSize: width * 0.045,
    color: '#fff',
    marginBottom: height * 0.01,
  },
  selectButton: {
    backgroundColor: '#000',
    borderRadius: width * 0.03,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.02,
  },
  modeText: {
    fontSize: width * 0.045,
    marginHorizontal: width * 0.03,
    color: '#aaa',
  },
  activeModeText: {
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline',
  },
  availableText: {
    fontSize: width * 0.045,
    color: '#777',
    marginVertical: height * 0.01,
  },
  scrollContainer: undefined,
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  notificationIcon: {
    left: width * 0.13,
  }

});



export default FindTutorScreen;
