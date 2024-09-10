import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

const {  height } = Dimensions.get('window');

const NotificationsPreferences = ({navigation}) => {
  // State variables for notification preferences
  const [sessionReminders, setSessionReminders] = useState(true);
  const [newTutorAvailability, setNewTutorAvailability] = useState(false);
  const [generalUpdates, setGeneralUpdates] = useState(false);
  const [promotionalNotifications, setPromotionalNotifications] = useState(true);

  const handleSavePreferences = () => {
    // Save the preferences (this would typically be saved to a backend or local storage)
    console.log('Notification preferences saved:', {
      sessionReminders,
      newTutorAvailability,
      generalUpdates,
      promotionalNotifications,
    });
    alert('Your preferences have been saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#010202" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification Preferences</Text>
      </View>

      <View style={styles.preferenceRow}>
        <Text style={styles.preferenceText}>Session Reminders</Text>
        <Switch
          value={sessionReminders}
          onValueChange={setSessionReminders}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.preferenceRow}>
        <Text style={styles.preferenceText}>New Tutor Availability</Text>
        <Switch
          value={newTutorAvailability}
          onValueChange={setNewTutorAvailability}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.preferenceRow}>
        <Text style={styles.preferenceText}>General Updates</Text>
        <Switch
          value={generalUpdates}
          onValueChange={setGeneralUpdates}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.preferenceRow}>
        <Text style={styles.preferenceText}>Promotional Notifications</Text>
        <Switch
          value={promotionalNotifications}
          onValueChange={setPromotionalNotifications}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: height,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    padding: 10, // Increased padding for better touchable area
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Center the text with flex
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  preferenceText: {
    fontSize: 18,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationsPreferences;
